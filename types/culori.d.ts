declare module "culori" {
  export interface Hsl {
    mode: "hsl";
    h?: number;
    s?: number;
    l?: number;
    alpha?: number;
  }

  export interface Oklch {
    mode: "oklch";
    l?: number;
    c?: number;
    h?: number;
    alpha?: number;
  }

  export interface Rgb {
    mode: "rgb";
    r?: number;
    g?: number;
    b?: number;
    alpha?: number;
  }

  export type Color = Hsl | Oklch | Rgb | any;

  export function hsl(
    color: Color | { h?: number; s?: number; l?: number }
  ): Hsl | undefined;
  export function oklch(color: Color): Oklch | undefined;
  export function rgb(color: Color): Rgb | undefined;
  export function clampRgb(color: Color): Color;
  export function clampGamut(mode?: string): (color: Color) => Color;
  export function converter(mode: string): (color: Color) => Color;
}
