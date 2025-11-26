#!/usr/bin/env node
/* eslint-env node */
/**
 * Non-blocking drift detection between README anchors overview table and ai/anchors.json domains.
 * Prints warnings if domains missing from table or extra entries in table.
 */
import fs from "fs";
import path from "path";

const domainAliasBySource = new Map([
  ["docs/phase-1-initiation-&-planning/1.1.txt", "Vision & Personas"],
  ["docs/phase-1-initiation-&-planning/1.2.txt", "Scope & Constraints"],
  [
    "docs/phase-1-initiation-&-planning/1.3.txt",
    "Organization & Collaboration",
  ],
  [
    "docs/phase-1-initiation-&-planning/1.4.txt",
    "Schedule & Milestones (MVP Week)",
  ],
]);

function deriveDomainsFromAnchors(anchors) {
  const files = anchors?._meta?.sourceOfTruthFiles;
  if (!Array.isArray(files)) return [];
  return files
    .map((file) => domainAliasBySource.get(file))
    .filter((domain) => typeof domain === "string");
}

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

  const expectedDomains = (() => {
    const derived = deriveDomainsFromAnchors(anchors);
    return derived.length
      ? derived
      : [
          "Vision & Personas",
          "Scope & Constraints",
          "Organization & Collaboration",
          "Schedule & Milestones (MVP Week)",
        ];
  })();
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
