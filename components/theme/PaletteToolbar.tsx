"use client";

import { useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  generateScale,
  hexToHsl,
  hslToHex,
  parseHslTriplet,
} from "@/lib/color";
import type { BaseColor, Hsl } from "@/types/theme";

interface PaletteToolbarProps {
  palette: BaseColor[];
  onChange: (index: number, color: BaseColor) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export function PaletteToolbar({
  palette,
  onChange,
  onDelete,
  onAdd,
}: PaletteToolbarProps) {
  return (
    <div className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
        <TooltipProvider delayDuration={150}>
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
            {palette.map((color, index) => (
              <PaletteSwatch
                key={color.id}
                color={color}
                index={index}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TooltipProvider>

        <Button size="sm" variant="outline" className="ml-auto" onClick={onAdd}>
          Add Color
        </Button>
      </div>
    </div>
  );
}

interface PaletteSwatchProps {
  color: BaseColor;
  index: number;
  onChange: (index: number, color: BaseColor) => void;
  onDelete: (index: number) => void;
}

function PaletteSwatch({
  color,
  index,
  onChange,
  onDelete,
}: PaletteSwatchProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>(color.name);
  const [hslValue, setHslValue] = useState<string>(color.hsl);
  const [hexValue, setHexValue] = useState<string>(hslToHex(color.hsl));

  useEffect(() => {
    setName(color.name);
  }, [color.name]);

  useEffect(() => {
    setHslValue(color.hsl);
    setHexValue(hslToHex(color.hsl));
  }, [color.hsl]);

  const updateColor = (next: BaseColor) => {
    onChange(index, next);
  };

  const handleNameBlur = () => {
    if (name.trim() !== color.name) {
      updateColor({ ...color, name: name.trim() });
    }
  };

  const handleHslChange = (value: string) => {
    setHslValue(value);
    try {
      parseHslTriplet(value as Hsl);
      updateColor({ ...color, hsl: value as Hsl });
    } catch {
      // ignore invalid input until it parses correctly
    }
  };

  const handleHexChange = (value: string) => {
    const nextHex = value.startsWith("#") ? value : `#${value}`;
    setHexValue(nextHex);
    try {
      const nextHsl = hexToHsl(nextHex);
      setHslValue(nextHsl);
      updateColor({ ...color, hsl: nextHsl });
    } catch {
      // ignore invalid hex until valid
    }
  };

  const handleGenerateScale = () => {
    const scale = generateScale(color.hsl);
    updateColor({ ...color, scale });
  };

  const handleClearScale = () => {
    updateColor({ ...color, scale: [] });
  };

  const handleDelete = () => {
    onDelete(index);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="relative size-9 rounded-full border border-border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: `hsl(${color.hsl})` }}
            >
              {color.locked && (
                <span
                  className="absolute -right-1 -top-1 text-xs"
                  title="Locked color"
                >
                  🔒
                </span>
              )}
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="text-xs font-semibold">{color.name}</p>
            <p className="text-[11px] text-muted-foreground">#{color.id}</p>
            <p className="text-[11px] text-muted-foreground">HSL {color.hsl}</p>
            <p className="text-[11px] text-muted-foreground">{hexValue}</p>
          </div>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80 space-y-4" align="start">
        <div className="flex items-start gap-3">
          <div
            className="size-12 shrink-0 rounded-md border"
            style={{ backgroundColor: `hsl(${color.hsl})` }}
          />
          <div className="flex-1">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleNameBlur}
              disabled={color.locked}
              className="h-8 text-sm"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>ID #{color.id}</span>
              <span>{color.scale.length} shades</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <HexColorPicker color={hexValue} onChange={handleHexChange} />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                Hex
              </label>
              <div className="mt-1 flex items-center gap-2 rounded border px-2">
                <span className="text-sm text-muted-foreground">#</span>
                <HexColorInput
                  color={hexValue.replace(/^#/, "")}
                  onChange={handleHexChange}
                  className="h-8 flex-1 border-0 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                HSL
              </label>
              <Input
                value={hslValue}
                onChange={(event) => handleHslChange(event.target.value)}
                className="h-8 font-mono text-[12px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button size="sm" variant="outline" onClick={handleGenerateScale}>
            Generate Scale
          </Button>
          {color.scale.length > 0 && (
            <Button size="sm" variant="ghost" onClick={handleClearScale}>
              Clear Scale
            </Button>
          )}
          {!color.locked && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-destructive"
              onClick={handleDelete}
            >
              Remove
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
