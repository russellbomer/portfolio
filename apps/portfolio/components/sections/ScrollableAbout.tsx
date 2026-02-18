const aboutContent = [
  "Writing a couple paragraphs to sum myself up is a difficult task; I'm still pretty young but I have a rich and varied professional history—running kitchens, coordinating supply chains for large-scale manufacturing, leading enterprise software implementation— but none of these alone really illustrate the breadth of my experience or clarify the common threads underlying my work.",
  "If I had to put it simply: I solve problems. To elaborate: I immerse myself in a situation, identify weaknesses, and find solutions. I value process, clarity, and continuous refinement; coincidentally, I value creativity, resourcefulness, and experimentation just as highly. These traits guide me in work and the rest of my life.",
  "Recently, I've been working frequently on solution architecture and engineering, automation, data analysis and visualization, and AI/ML integrations that run the gamut of my interests. I use modern web development frameworks and tools— JavaScript/TypeScript, Python, React, and Docker, for example— but I like to say I'm stack agnostic. I also enjoy working with Linux-based systems, shell scripting, the list goes on. The point is that I am adaptable and choose my tools based on the problem rather than the reverse.",
  "At home, I do woodworking, DIY projects, and maintain a homelab. I suffer Cleveland Browns football religiously, take lawn care more seriously than I probably should, and still cook regularly. There are clear throughlines between my hobbies and work: I like building things and making systems work better. As for the Browns, the throughline is that no matter how difficult something is, I am devoted to seeing it through.",
  "I'm permanently located in rural western North Carolina with my wife, 2 dogs, and 2 cats (not to mention a lot of pet fish). I'm in the process of finishing my M.S. in Software Engineering at WGU. I'm open to work and would love to discuss the ways I can help you solve a problem, so drop me a line and I'll get back to you promptly!",
];

export function ScrollableAbout() {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium mb-2 md:mb-3 lg:mb-6">
        About
      </h2>

      {/* Mobile: plain text flow */}
      <div className="md:hidden space-y-4 text-xs leading-relaxed text-muted-foreground">
        {aboutContent.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {/* md+: scrollable container */}
      <div className="hidden md:block">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg">
          <div className="md:h-[420px] lg:h-[480px] overflow-y-auto overscroll-contain p-6 scrollbar-thin">
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground pr-2">
              {aboutContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground/50 mt-2 font-mono">
          ↕ Scroll for more
        </p>
      </div>
    </div>
  );
}
