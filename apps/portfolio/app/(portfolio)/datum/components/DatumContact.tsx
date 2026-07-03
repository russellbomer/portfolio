import { ContactForm } from "@/components/contact/ContactForm";
import { CONTAINER } from "./container";

export function DatumContact() {
  return (
    <section id="contact" className="border-t border-border">
      <div className={`${CONTAINER} py-20 md:py-28`}>
        <h2 className="text-center text-2xl font-medium text-foreground md:text-3xl [font-family:var(--font-datum-display)]">
          Start a conversation
        </h2>
        <p className="mx-auto mt-6 text-center text-sm leading-relaxed text-muted-foreground md:text-base">
          The first conversation is free. Tell me about your project and I
          will tell you honestly whether I am the right fit and how I would
          approach it. Phone and email consultations are always free. If a
          project reaches the point of needing an on-site assessment, we
          will talk about what that involves before anyone commits to
          anything.
        </p>

        <div className="mx-auto mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
