import { buildMetadata } from "@/lib/seo/meta";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "TMI",
  description:
    "The longer version — background, interests, and the path to software.",
  pathname: "/tmi",
});

export default function TMIPage() {
  return (
    <article id="main-content" className="mx-auto max-w-2xl px-6 py-16">
      <nav className="mb-12">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
          The Longer Version...
        </h1>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            I was born in Ohio, grew up in North Carolina, and now live in a
            rural area west of Charlotte with my wife, Serra, two dogs (Güstav
            and Georgia), and two cats (Daryl and Nori). I&apos;m a full-stack
            engineer who likes untangling systems end-to-end: data, interfaces,
            infrastructure, and the humans trying to get something done.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I care about building tools that reduce friction, make hard things
            feel manageable, and hold up over time. I work mostly with Python,
            Javascript, and a variety of front- and back-end frameworks, but I
            care more about clear thinking and good systems than any particular
            stack. I&apos;m adaptable and prioritize finding the stack that best
            fits the needs of the project in question.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-medium">The Beginnings</h2>
          <p className="text-muted-foreground leading-relaxed">
            I didn&apos;t aim for software development initially. I started out
            trying to be a musician.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Kitchen work was originally a way to make that possible. It was a
            job that could flex around the demands of a DIY rock band. We wrote
            and composed our own original music, booked our own shows, and did
            our own promotion, among a thousand other responsibilities.
            Maintaining that DIY ethos was essential to me and those I played
            with, and it&apos;s something I continue to carry with me.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Over time, the balance shifted. I don&apos;t play music as much
            these days, but I still love it and carry visceral memories of what
            it feels like to play live and to build something from nothing with
            other people.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cooking stopped being just a means to an end and became the primary
            end itself. I worked my way up from part-time dishwasher all the way
            to a couple executive chef positions. I picked up associate&apos;s
            degrees in Culinary Arts and Business Administration from Central
            Piedmont Community College along the way. The kitchen taught me
            organization and preparation, among other things. I developed a
            propensity for fastidious, detail-oriented fine-dining work and love
            for balancing visual refinement with flawless technique and
            fantastic flavor.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-medium">The Pivot(s)</h2>
          <p className="text-muted-foreground leading-relaxed">
            As my kitchen career grew, my life did too. I met Serra, and the
            reality of restaurant hours started to clash with the kind of life
            we wanted to build. I began transitioning out of the kitchen into
            more technical and administrative roles, looking for a better
            balance and a different way to apply the same instincts.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            That led me into a procurement position with the Grand Bohemian
            Hotel Charlotte. At the hotel, I spearheaded the full implementation
            of the Birchstreet P2P/ERP system. That project pulled back the
            curtain on how much better things could run when the tools actually
            fit the work. I started designing processes, building spreadsheets
            and small tools, and thinking in terms of systems instead of just
            tasks. I also completed my bachelor&apos;s degree in Supply Chain
            Management at Appalachian State University during this period. My
            work at the hotel and education on the complex systems of the supply
            chain laid the groundwork for my interest in bespoke software
            solutions.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Next, I accepted a position in food manufacturing with Dole Fresh
            Vegetables, and that curiosity deepened. I spent much of my time
            developing in-house tooling and software solutions, leaning on lean
            manufacturing and continuous improvement principles to make
            operations a little less brittle and a lot more efficient, not to
            mention profitable. The throughline from my experience in bands,
            kitchens, hotels, and factories was obvious: dive into the work, pay
            attention to the details, and make things to be proud of.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-medium">Recently/Now</h2>
          <p className="text-muted-foreground leading-relaxed">
            In October 2024, I was laid off from Dole unexpectedly. The job
            search that followed was long and, frankly, rough. At some point, it
            became clear that instead of waiting for the &quot;right&quot; role
            to appear, I should lean into the kind of work I was already drawn
            to: designing and building systems that make complex problems more
            manageable.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            So now I&apos;m pursuing an independent path in freelance and
            consulting work while developing my own products. I am also enrolled
            in the Master&apos;s program in Software Engineering at Western
            Governors University, deepening and formalizing the work I am
            already doing. Day to day, I like projects where I can think through
            the whole shape of a system: how data is modeled and applied, what
            the interface feels like, and how reliable the underlying
            infrastructure is. I&apos;m especially interested in internal tools,
            operations-heavy domains, and developer tooling—places where a small
            amount of clarity can remove a lot of friction and make work even
            just slightly more enjoyable. Otherwise, I like designing beautiful
            and intuitive UX/UI and making applications that are a pleasure to
            use.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Outside of work, my life is modest but fulfilling. I like to cook,
            obviously (most recently, lots of sourdough bread), specifically for
            my family and friends. I like spending time in my wood shop making
            furniture and other fine woodworking pieces. I like to garden,
            landscape, and maintain my lawn. I love a good nap and snuggling up
            with my pets. I am a sucker for a puzzle and brain teasers, whether
            sudoku, a crossword, or trivia. And I would be remiss to not mention
            my rabid fandom for the Cleveland Browns, which has taught me
            patience, resilience, and loyalty through adversity. My hobbies and
            pastimes are not just afterthoughts in my development journey, but,
            instead, each and every one of them inform my work and its
            philosophical underpinnings.
          </p>
        </section>

        <section className="space-y-4 pt-8 pb-[120px] border-t border-border/50">
          <p className="text-muted-foreground leading-relaxed">
            If you&apos;ve made it this far, we should probably talk.{" "}
            <Link
              href="/connect"
              className="text-foreground underline underline-offset-4 hover:text-primary dark:hover:text-rust transition-colors"
            >
              Drop me a line and we&apos;ll get to work!
            </Link>
          </p>
        </section>
      </div>
    </article>
  );
}
