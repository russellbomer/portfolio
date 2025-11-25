"use client";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface ContactState {
  success?: string;
  error?: string;
}

export function ContactForm() {
  const [state, setState] = useState<ContactState>({});
  const [loading, setLoading] = useState(false);
  const { scheme } = useTheme();
  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => setState({}), 4000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // Honeypot
    if (formData.get("website")) {
      setState({ success: "Thanks!" });
      form.reset();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed");
      setState({ success: "Message sent." });
      form.reset();
    } catch (err: any) {
      setState({ error: err.message || "Unexpected error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl"
      aria-label="Contact form"
    >
      <div className="sr-only">
        <Label htmlFor="website">Website</Label>
        <input id="website" name="website" tabIndex={-1} />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="interest">Interest</Label>
        <select
          id="interest"
          name="interest"
          className="h-10 w-full rounded-md border bg-background px-2 text-sm"
          defaultValue="Portfolio"
        >
          <option>Portfolio</option>
          <option>Collaboration</option>
          <option>Consulting</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border bg-background p-2 text-sm"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-green-600" role="status">
          {state.success}
        </p>
      )}
      <Button type="submit" disabled={loading} className="min-w-[120px]">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
