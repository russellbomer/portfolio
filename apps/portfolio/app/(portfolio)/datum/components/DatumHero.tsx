import { CONTAINER } from "./container";
import { DatumMark } from "./DatumMark";

export function DatumHero() {
  return (
    <section
      id="top"
      className={`flex min-h-dvh flex-col items-center justify-center py-16 text-center ${CONTAINER}`}
    >
      <DatumMark
        variant="full"
        className="mx-auto mb-10 h-16 w-auto md:h-20"
        priority
      />
      <h1 className="text-3xl font-medium text-foreground md:text-5xl [font-family:var(--font-datum-display)]">
        Datum Home Systems
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground md:text-sm">
        Residential technology consulting and integration
      </p>
      <p className="mx-auto mt-8 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
        Home technology that works as one system. Datum designs, builds, and
        supports the networks, media, automation, and security a well-run
        home depends on, runs the project so the pieces come together
        instead of fighting each other, and coordinates with your builder or
        electrician when a project calls for it.
      </p>
    </section>
  );
}
