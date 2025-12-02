"use client";
import React from "react";

interface State {
  hasError: boolean;
  error?: any;
}

export default class DemoErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[DemoError]", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-semibold mb-2">Demo crashed</p>
          <p className="mb-2">
            This interactive preview encountered an unexpected error.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
