"use client";

import { Download, FolderOpen, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface FileInfo {
  name: string;
  size: number;
  modified: string;
}

interface FileDownloaderProps {
  sessionId: string | null;
  baseUrl: string;
}

/**
 * FileDownloader component
 *
 * Floating button that opens a modal to list and download files
 * generated during a terminal session.
 */
export function FileDownloader({ sessionId, baseUrl }: FileDownloaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!sessionId || !baseUrl) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/files?session=${sessionId}`);
      if (!res.ok) {
        if (res.status === 404) {
          // Session not found - might be new or cleaned up
          setFiles([]);
          return;
        }
        throw new Error(`Failed to fetch files: ${res.status}`);
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, baseUrl]);

  // Poll for files when modal is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    // Fetch immediately when opened
    fetchFiles();

    // Poll every 5 seconds
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, fetchFiles]);

  // Format file size for display
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Build download URL for a file
  const getDownloadUrl = (filename: string): string => {
    return `${baseUrl}/files/${encodeURIComponent(
      filename
    )}?session=${sessionId}`;
  };

  // Don't render if no session
  if (!sessionId) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 z-20 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30 group"
        aria-label="Download files"
        title="Download session files"
      >
        <FolderOpen className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
        {files.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[hsl(var(--eucalyptus))] text-[10px] font-bold flex items-center justify-center text-[hsl(var(--thorn))]">
            {files.length > 9 ? "9+" : files.length}
          </span>
        )}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 z-30 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Modal content */}
          <div
            className="bg-[hsl(var(--thorn))] border border-border/50 rounded-lg w-full max-w-md max-h-[60vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h3 className="font-mono text-sm text-white font-medium">
                Session Files
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchFiles}
                  disabled={loading}
                  className="p-1.5 hover:bg-muted/20 rounded transition-colors"
                  aria-label="Refresh file list"
                  title="Refresh"
                >
                  <RefreshCw
                    className={`h-4 w-4 text-white/70 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-muted/20 rounded transition-colors"
                  aria-label="Close"
                  title="Close"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {/* Error state */}
              {error && (
                <div className="mb-3 p-2 rounded bg-red-900/30 border border-red-500/30">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* Empty state */}
              {!loading && files.length === 0 && !error && (
                <div className="text-center py-8">
                  <FolderOpen className="h-10 w-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No files yet</p>
                  <p className="text-white/30 text-xs mt-1">
                    Generate outputs in quarry to see them here
                  </p>
                </div>
              )}

              {/* File list */}
              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm text-white font-mono truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-white/50 mt-0.5">
                          {formatSize(file.size)}
                        </p>
                      </div>
                      <a
                        href={getDownloadUrl(file.name)}
                        download={file.name}
                        className="p-2 rounded-lg hover:bg-muted/30 transition-colors shrink-0"
                        aria-label={`Download ${file.name}`}
                        title={`Download ${file.name}`}
                      >
                        <Download className="h-4 w-4 text-[hsl(var(--eucalyptus))] group-hover:text-[hsl(var(--eucalyptus))]" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {files.length > 0 && (
              <div className="px-4 py-3 border-t border-border/30 text-xs text-white/40">
                {files.length} file{files.length !== 1 ? "s" : ""} •{" "}
                {formatSize(files.reduce((sum, f) => sum + f.size, 0))} total
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
