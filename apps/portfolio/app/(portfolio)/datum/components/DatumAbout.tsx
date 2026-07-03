import { CONTAINER } from "./container";

export function DatumAbout() {
  return (
    <section id="about" className="border-t border-border">
      <div className={`${CONTAINER} py-20 md:py-28`}>
        <h2 className="text-center text-2xl font-medium text-foreground md:text-left md:text-3xl [font-family:var(--font-datum-display)]">
          About Russell
        </h2>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            I have spent my working life running projects and improving how
            things work across a range of fields. I have led operations as
            an executive chef, coordinated supply chains and logistics,
            managed procurement, and built data and automation systems for
            manufacturing and hospitality clients. The through-line is the
            same everywhere: take something tangled, figure out how it
            should actually work, get the right people moving in the same
            direction, and see it through to a result. I am also a serious
            DIYer with a working understanding of how homes are built and
            how the trades operate.
          </p>
          <p>
            That is the whole idea behind Datum. A home technology project
            is a coordination problem as much as a technical one, getting
            the systems, the trades, the designers, and the way you
            actually live to line up, and that is the kind of problem I
            have solved my whole career. I am comfortable designing a
            technology system and comfortable building it, and I can hold a
            real conversation with your electrician, your builder, and your
            architect about how it all fits. I am not a tradesman, and for
            anything that needs a license I bring in the right one. I am
            currently completing a Master of Science in Software
            Engineering, which keeps the technical side sharp.
          </p>
          <p>
            The result is someone who treats your home the way a good
            systems consultant treats a business: assess what is really
            there, design something that fits, run it cleanly, and hand
            back something you control.
          </p>
        </div>
      </div>
    </section>
  );
}
