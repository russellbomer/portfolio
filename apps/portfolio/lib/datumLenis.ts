import type Lenis from "lenis";

// A plain mutable holder (not React context) so components rendered outside
// DatumSmoothScroll's provider tree — like the site-wide BackToTop, which
// lives in GlobalDecor rather than under the Datum page — can still reach
// the active Lenis instance when on /datum, and call lenis.scrollTo()
// instead of a native window.scrollTo() that would otherwise fight Lenis's
// own animation loop.
export const datumLenisHolder: { current: Lenis | null } = { current: null };
