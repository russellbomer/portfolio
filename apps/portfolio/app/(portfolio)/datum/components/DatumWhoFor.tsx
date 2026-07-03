import { CONTAINER } from "./container";

export function DatumWhoFor() {
  return (
    <section id="who-for" className="border-t border-border">
      <div className={`${CONTAINER} py-20 text-center md:py-28`}>
        <h2 className="text-3xl font-medium text-foreground md:text-4xl [font-family:var(--font-datum-display)]">
          Who this is for
        </h2>
        <p className="mx-auto mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          Datum is a fit for projects that are genuinely involved: a
          whole-home automation program, an integrated media system, a
          network built to carry all of it, or a new build where the
          technology needs to be planned alongside the construction. If you
          are looking for someone to mount a single TV or set up one device,
          I am probably not your best option, and I am happy to point you
          somewhere that is. If you want the whole thing to work as one
          considered system, that is exactly what I do.
        </p>
      </div>
    </section>
  );
}
