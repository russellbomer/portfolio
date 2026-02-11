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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-background border border-border rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="font-display text-xl font-medium mb-3">
              Viewing Tip
            </h2>
            <p className="text-muted-foreground mb-4">
              To zoom and explore this flowchart in detail, you'll need to open it directly in Figma.
            </p>
            <div className="flex gap-3">
              <a
                href={FIGMA_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-mono transition-colors text-center"
              >
                Open in Figma ↗
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-mono transition-colors"
              >
                View Here
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}


