/**
 * Zod validation schemas for theme tokens
 */
import { semanticRoles } from "@/types/theme";
import { z } from "zod";

/**
 * HSL triplet format: "H S% L%"
 * Examples: "118 19% 41%", "44 48% 94%"
 */
export const HslSchema = z
  .string()
  .regex(
    /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/,
    "HSL must be in format 'H S% L%' (e.g., '118 19% 41%')"
  );

export const ShadeStopSchema = z.object({
  key: z.string().min(1),
  hsl: HslSchema,
});

export const BaseColorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  hsl: HslSchema,
  scale: z.array(ShadeStopSchema),
  locked: z.boolean().optional(),
});

export const RoleMappingItemSchema = z.object({
  baseColorId: z.string().min(1),
  shadeKey: z.string().optional(),
});

export const RoleMappingSchema = z.record(
  z.enum(semanticRoles),
  RoleMappingItemSchema
);

export const SchemeNameSchema = z.enum(["light", "dark"]);

export const ThemeTokensSchema = z.object({
  name: z.string().min(1),
  version: z.literal(1),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  palette: z
    .array(BaseColorSchema)
    .min(1, "Palette must have at least one color"),
  schemes: z.object({
    light: RoleMappingSchema,
    dark: RoleMappingSchema,
  }),
});

/**
 * Validate theme tokens and return friendly error messages
 */
export function validateThemeTokens(data: unknown): {
  success: boolean;
  data?: z.infer<typeof ThemeTokensSchema>;
  errors?: string[];
} {
  const result = ThemeTokensSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return `${path}: ${err.message}`;
  });

  return { success: false, errors };
}
