import { CONTAINER } from "./container";

const SERVICES = [
  {
    title: "Home networks and Wi-Fi",
    body: "The foundation everything else runs on. Coverage that reaches the whole house, wired where it matters, segmented so your devices, guests, and work traffic stay separate and secure.",
  },
  {
    title: "Media and home theater",
    body: "Audio and video that follow you through the house, dedicated media rooms, and control that makes sense to everyone who lives there, not just the person who set it up.",
  },
  {
    title: "Smart home automation and control",
    body: "The layer that ties lighting, climate, media, and security into one system with logic that actually fits how you live, built on a platform you control rather than a subscription you rent.",
  },
  {
    title: "Security and cameras",
    body: "Self-hosted cameras and access that you own, with no monthly fee and no third party holding your footage. Placement and setup designed around your property, not a box of parts.",
  },
  {
    title: "Whole-home and new-build design",
    body: "For renovations and new construction, the technology planned before the walls close, coordinated with your architect, builder, and electrician so it is built in rather than bolted on.",
  },
];

export function DatumServices() {
  return (
    <section id="services" className="border-t border-border">
      <div className={`${CONTAINER} py-20 md:py-28`}>
        <h2 className="text-center text-2xl font-medium text-foreground md:text-left md:text-3xl [font-family:var(--font-datum-display)]">
          What I do
        </h2>
        <p className="mt-4 max-w-xl text-center text-sm text-muted-foreground md:text-left md:text-base">
          The work spans five areas. Most projects touch more than one,
          since the point is getting them to work together.
        </p>

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <div key={service.title} className="flex gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-medium text-foreground md:text-lg [font-family:var(--font-datum-display)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
