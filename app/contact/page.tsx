// MUST: Contact form entry point (1.2 scope)
// ASSUMPTION: English-first, responsive baseline (1.2 assumptions)
// NICE: Add spam protection + CRM integration later

export const metadata = {
  title: "Contact",
  description: "Get in touch for freelance and consulting inquiries.",
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact</h1>
      <p className="text-gray-600">
        This is a placeholder for the contact form (MVP MUST). The form will be
        implemented in a future step while keeping performance, accessibility,
        and security constraints in mind.
      </p>
    </main>
  );
}
