"use client";

/**
 * Content & forms preview
 * Covers typography, tables, tags, gallery, and embedded form elements
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SemanticRole } from "@/types/theme";
import type { KeyboardEvent, MouseEvent } from "react";

const role = (token: string) => `hsl(var(--${token}))`;

interface ContentFormsPreviewProps {
  onRoleActivate?: (role: SemanticRole) => void;
}

export function ContentFormsPreview({
  onRoleActivate,
}: ContentFormsPreviewProps) {
  const notifyRole = (
    event: MouseEvent<HTMLElement>,
    semanticRole: SemanticRole
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onRoleActivate?.(semanticRole);
  };

  const notifyRoleKey = (
    event: KeyboardEvent<HTMLElement>,
    semanticRole: SemanticRole
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRoleActivate?.(semanticRole);
    }
  };

  const interactiveProps = (semanticRole: SemanticRole, title: string) => ({
    "data-role": semanticRole,
    role: "button" as const,
    tabIndex: 0,
    title,
    onClick: (event: MouseEvent<HTMLElement>) =>
      notifyRole(event, semanticRole),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) =>
      notifyRoleKey(event, semanticRole),
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Typography</h3>
        <div
          className="space-y-4 rounded-lg border p-6 shadow-sm"
          style={{
            backgroundColor: role("surface-default"),
            color: role("surface-default-foreground"),
            borderColor: role("page-border"),
          }}
          {...interactiveProps(
            "surface-default",
            "Jump to surface-default role"
          )}
        >
          <h1
            className="cursor-pointer text-4xl font-bold"
            {...interactiveProps(
              "surface-default-foreground",
              "Jump to surface-default-foreground role"
            )}
          >
            Heading 1
          </h1>
          <h2
            className="cursor-pointer text-3xl font-bold"
            {...interactiveProps(
              "surface-default-foreground",
              "Jump to surface-default-foreground role"
            )}
          >
            Heading 2
          </h2>
          <h3
            className="cursor-pointer text-2xl font-semibold"
            {...interactiveProps(
              "surface-default-foreground",
              "Jump to surface-default-foreground role"
            )}
          >
            Heading 3
          </h3>
          <h4
            className="cursor-pointer text-xl font-semibold"
            {...interactiveProps(
              "surface-default-foreground",
              "Jump to surface-default-foreground role"
            )}
          >
            Heading 4
          </h4>
          <p
            className="cursor-pointer"
            {...interactiveProps(
              "surface-default-foreground",
              "Jump to surface-default-foreground role"
            )}
          >
            This is a paragraph of body text. It uses the foreground color
            against the background.
            <a
              href="#"
              className="ml-1 underline transition-colors cursor-pointer"
              style={{ color: role("link") }}
              data-role="link"
              role="button"
              tabIndex={0}
              title="Jump to link role"
              onClick={(event) => notifyRole(event, "link")}
              onKeyDown={(event) => notifyRoleKey(event, "link")}
            >
              This is a link
            </a>{" "}
            within the text.
          </p>
          <p
            className="text-sm cursor-pointer"
            style={{ color: role("link-muted") }}
            data-role="link-muted"
            role="button"
            tabIndex={0}
            title="Jump to link-muted role"
            onClick={(event) => notifyRole(event, "link-muted")}
            onKeyDown={(event) => notifyRoleKey(event, "link-muted")}
          >
            This is muted text, often used for secondary information or
            descriptions.
          </p>
          <blockquote
            className="rounded-md border-l-4 p-4 text-sm italic cursor-pointer"
            style={{
              backgroundColor: role("quote-background"),
              color: role("quote-foreground"),
              borderColor: role("quote-border"),
              borderLeftColor: role("quote-accent"),
            }}
            data-role="quote-background"
            role="button"
            tabIndex={0}
            title="Jump to quote roles"
            onClick={(event) => notifyRole(event, "quote-background")}
            onKeyDown={(event) => notifyRoleKey(event, "quote-background")}
          >
            This is a blockquote. It can be used for quotes or callouts.
          </blockquote>
          <code
            className="rounded border px-2 py-1 text-sm cursor-pointer"
            style={{
              backgroundColor: role("code-background"),
              color: role("code-foreground"),
              borderColor: role("code-border"),
            }}
            data-role="code-background"
            role="button"
            tabIndex={0}
            title="Jump to code roles"
            onClick={(event) => notifyRole(event, "code-background")}
            onKeyDown={(event) => notifyRoleKey(event, "code-background")}
          >
            const code = "inline code example";
          </code>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Lists</h3>
        <div
          className="rounded-lg border p-6 cursor-pointer"
          style={{
            backgroundColor: role("surface-muted"),
            color: role("surface-muted-foreground"),
            borderColor: role("divider"),
          }}
          data-role="surface-muted"
          role="button"
          tabIndex={0}
          title="Jump to surface-muted role"
          onClick={(event) => notifyRole(event, "surface-muted")}
          onKeyDown={(event) => notifyRoleKey(event, "surface-muted")}
        >
          <h4
            className="mb-2 cursor-pointer font-semibold"
            {...interactiveProps(
              "surface-muted-foreground",
              "Jump to surface-muted-foreground role"
            )}
          >
            Unordered List
          </h4>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            {["First item", "Second item", "Third item with more content"].map(
              (item) => (
                <li key={item}>
                  <span
                    className="cursor-pointer"
                    {...interactiveProps(
                      "surface-muted-foreground",
                      "Jump to surface-muted-foreground role"
                    )}
                  >
                    {item}
                  </span>
                </li>
              )
            )}
          </ul>

          <h4
            className="mb-2 cursor-pointer font-semibold"
            {...interactiveProps(
              "surface-muted-foreground",
              "Jump to surface-muted-foreground role"
            )}
          >
            Ordered List
          </h4>
          <ol className="list-decimal space-y-1 pl-6">
            {["Step one", "Step two", "Step three"].map((item) => (
              <li key={item}>
                <span
                  className="cursor-pointer"
                  {...interactiveProps(
                    "surface-muted-foreground",
                    "Jump to surface-muted-foreground role"
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Link States</h3>
          <div
            className="rounded-lg border p-4 text-sm cursor-pointer"
            style={{
              backgroundColor: role("surface-overlay"),
              color: role("surface-overlay-foreground"),
              borderColor: role("divider"),
            }}
            data-role="surface-overlay"
            role="button"
            tabIndex={0}
            title="Jump to surface-overlay role"
            onClick={(event) => notifyRole(event, "surface-overlay")}
            onKeyDown={(event) => notifyRoleKey(event, "surface-overlay")}
          >
            <div className="flex flex-wrap gap-4">
              <span
                className="cursor-pointer"
                style={{ color: role("link") }}
                {...interactiveProps("link", "Jump to link role")}
              >
                Default link
              </span>
              <span
                className="cursor-pointer"
                style={{ color: role("link-hover") }}
                {...interactiveProps("link-hover", "Jump to link-hover role")}
              >
                Hover state
              </span>
              <span
                className="cursor-pointer"
                style={{ color: role("link-visited") }}
                {...interactiveProps(
                  "link-visited",
                  "Jump to link-visited role"
                )}
              >
                Visited
              </span>
              <span
                className="cursor-pointer"
                style={{ color: role("link-muted") }}
                {...interactiveProps("link-muted", "Jump to link-muted role")}
              >
                Muted link
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Gallery Surface</h3>
          <div
            className="rounded-lg border p-4 cursor-pointer"
            style={{
              backgroundColor: role("gallery-background"),
              color: role("gallery-foreground"),
              borderColor: role("page-border"),
            }}
            data-role="gallery-background"
            role="button"
            tabIndex={0}
            title="Jump to gallery-background role"
            onClick={(event) => notifyRole(event, "gallery-background")}
            onKeyDown={(event) => notifyRoleKey(event, "gallery-background")}
          >
            <p
              className="cursor-pointer text-sm"
              {...interactiveProps(
                "gallery-foreground",
                "Jump to gallery-foreground role"
              )}
            >
              Gallery roles help coordinate media-heavy layouts. Adjust them to
              see how thumbnail strips respond.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`gallery-thumb-${index}`}
                  className="aspect-video rounded-md"
                  style={{
                    backgroundColor: role(
                      index % 2 === 0 ? "gallery-background" : "surface-muted"
                    ),
                    border: `1px solid ${role("page-border")}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Code Block</h3>
        <pre
          className="overflow-x-auto rounded-lg border p-4 cursor-pointer"
          style={{
            backgroundColor: role("code-background"),
            borderColor: role("code-border"),
            color: role("code-foreground"),
          }}
          data-role="code-background"
          role="button"
          tabIndex={0}
          title="Jump to code roles"
          onClick={(event) => notifyRole(event, "code-background")}
          onKeyDown={(event) => notifyRoleKey(event, "code-background")}
        >
          <code
            className="cursor-pointer font-mono text-sm"
            style={{ color: role("code-accent") }}
            {...interactiveProps("code-accent", "Jump to code-accent role")}
          >{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}</code>
        </pre>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Inline Form</h3>
        <div
          className="grid gap-4 rounded-lg border p-5 md:grid-cols-2"
          style={{
            backgroundColor: role("form-background"),
            color: role("form-foreground"),
            borderColor: role("page-border"),
          }}
          data-role="form-background"
          role="button"
          tabIndex={0}
          title="Jump to form roles"
          onClick={(event) => notifyRole(event, "form-background")}
          onKeyDown={(event) => notifyRoleKey(event, "form-background")}
        >
          <div className="space-y-2">
            <Label
              htmlFor="inline-name"
              style={{ color: role("form-foreground") }}
              className="cursor-pointer"
              {...interactiveProps(
                "form-foreground",
                "Jump to form-foreground role"
              )}
            >
              Name
            </Label>
            <Input
              id="inline-name"
              placeholder="Alex Morgan"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="input-background"
              onClick={(event) => notifyRole(event, "input-background")}
              onKeyDown={(event) => notifyRoleKey(event, "input-background")}
            />
            <p
              className="cursor-pointer text-xs"
              style={{ color: role("input-placeholder") }}
              {...interactiveProps(
                "input-placeholder",
                "Jump to input-placeholder role"
              )}
            >
              Placeholder copy previews input placeholder tokens.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="inline-email"
              style={{ color: role("form-foreground") }}
              className="cursor-pointer"
              {...interactiveProps(
                "form-foreground",
                "Jump to form-foreground role"
              )}
            >
              Work email
            </Label>
            <Input
              id="inline-email"
              type="email"
              placeholder="hello@example.com"
              style={{
                backgroundColor: role("input-background"),
                color: role("input-foreground"),
                borderColor: role("input-border"),
              }}
              data-role="input-background"
              onClick={(event) => notifyRole(event, "input-background")}
              onKeyDown={(event) => notifyRoleKey(event, "input-background")}
            />
            <Button
              className="mt-2"
              style={{
                backgroundColor: role("cta-background"),
                color: role("cta-foreground"),
                border: `1px solid ${role("cta-border")}`,
              }}
              data-role="cta-background"
              onClick={(event) => notifyRole(event, "cta-background")}
              onKeyDown={(event) => notifyRoleKey(event, "cta-background")}
            >
              Submit demo request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
