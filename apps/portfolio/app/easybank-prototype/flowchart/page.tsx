"use client";

import { useState } from "react";

const FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1311&p=f&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&embed-host=share";

const FIGMA_DIRECT_URL = 
  "https://www.figma.com/proto/mmTjKCWHlcRFtLvrUASvnE/Easybank-App-Project?node-id=13-1311&scaling=scale-down&page-id=0%3A1";

export default function EasybankFlowchartPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <article id="main-content" className="h-[100dvh] w-full relative">
      <iframe
        title="Easybank flowchart"
        src={FIGMA_EMBED_URL}
        className="h-full w-full"
        allowFullScreen
      />
      
      {showModal && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-medium">💡 Viewing Tip</p>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors -mt-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              To zoom and explore details, open this in Figma.
            </p>
            <a
              href={FIGMA_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs font-mono transition-colors"
            >
              Open in Figma ↗
            </a>
          </div>
        </div>
      )}
    </article>
  );
}


