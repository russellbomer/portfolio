"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const aboutPages = [
  {
    content: [
      "Writing a couple paragraphs to sum myself up is a difficult task; I'm still pretty young but I have a rich and varied professional history—running kitchens, coordinating supply chains for large-scale manufacturing, leading enterprise software implementation— but none of these alone really illustrate the breadth of my experience or clarify the common threads underlying my work.",
      "If I had to put it simply: I solve problems. To elaborate: I immerse myself in a situation, identify weaknesses, and find solutions. I value process, clarity, and continuous refinement; coincidentally, I value creativity, resourcefulness, and experimentation just as highly. These traits guide me in work and the rest of my life.",
    ],
  },
  {
    content: [
      "Recently, I've been working frequently on solution architecture and engineering, automation, data analysis and visualization, and AI/ML integrations that run the gamut of my interests. I use modern web development frameworks and tools— JavaScript/TypeScript, Python, React, and Docker, for example— but I like to say I'm stack agnostic. I also enjoy working with Linux-based systems, shell scripting, the list goes on. The point is that I am adaptable and choose my tools based on the problem rather than the reverse.",
      "At home, I do woodworking, DIY projects, and maintain a homelab. I suffer Cleveland Browns football religiously, take lawn care more seriously than I probably should, and still cook regularly. There are clear throughlines between my hobbies and work: I like building things and making systems work better. As for the Browns, the throughline is that no matter how difficult something is, I am devoted to seeing it through.",
    ],
  },
  {
    content: [
      "I'm permanently located in rural western North Carolina with my wife, 2 dogs, and 2 cats (not to mention a lot of pet fish). I'm in the process of finishing my M.S. in Software Engineering at WGU. I'm open to work and would love to discuss the ways I can help you solve a problem, so drop me a line and I'll get back to you promptly!",
    ],
  },
];

export function PaginatedAbout() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const count = aboutPages.length;

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium mb-2 md:mb-3 lg:mb-6">
        About
      </h2>

      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 md:p-6">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          orientation="vertical"
          className="w-full"
        >
          <CarouselContent className="h-[180px] md:h-[200px] lg:h-[220px]">
            {aboutPages.map((page, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="space-y-3 md:space-y-4 lg:space-y-5 text-xs md:text-sm lg:text-sm leading-relaxed text-muted-foreground">
                  {page.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Pagination dots and navigation */}
      <div className="flex items-center justify-between mt-4 md:mt-6">
        <div className="flex gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                current === index
                  ? "bg-foreground w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
            className="px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↑ Prev
          </button>
          <button
            onClick={() => api?.scrollNext()}
            disabled={current === count - 1}
            className="px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next ↓
          </button>
        </div>
      </div>
    </div>
  );
}
