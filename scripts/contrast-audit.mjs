#!/usr/bin/env node
/* eslint-env node */

// Contrast audit script for portfolio theme
// Computes WCAG contrast ratios for key semantic pairs.
import fs from "fs";
import path from "path";

function parseHSL(hslStr) {
  // Expect "h s% l%" (h may have deg? not used)
  const [h, s, l] = hslStr.split(/\s+/);
  return { h: parseFloat(h), s: parseFloat(s), l: parseFloat(l) };
}

function hslToRgb({ h, s, l }) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

function relativeLuminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(L1, L2) {
  const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (light + 0.05) / (dark + 0.05);
}

function getColorById(theme, id) {
  return theme.palette.find((c) => c.id === id);
}

const themePath = path.resolve(process.cwd(), "portfolio-theme-final.json");
let raw, theme;
try {
  raw = fs.readFileSync(themePath, "utf8");
  theme = JSON.parse(raw);
} catch (e) {
  console.error("Failed to load theme JSON:", e.message);
  process.exit(1);
}

const rolesToAudit = [
  ["foreground", "background"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["destructive-foreground", "destructive"],
  ["muted-foreground", "muted"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
];

function roleColorHsl(scheme, role) {
  const entry = scheme[role];
  if (!entry) return null;
  const color = getColorById(theme, entry.baseColorId);
  if (!color) return null;
  return color.hsl;
}

function auditScheme(schemeName) {
  const scheme = theme.schemes[schemeName];
  const results = rolesToAudit.map(([fgRole, bgRole]) => {
    const fgHsl = roleColorHsl(scheme, fgRole);
    const bgHsl = roleColorHsl(scheme, bgRole);
    if (!fgHsl || !bgHsl)
      return { pair: `${fgRole}/${bgRole}`, error: "missing" };
    const fgRgb = hslToRgb(parseHSL(fgHsl));
    const bgRgb = hslToRgb(parseHSL(bgHsl));
    const cr = contrastRatio(
      relativeLuminance(fgRgb),
      relativeLuminance(bgRgb)
    );
    return { pair: `${fgRole} vs ${bgRole}`, ratio: cr };
  });
  return results;
}

const light = auditScheme("light");
const dark = auditScheme("dark");

function format(results) {
  return results
    .map((r) => {
      if (r.error) return `${r.pair}: ERROR (${r.error})`;
      const passAA = r.ratio >= 4.5 ? "AA" : r.ratio >= 3 ? "AA Large" : "Fail";
      return `${r.pair}: ${r.ratio.toFixed(2)} (${passAA})`;
    })
    .join("\n");
}

console.log("Contrast Audit:\n");
console.log("Light Scheme:\n" + format(light) + "\n");
console.log("Dark Scheme:\n" + format(dark) + "\n");

// Provide JSON output for further automation if needed
const summary = { light, dark };
fs.writeFileSync(
  path.resolve(process.cwd(), "contrast-audit-output.json"),
  JSON.stringify(summary, null, 2)
);
console.log("Wrote contrast-audit-output.json");
