"use client";

/**
 * Typography and content preview
 */

export function ContentPreview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Typography</h3>
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-semibold">Heading 3</h3>
          <h4 className="text-xl font-semibold">Heading 4</h4>
          <p className="text-base">
            This is a paragraph of body text. It uses the foreground color
            against the background.
            <a
              href="#"
              className="text-primary underline hover:text-primary/80"
            >
              {" "}
              This is a link
            </a>{" "}
            within the text.
          </p>
          <p className="text-sm text-muted-foreground">
            This is muted text, often used for secondary information or
            descriptions.
          </p>
          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
            This is a blockquote. It can be used for quotes or callouts.
          </blockquote>
          <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
            const code = "inline code example";
          </code>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Lists</h3>
        <div className="rounded-lg border bg-card p-6">
          <h4 className="mb-2 font-semibold">Unordered List</h4>
          <ul className="mb-4 list-disc space-y-1 pl-6">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item with more content</li>
          </ul>

          <h4 className="mb-2 font-semibold">Ordered List</h4>
          <ol className="list-decimal space-y-1 pl-6">
            <li>Step one</li>
            <li>Step two</li>
            <li>Step three</li>
          </ol>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Code Block</h3>
        <pre className="overflow-x-auto rounded-lg border bg-muted p-4">
          <code className="font-mono text-sm text-foreground">{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`}</code>
        </pre>
      </div>
    </div>
  );
}
