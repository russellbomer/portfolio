"use client";

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

  // Animations play on "/" only
  // "/home" shows static content for back navigation
  const shouldAnimate = pathname === "/";

  return (
    <InitialLoadContext.Provider value={{ shouldAnimate }}>
      {children}
    </InitialLoadContext.Provider>
  );
}

export function useInitialLoad() {
  return useContext(InitialLoadContext);
}
