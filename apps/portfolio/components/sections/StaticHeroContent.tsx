"use client";

/**
 * Static hero content without animations.
 * Used on /home route for "Back to home" navigation.
 */
export function StaticHeroContent() {
  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <p className="text-muted-foreground font-mono text-sm mb-4">
        Hello, I&apos;m
      </p>

      {/* Name */}
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
        Russell Bomer
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
        I make software... and a lot of other things.
      </p>

      {/* Scroll prompt */}
      <button
        className="text-muted-foreground text-sm font-mono cursor-pointer hover:text-foreground transition-colors"
        onClick={() => {
          const element = document.getElementById("about");
          if (element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.scrollY;
            const elementTop = rect.top + scrollTop;
            const targetScroll = elementTop + window.innerHeight * 0.5;

            window.scrollTo({
              top: targetScroll,
              behavior: "smooth",
            });
          }
        }}
      >
        <span className="animate-pulse">↓ Scroll for more</span>
      </button>
    </div>
  );
}
