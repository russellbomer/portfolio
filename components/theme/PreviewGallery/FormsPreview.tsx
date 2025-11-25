"use client";

/**
 * Form components preview
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function FormsPreview() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Input Fields</h3>
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-default">Default Input</Label>
            <Input
              id="input-default"
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-disabled">Disabled Input</Label>
            <Input id="input-disabled" placeholder="Disabled..." disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-email">Email Input</Label>
            <Input
              id="input-email"
              type="email"
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
