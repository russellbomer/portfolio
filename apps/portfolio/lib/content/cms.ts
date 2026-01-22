// MUST: Basic content management workflow for projects/demos (1.2 scope)
// SPIKE: Decide storage strategy for MVP (file-based JSON vs lightweight DB)
// CONSTRAINT: No auth in MVP; simple authoring-only guardrails

export type ProjectSummary = {
  id: string;
  title: string;
  description: string;
  screenshots?: string[];
  demoSubdomain?: string;
};

// Placeholder API (not imported yet)
export async function listProjects(): Promise<ProjectSummary[]> {
  return [];
}

export async function getProject(_id: string): Promise<ProjectSummary | null> {
  return null;
}
