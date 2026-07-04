"use client";

import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { datumLenisHolder } from "@/lib/datumLenis";

const LenisContext = createContext<Lenis | null>(null);

// Lenis smooths mouse/trackpad/touch scroll input by driving the native
// document scroll position under the hood (via requestAnimationFrame), so
// window.scrollY still updates normally — Framer Motion's useScroll() (used
// by the parallax rails and the "How it works" progress bar) keeps working
// without any changes.
export function DatumSmoothScroll({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    queueMicrotask(() => setLenis(instance));
    datumLenisHolder.current = instance;

    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
      datumLenisHolder.current = null;
    };
  }, [shouldReduceMotion]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

export function useDatumLenis() {
  return useContext(LenisContext);
}
