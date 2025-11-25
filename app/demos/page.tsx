import DemoMount from "@/components/demo/DemoMount";
import { demos } from "@/demos";

export const dynamic = "force-static";

export default function DemosPage() {
  return (
    <main className="w-full px-6 md:px-10 lg:px-16 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Interactive Demos</h1>
        <p className="text-muted-foreground">
          Live previews of selected components and terminal experiences.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {demos.map((demo) => (
          <article
            key={demo.key}
            className={
              "rounded border bg-card p-4 text-card-foreground " +
              (demo.key === "terminal" ? "md:col-span-2" : "")
            }
          >
            <h2 className="text-lg font-semibold mb-1">{demo.title}</h2>
            {demo.description ? (
              <p className="text-sm text-muted-foreground mb-4">
                {demo.description}
              </p>
            ) : null}
            <div className="rounded border p-3 bg-background">
              <DemoMount demoKey={demo.key} />
            </div>
            {/* Full-width link removed to avoid route issues during dev */}
          </article>
        ))}
      </section>

      <section className="mt-10 rounded border bg-card p-4 text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>
            Port busy (EADDRINUSE): set <code>TERMINAL_PORT</code> to a free
            port (e.g. <code>4001</code>) and restart the terminal server.
          </li>
          <li>
            Windows native errors (ConPTY PFN typedefs or C2362): run
            <code>npm run pty:rebuild</code> to re-apply patches and rebuild
            <code>node-pty</code>.
          </li>
          <li>
            Verify backend: <code>GET /health</code> should return
            <code>ok</code> at <code>http://127.0.0.1:&lt;port&gt;/health</code>
            .
          </li>
          <li>
            Feature flags: set <code>NEXT_PUBLIC_FEATURE_TERMINAL=true</code>{" "}
            and point <code>NEXT_PUBLIC_TERMINAL_WS_URL</code> to your
            <code>/ws</code> endpoint.
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          See repo file <code>server/terminal/README.md</code> for full setup
          and troubleshooting details.
        </p>
      </section>
    </main>
  );
}
