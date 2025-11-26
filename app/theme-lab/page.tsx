"use client";

/**
 * Theme Lab Page
 * A visual theme editor with palette management, role mapping, and live preview
 */
import { PaletteToolbar } from "@/components/theme/PaletteToolbar";
import { PreviewGallery } from "@/components/theme/PreviewGallery";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useThemeTokens } from "@/components/theme/useThemeTokens";
import { Button } from "@/components/ui/button";
import { copyShareableUrl } from "@/lib/url";
import type { BaseColor, SemanticRole } from "@/types/theme";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
const RoleMappingEditor = dynamic(
  () =>
    import("@/components/theme/RoleMappingEditor").then(
      (m) => m.RoleMappingEditor
    ),
  { ssr: false }
);

export default function ThemeLabPage() {
  const {
    tokens,
    setTokens,
    scheme,
    setScheme,
    toggleScheme,
    compareMode,
    compareTokens,
    setCompareTokens,
    enableCompare,
    disableCompare,
    copyMappingToCompare,
    importTheme,
    exportTheme,
    resetTheme,
  } = useThemeTokens();

  const [importError, setImportError] = useState<string[]>([]);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [highlightedRole, setHighlightedRole] = useState<SemanticRole | null>(
    null
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "i" && !e.ctrlKey && !e.metaKey) {
        handleImport();
      } else if (e.key === "e" && !e.ctrlKey && !e.metaKey) {
        handleExport();
      } else if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleShare();
      } else if (e.key === "d" && !e.ctrlKey && !e.metaKey) {
        toggleScheme();
      } else if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
        if (compareMode) {
          disableCompare();
        } else {
          enableCompare();
        }
      } else if (e.key === "r" && !e.ctrlKey && !e.metaKey) {
        if (
          confirm("Reset to example theme? This will discard your changes.")
        ) {
          resetTheme();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [compareMode, toggleScheme, enableCompare, disableCompare, resetTheme]);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const result = importTheme(text);

      if (!result.success) {
        setImportError(result.errors || ["Unknown error"]);
        setTimeout(() => setImportError([]), 5000);
      } else {
        setImportError([]);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const json = exportTheme();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tokens.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const success = await copyShareableUrl(tokens);
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const handleRoleActivate = useCallback((role: SemanticRole) => {
    setHighlightedRole(role);
  }, []);

  const clearHighlightedRole = useCallback(() => {
    setHighlightedRole(null);
  }, []);

  const handlePaletteChange = (index: number, color: BaseColor) => {
    setTokens((prev) => {
      const newPalette = [...prev.palette];
      newPalette[index] = color;
      return { ...prev, palette: newPalette };
    });
  };

  const handlePaletteDelete = (index: number) => {
    setTokens((prev) => {
      const newPalette = prev.palette.filter((_, i) => i !== index);
      return { ...prev, palette: newPalette };
    });
  };

  const handlePaletteAdd = () => {
    setTokens((prev) => {
      const nextIndex = prev.palette.length + 1;
      const newColor: BaseColor = {
        id: `color-${Date.now().toString(36)}`,
        name: `Color ${nextIndex}`,
        hsl: "210 50% 50%",
        scale: [],
      };

      return { ...prev, palette: [...prev.palette, newColor] };
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Theme Lab</h1>
              <p className="text-sm text-neutral-600">
                Visual theme editor with live preview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleScheme}
                title="Toggle scheme (D)"
                className="border-neutral-300 bg-white text-black hover:bg-neutral-100"
              >
                {scheme === "light" ? "🌙" : "☀️"} {scheme}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={compareMode ? disableCompare : enableCompare}
                title="Compare mode (C)"
                className="border-neutral-300 bg-white text-black hover:bg-neutral-100"
              >
                {compareMode ? "Exit Compare" : "Compare"}
              </Button>

              <div className="h-6 w-px bg-neutral-300" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleImport}
                title="Import (I)"
                className="text-black hover:bg-neutral-100"
              >
                Import
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                title="Export (E)"
                className="text-black hover:bg-neutral-100"
              >
                Export
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                title="Share (S)"
                className="text-black hover:bg-neutral-100"
              >
                {shareSuccess ? "✓ Copied!" : "Share"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Reset to example theme?")) {
                    resetTheme();
                  }
                }}
                title="Reset (R)"
                className="text-black hover:bg-neutral-100"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Error display */}
          {importError.length > 0 && (
            <div className="mt-4 rounded-md border border-red-300 bg-white p-3 text-sm text-black">
              <strong className="text-red-600">Import errors:</strong>
              <ul className="ml-4 mt-1 list-disc text-neutral-700">
                {importError.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Keyboard shortcuts hint */}
      <div className="border-b border-neutral-200 bg-neutral-100 px-4 py-2 text-xs text-neutral-600">
        <div className="container mx-auto space-x-1">
          Shortcuts:
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            I
          </kbd>{" "}
          Import,
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            E
          </kbd>{" "}
          Export,
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            S
          </kbd>{" "}
          Share,
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            D
          </kbd>{" "}
          Toggle Dark,
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            C
          </kbd>{" "}
          Compare,
          <kbd className="rounded border border-neutral-300 bg-white px-1 text-black">
            R
          </kbd>{" "}
          Reset
        </div>
      </div>

      {/* Main content */}
      {compareMode ? (
        // Compare mode: palette toolbar + side-by-side previews
        <div className="space-y-6">
          <PaletteToolbar
            palette={tokens.palette}
            onChange={(index: number, updated: BaseColor) =>
              handlePaletteChange(index, updated)
            }
            onDelete={handlePaletteDelete}
            onAdd={handlePaletteAdd}
          />
          <div className="grid gap-6 px-4 pb-8 lg:grid-cols-2 lg:px-6">
            <ThemeProvider
              tokens={tokens}
              scheme={scheme}
              setTokens={setTokens}
              setScheme={setScheme}
              className="space-y-4 rounded-lg border bg-background p-4 text-foreground shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Theme A</h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyMappingToCompare}
                >
                  Copy to B →
                </Button>
              </div>
              <PreviewGallery />
            </ThemeProvider>

            <ThemeProvider
              tokens={compareTokens}
              scheme={scheme}
              setTokens={setCompareTokens}
              setScheme={setScheme}
              className="space-y-4 rounded-lg border bg-background p-4 text-foreground shadow-sm"
            >
              <div>
                <h2 className="font-semibold">Theme B</h2>
              </div>
              <PreviewGallery onRoleActivate={handleRoleActivate} />
            </ThemeProvider>
          </div>
        </div>
      ) : (
        // Normal mode: toolbar + sidebar layout
        <div className="space-y-6">
          <PaletteToolbar
            palette={tokens.palette}
            onChange={(index: number, updated: BaseColor) =>
              handlePaletteChange(index, updated)
            }
            onDelete={handlePaletteDelete}
            onAdd={handlePaletteAdd}
          />
          <div className="flex flex-col gap-8 px-4 pb-8 lg:flex-row lg:items-start lg:px-6 lg:gap-10">
            <aside className="flex flex-col border-b border-neutral-200 bg-white p-4 lg:w-96 lg:flex-none lg:rounded-lg lg:border lg:border-neutral-200 lg:bg-white lg:shadow-sm lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
              <div className="mb-4 space-y-1">
                <h2 className="text-lg font-semibold">Role Mapping</h2>
                <p className="text-xs text-neutral-600">
                  Assign palette colors to semantic roles. Locked roles follow
                  system defaults.
                </p>
              </div>
              <RoleMappingEditor
                scheme={scheme}
                mapping={tokens.schemes[scheme]}
                palette={tokens.palette}
                onChange={(newMapping) => {
                  setTokens((prev) => ({
                    ...prev,
                    schemes: {
                      ...prev.schemes,
                      [scheme]: newMapping,
                    },
                  }));
                  clearHighlightedRole();
                }}
                highlightedRole={highlightedRole}
                onClearHighlight={clearHighlightedRole}
              />
            </aside>

            <main className="flex-1">
              <div className="mx-auto w-full max-w-5xl space-y-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <ThemeProvider
                  tokens={tokens}
                  scheme={scheme}
                  setTokens={setTokens}
                  setScheme={setScheme}
                  className="space-y-6 rounded-lg border bg-background p-6 text-foreground shadow-sm"
                >
                  <PreviewGallery onRoleActivate={handleRoleActivate} />
                </ThemeProvider>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
