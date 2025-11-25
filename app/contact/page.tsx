// MUST: Contact form entry point (1.2 scope)
// ASSUMPTION: English-first, responsive baseline (1.2 assumptions)
// NICE: Add spam protection + CRM integration later

export const metadata = {
  title: "Contact",
  description: "Get in touch for freelance and consulting inquiries.",
};

import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Contact</h1>
        <p className="text-muted-foreground text-sm">
          Use the form below to reach out regarding collaboration, consulting,
          or general questions.
        </p>
      </header>
      <ContactForm />
    </main>
  );
}
