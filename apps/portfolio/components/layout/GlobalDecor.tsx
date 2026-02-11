"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BackToTop } from "@/components/ui/BackToTop";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NoiseTexture } from "@/components/ui/NoiseTexture";
import { PinwheelBackground } from "@/components/ui/PinwheelBackground";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const PROTOTYPE_ROUTE = "/easybank-prototype";
const LANDSCAPE_QUERY = "(min-width: 768px) and (orientation: landscape)";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mediaQuery = window.matchMedia(query);
      const handler = () => onStoreChange();

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
      } else {
        mediaQuery.addListener(handler);
      }

      return () => {
        if (mediaQuery.addEventListener) {
          mediaQuery.removeEventListener("change", handler);
        } else {
          mediaQuery.removeListener(handler);
        }
      };
    },
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false
  );
}

export function GlobalDecor() {
  const pathname = usePathname();
  const isLandscapeMd = useMediaQuery(LANDSCAPE_QUERY);

  const isPrototypeRoute = pathname === PROTOTYPE_ROUTE;
  const hideDecor = isPrototypeRoute && isLandscapeMd;
  const disableCursor = isPrototypeRoute;

  return (
    <>
      {!hideDecor && <PinwheelBackground />}
      {!hideDecor && <NoiseTexture />}
      {!hideDecor && <BackToTop />}
      {!hideDecor && <ThemeToggle />}
      {!disableCursor && <CustomCursor />}
    </>
  );
}
