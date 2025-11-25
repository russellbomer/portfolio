"use client";

/**
 * ColorScaleEditor component
 * Generate and edit shade scales for base colors
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateScale, hslToHex, parseHslTriplet } from "@/lib/color";
import type { BaseColor, Hsl } from "@/types/theme";
import { useState } from "react";

interface ColorScaleEditorProps {
  color: BaseColor;
  onChange: (color: BaseColor) => void;
  onDelete?: () => void;
}

export function ColorScaleEditor({
  color,
  onChange,
  onDelete,
}: ColorScaleEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleGenerateScale = () => {
    const scale = generateScale(color.hsl);
    onChange({ ...color, scale });
  };

  const handleClearScale = () => {
    onChange({ ...color, scale: [] });
  };

  const handleHslChange = (newHsl: string) => {
    try {
      // Validate format
      parseHslTriplet(newHsl as Hsl);
      onChange({ ...color, hsl: newHsl as Hsl });
    } catch {
      // Invalid format, ignore
    }
  };

  const handleNameChange = (newName: string) => {
    onChange({ ...color, name: newName });
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        {/* Color swatch */}
        <div
          className="h-12 w-12 shrink-0 rounded border-2 border-border"
          style={{ backgroundColor: `hsl(${color.hsl})` }}
          title={hslToHex(color.hsl)}
        />

        <div className="flex-1 space-y-2">
          {/* Name and ID */}
          <div className="flex items-center gap-2">
            <Input
              value={color.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="h-8 font-medium"
              disabled={color.locked}
            />
            <code className="text-xs text-muted-foreground">#{color.id}</code>
            {color.locked && (
              <span
                className="text-xs text-amber-600"
                title="Brand color - locked"
              >
                🔒
              </span>
            )}
          </div>

          {/* HSL input */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`hsl-${color.id}`}
              className="text-xs text-muted-foreground w-12"
            >
              HSL:
            </Label>
            <Input
              id={`hsl-${color.id}`}
              value={color.hsl}
              onChange={(e) => handleHslChange(e.target.value)}
              placeholder="H S% L%"
              className="h-8 font-mono text-xs"
            />
          </div>

          {/* Scale controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateScale}
              className="h-7 text-xs"
            >
              Generate Scale
            </Button>
            {color.scale.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearScale}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="h-7 text-xs"
                >
                  {expanded ? "Hide" : "Show"} ({color.scale.length})
                </Button>
              </>
            )}
            {onDelete && !color.locked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="ml-auto h-7 text-xs text-destructive"
              >
                Delete
              </Button>
            )}
          </div>

          {/* Scale preview */}
          {expanded && color.scale.length > 0 && (
            <div className="mt-2 space-y-1 rounded border bg-muted/50 p-2">
              {color.scale.map((shade) => (
                <div
                  key={shade.key}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="h-6 w-12 rounded border"
                    style={{ backgroundColor: `hsl(${shade.hsl})` }}
                  />
                  <code className="w-12">{shade.key}</code>
                  <code className="flex-1 text-muted-foreground">
                    {shade.hsl}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
