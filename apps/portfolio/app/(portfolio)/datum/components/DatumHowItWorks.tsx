import { CONTAINER } from "./container";

const MODES = [
  {
    title: "For most projects, I do the work.",
    body: "I assess the house, design the system, and handle the hands-on setup myself, the network, the configuration, the devices, the programming, through to something that works and that you know how to use. You get one person who both designed it and built it, so nothing gets lost in a handoff and there is one person accountable from start to finish.",
  },
  {
    title: "For construction-heavy projects, I design and coordinate.",
    body: "When a project needs new wiring run, walls opened, or structural work, that goes to a licensed electrician or your general contractor. I draw up and specify the system, coordinate with the trades doing the physical work, and integrate everything once it is in place. Because I understand how construction and the trades work, I can talk to your builder in their terms, which keeps the technology from becoming an afterthought.",
  },
];

export function DatumHowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className={`${CONTAINER} py-20 md:py-28`}>
        <h2 className="text-center text-2xl font-medium text-foreground md:text-left md:text-3xl [font-family:var(--font-datum-display)]">
          How it works
        </h2>
        <p className="mt-4 max-w-xl text-center text-sm text-muted-foreground md:text-left md:text-base">
          How a project runs depends on how much construction is involved.
          Either way, it runs as a managed project with one person
          accountable for the result.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {MODES.map((mode) => (
            <div
              key={mode.title}
              className="rounded-lg bg-fern p-6 text-linen dark:bg-rust"
            >
              <h3 className="text-base font-medium [font-family:var(--font-datum-display)]">
                {mode.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed opacity-80">
                {mode.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
