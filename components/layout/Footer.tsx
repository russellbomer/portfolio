import Link from "next/link";

// GitHub icon
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// LinkedIn icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/russellbomer",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/russellbomer",
    icon: LinkedInIcon,
  },
];

const siteLinks = [
  { label: "Writing", href: "/writing" },
  { label: "Demos", href: "/demos" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-background border-t border-[hsl(var(--rust))]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-display text-base text-foreground">
              Russell Bomer
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
              Full-Stack Engineer
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm">
            {/* Site links */}
            <div className="flex gap-3">
              {siteLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-[hsl(var(--thorn))] dark:text-[hsl(var(--eucalyptus))] hover:text-[hsl(var(--eucalyptus))] dark:hover:text-[hsl(var(--fern))] transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <span
              className="text-muted-foreground/40 select-none"
              aria-hidden="true"
            >
              ·
            </span>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <span className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
