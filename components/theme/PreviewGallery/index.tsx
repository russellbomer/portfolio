"use client";

/**
 * Combined preview gallery component
 */
import type { SemanticRole } from "@/types/theme";
import { useState } from "react";
import { ApplicationPreview } from "./ApplicationPreview";
import { ContentFormsPreview } from "./ContentPreview";
import { CorePreview } from "./FormsPreview";
import { FeedbackPreview } from "./StatesPreview";
import { FoundationsPreview } from "./SurfacesPreview";

type PreviewTab =
  | "application"
  | "foundations"
  | "core"
  | "content"
  | "feedback";

interface PreviewGalleryProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

export function PreviewGallery({ onRoleActivate }: PreviewGalleryProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("application");

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: "application", label: "Scenes" },
    { id: "foundations", label: "Foundations" },
    { id: "core", label: "Core UI" },
    { id: "content", label: "Content & Forms" },
    { id: "feedback", label: "Feedback" },
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
        {activeTab === "application" && (
          <ApplicationPreview onRoleActivate={onRoleActivate} />
        )}
        {activeTab === "foundations" && (
          <FoundationsPreview onRoleActivate={onRoleActivate} />
        )}
        {activeTab === "core" && (
          <CorePreview onRoleActivate={onRoleActivate} />
        )}
        {activeTab === "content" && (
          <ContentFormsPreview onRoleActivate={onRoleActivate} />
        )}
        {activeTab === "feedback" && (
          <FeedbackPreview onRoleActivate={onRoleActivate} />
        )}
      </div>
    </div>
  );
}
