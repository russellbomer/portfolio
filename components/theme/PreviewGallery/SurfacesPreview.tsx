"use client";

/**
 * Card and surface components preview
 */
import { Card } from "@/components/ui/card";

export function SurfacesPreview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Cards</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h4 className="mb-2 text-base font-semibold">Simple Card</h4>
            <p className="text-sm text-muted-foreground">
              This is a basic card with some content. Cards provide a container
              for related information.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="mb-2 text-base font-semibold">Another Card</h4>
            <p className="text-sm text-muted-foreground">
              Cards can contain various types of content including text, images,
              and actions.
            </p>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90">
                Action
              </button>
              <button className="rounded-md border px-3 py-1 text-sm hover:bg-accent">
                Cancel
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Popovers & Surfaces</h3>
        <div className="space-y-4">
          <div className="rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
            <h4 className="mb-2 font-semibold">Popover Surface</h4>
            <p className="text-sm">
              This demonstrates the popover surface styling with its foreground
              color.
            </p>
          </div>

          <div className="rounded-md bg-muted p-4 text-muted-foreground">
            <h4 className="mb-2 font-semibold text-foreground">
              Muted Surface
            </h4>
            <p className="text-sm">
              Muted surfaces are great for subtle backgrounds and secondary
              information.
            </p>
          </div>

          <div className="rounded-md bg-accent p-4 text-accent-foreground">
            <h4 className="mb-2 font-semibold">Accent Surface</h4>
            <p className="text-sm">
              Accent surfaces help draw attention to important content areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
