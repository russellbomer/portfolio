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
import type { BaseColor } from "@/types/theme";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Theme Lab</h1>
              <p className="text-sm text-muted-foreground">
                Visual theme editor with live preview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleScheme}
                title="Toggle scheme (D)"
              >
                {scheme === "light" ? "🌙" : "☀️"} {scheme}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={compareMode ? disableCompare : enableCompare}
                title="Compare mode (C)"
              >
                {compareMode ? "Exit Compare" : "Compare"}
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleImport}
                title="Import (I)"
              >
                Import
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                title="Export (E)"
              >
                Export
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                title="Share (S)"
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
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Error display */}
          {importError.length > 0 && (
            <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <strong>Import errors:</strong>
              <ul className="ml-4 mt-1 list-disc">
                {importError.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Keyboard shortcuts hint */}
      <div className="border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
        <div className="container mx-auto space-x-1">
          Shortcuts:
          <kbd className="rounded bg-background px-1">I</kbd> Import,
          <kbd className="rounded bg-background px-1">E</kbd> Export,
          <kbd className="rounded bg-background px-1">S</kbd> Share,
          <kbd className="rounded bg-background px-1">D</kbd> Toggle Dark,
          <kbd className="rounded bg-background px-1">C</kbd> Compare,
          <kbd className="rounded bg-background px-1">R</kbd> Reset
        </div>
      </div>

      {/* Main content */}
      {compareMode ? (
        // Compare mode: palette toolbar + side-by-side previews
        <div className="space-y-6">
          <PaletteToolbar
            palette={tokens.palette}
            onChange={(index, updated) => handlePaletteChange(index, updated)}
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
              <PreviewGallery />
            </ThemeProvider>
          </div>
        </div>
      ) : (
        // Normal mode: toolbar + sidebar layout
        <div className="space-y-6">
          <PaletteToolbar
            palette={tokens.palette}
            onChange={(index, updated) => handlePaletteChange(index, updated)}
            onDelete={handlePaletteDelete}
            onAdd={handlePaletteAdd}
          />
          <div className="flex flex-col gap-8 px-4 pb-8 lg:flex-row lg:items-start lg:px-6 lg:gap-10">
            <aside className="flex flex-col border-b bg-card/60 p-4 lg:w-96 lg:flex-none lg:rounded-lg lg:border lg:bg-card lg:shadow-sm lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
              <div className="mb-4 space-y-1">
                <h2 className="text-lg font-semibold">Role Mapping</h2>
                <p className="text-xs text-muted-foreground">
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
                }}
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
                  <PreviewGallery />
                </ThemeProvider>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
