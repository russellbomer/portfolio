"use client";

/**
 * State variants preview (hover, focus, active, disabled)
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StatesPreview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Interactive States</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Hover over elements to see their interactive states.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="hover:opacity-90">Hover Me</Button>
              <Button variant="secondary">Secondary Hover</Button>
              <Button variant="outline">Outline Hover</Button>
              <Button variant="ghost">Ghost Hover</Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold">Focus States</h4>
            <div className="space-y-3">
              <Input
                placeholder="Focus this input..."
                className="focus:ring-2 focus:ring-ring"
              />
              <Input
                placeholder="Another input..."
                className="focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold">Disabled States</h4>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled Button</Button>
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <Input placeholder="Disabled input..." disabled />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold">Active/Selected</h4>
            <div className="space-y-2">
              <button className="w-full rounded-md border bg-accent p-3 text-left text-accent-foreground">
                Selected Item
              </button>
              <button className="w-full rounded-md border p-3 text-left hover:bg-accent/50">
                Hover to Select
              </button>
              <button className="w-full rounded-md border p-3 text-left hover:bg-accent/50">
                Another Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Borders & Rings</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card p-4">
            Default border styling
          </div>
          <div className="rounded-lg border-2 border-primary bg-card p-4">
            Primary border
          </div>
          <div className="rounded-lg border-2 border-destructive bg-card p-4">
            Destructive border
          </div>
          <button className="w-full rounded-lg border-2 border-input bg-background p-4 text-left transition-all hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            Click to see ring (focus state)
          </button>
        </div>
      </div>
    </div>
  );
}
