"use client";

/**
 * Combined preview gallery component
 */
import { useState } from "react";
import { ApplicationPreview } from "./ApplicationPreview";
import { ContentPreview } from "./ContentPreview";
import { FormsPreview } from "./FormsPreview";
import { StatesPreview } from "./StatesPreview";
import { SurfacesPreview } from "./SurfacesPreview";

type PreviewTab = "application" | "forms" | "surfaces" | "content" | "states";

export function PreviewGallery() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("application");

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: "application", label: "Application" },
    { id: "forms", label: "Forms" },
    { id: "surfaces", label: "Surfaces" },
    { id: "content", label: "Content" },
    { id: "states", label: "States" },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-lg border bg-card p-6">
        {activeTab === "application" && <ApplicationPreview />}
        {activeTab === "forms" && <FormsPreview />}
        {activeTab === "surfaces" && <SurfacesPreview />}
        {activeTab === "content" && <ContentPreview />}
        {activeTab === "states" && <StatesPreview />}
      </div>
    </div>
  );
}
