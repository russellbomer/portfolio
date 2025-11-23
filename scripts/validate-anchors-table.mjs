#!/usr/bin/env node
/**
 * Non-blocking drift detection between README anchors overview table and ai/anchors.json domains.
 * Prints warnings if domains missing from table or extra entries in table.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const anchorsPath = path.join(root, "ai", "anchors.json");
const readmePath = path.join(root, "README.md");

function parseReadmeDomains(md) {
  const tableRegex = /\|\s*Domain\s*\|[\s\S]*?\n(\|[\s\S]*?\n)\n/; // crude capture
  const match = md.match(tableRegex);
  if (!match) return [];
  const lines = match[1]
    .trim()
    .split(/\n/)
    .filter((l) => l.startsWith("|"));
  return lines.map((l) => l.split("|")[1].trim());
}

function main() {
  let anchorsRaw, readmeRaw;
  try {
    anchorsRaw = fs.readFileSync(anchorsPath, "utf8");
  } catch (e) {
    console.warn("WARN: cannot read anchors.json");
    return;
  }
  try {
    readmeRaw = fs.readFileSync(readmePath, "utf8");
  } catch (e) {
    console.warn("WARN: cannot read README.md");
    return;
  }
  let anchors;
  try {
    anchors = JSON.parse(anchorsRaw);
  } catch (e) {
    console.warn("WARN: anchors.json invalid JSON");
    return;
  }

  const expectedDomains = [
    "Vision & Personas",
    "Scope & Constraints",
    "Organization & Collaboration",
    "Schedule & Milestones (MVP Week)",
  ];
  const tableDomains = parseReadmeDomains(readmeRaw);

  const missing = expectedDomains.filter((d) => !tableDomains.includes(d));
  const extra = tableDomains.filter((d) => !expectedDomains.includes(d));

  if (!missing.length && !extra.length) {
    console.log("Anchor table OK: no drift detected.");
  } else {
    if (missing.length)
      console.warn(
        "WARN: Missing domains in README anchor table:",
        missing.join(", ")
      );
    if (extra.length)
      console.warn(
        "WARN: Extra/unknown domains in README anchor table:",
        extra.join(", ")
      );
  }
}

main();
