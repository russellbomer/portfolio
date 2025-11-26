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
    <div className="border-b border-neutral-200 bg-white text-black">
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

        <Button
          size="sm"
          variant="outline"
          className="ml-auto border-neutral-300 text-black hover:bg-neutral-100"
          onClick={onAdd}
        >
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
              className="relative size-9 rounded-full border border-neutral-300 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
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
        <TooltipContent
          className="border border-neutral-200 bg-white text-black"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-black">{color.name}</p>
            <p className="text-[11px] text-neutral-600">#{color.id}</p>
            <p className="text-[11px] text-neutral-600">HSL {color.hsl}</p>
            <p className="text-[11px] text-neutral-600">{hexValue}</p>
          </div>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-80 space-y-4 border border-neutral-200 bg-white text-black"
        align="start"
      >
        <div className="flex items-start gap-3">
          <div
            className="size-12 shrink-0 rounded-md border border-neutral-300"
            style={{ backgroundColor: `hsl(${color.hsl})` }}
          />
          <div className="flex-1">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleNameBlur}
              disabled={color.locked}
              className="h-8 border border-neutral-300 bg-white text-sm text-black disabled:opacity-70"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-600">
              <span>ID #{color.id}</span>
              <span>{color.scale.length} shades</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <HexColorPicker color={hexValue} onChange={handleHexChange} />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wide text-neutral-600">
                Hex
              </label>
              <div className="mt-1 flex items-center gap-2 rounded border border-neutral-300 px-2">
                <span className="text-sm text-neutral-600">#</span>
                <HexColorInput
                  color={hexValue.replace(/^#/, "")}
                  onChange={handleHexChange}
                  className="h-8 flex-1 border-0 bg-transparent text-sm text-black outline-none"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wide text-neutral-600">
                HSL
              </label>
              <Input
                value={hslValue}
                onChange={(event) => handleHslChange(event.target.value)}
                className="h-8 border border-neutral-300 bg-white font-mono text-[12px] text-black"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button
            size="sm"
            variant="outline"
            className="border-neutral-300 text-black hover:bg-neutral-100"
            onClick={handleGenerateScale}
          >
            Generate Scale
          </Button>
          {color.scale.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-black hover:bg-neutral-100"
              onClick={handleClearScale}
            >
              Clear Scale
            </Button>
          )}
          {!color.locked && (
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-red-600 hover:bg-neutral-100"
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
