"use client";

import { useIsDatumRoute } from "@/lib/isDatumRoute";
import { usePathname } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

interface InitialLoadContextType {
  /** True when on the root homepage (/) - animations should play */
  shouldAnimate: boolean;
}

const InitialLoadContext = createContext<InitialLoadContextType>({
  shouldAnimate: false,
});

/**
 * Simple provider that enables animations only on the root homepage (/).
 * The /home route is used for "Back to home" navigation and shows static content.
 */
export function InitialLoadProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDatumRoute = useIsDatumRoute();

  // Animations play on "/" only. usePathname() also reports "/" on the
  // datum.russellbomer.com subdomain (middleware rewrites /datum internally,
  // but the browser's actual visited path stays "/"), so isDatumRoute is
  // checked too or the homepage's loading screen/pinwheel intro/scroll lock
  // would incorrectly fire there.
  const shouldAnimate = pathname === "/" && !isDatumRoute;

  return (
    <InitialLoadContext.Provider value={{ shouldAnimate }}>
      {children}
    </InitialLoadContext.Provider>
  );
}

export function useInitialLoad() {
  return useContext(InitialLoadContext);
}
