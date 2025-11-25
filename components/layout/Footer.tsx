export default function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="w-full px-6 md:px-10 lg:px-16 py-8 text-sm text-muted-foreground flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Russell Bomer. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/russellbomer"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
