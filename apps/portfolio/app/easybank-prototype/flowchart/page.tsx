"use client";

import { useState, useEffect } from "react";

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1311&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&embed-host=share";

const FIGMA_DIRECT_URL = 
  "https://www.figma.com/design/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1311&t=flowchart";

export default function EasybankFlowchartPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <article id="main-content" className="h-[100dvh] w-full relative">
      <iframe
        title="Easybank flowchart"
        src={FIGMA_EMBED_URL}
        className="h-full w-full"
        allowFullScreen
      />
      
      {showModal && (
        <div className="fixed bottom-10 right-6 z-50 max-w-[280px] animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs font-medium">💡 Viewing Tip</p>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs leading-none"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              To zoom and explore details, open this in Figma.
            </p>
            <a
              href={FIGMA_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-[11px] font-mono transition-colors"
            >
              Open in Figma ↗
            </a>
          </div>
        </div>
      )}
    </article>
  );
}


