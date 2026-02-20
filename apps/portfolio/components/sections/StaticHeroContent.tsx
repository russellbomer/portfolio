"use client";

/**
 * Static hero content without animations.
 * Used on /home route for "Back to home" navigation.
 */
export function StaticHeroContent() {
  return (
    <div className="max-w-4xl">
      {/* Greeting */}
      <p className="text-muted-foreground font-mono text-sm mb-3">
        Hello, I&apos;m
      </p>

      {/* Name */}
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
        Russell Bomer
      </h1>

      {/* Tagline */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-6">
        I make software... and a lot of other things.
      </p>

      {/* Scroll prompt */}
      <button
        className="text-muted-foreground text-sm font-mono cursor-pointer hover:text-foreground transition-colors"
        onClick={() => {
          const element = document.getElementById("about");
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const targetScroll =
              elementTop + rect.height / 2 - window.innerHeight / 2;

            window.scrollTo({
              top: Math.max(0, targetScroll),
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
