import { ContactForm } from "@/components/contact/ContactForm";
import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Connect",
  description: "Start a project conversation with Russell Bomer.",
  pathname: "/connect",
});

export default function ConnectPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <nav>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Connect</h1>
        <p className="text-sm text-muted-foreground">
          Share what you're planning to build and I'll get back to you as soon
          as I can.
        </p>
        <p className="text-sm text-muted-foreground">
          Include timeline, context, and any relevant details so I can come
          prepared with ideas you'll love.
        </p>
      </header>
      <ContactForm />
    </main>
  );
}
