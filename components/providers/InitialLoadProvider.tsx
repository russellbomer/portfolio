"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface InitialLoadContextType {
  /** True only on the very first page load of this session */
  isInitialLoad: boolean;
  /** Mark the initial load as complete (called after animations finish) */
  markLoadComplete: () => void;
}

const InitialLoadContext = createContext<InitialLoadContextType>({
  isInitialLoad: false,
  markLoadComplete: () => {},
});

const SESSION_KEY = "portfolio_initial_load_complete";

export function InitialLoadProvider({ children }: { children: ReactNode }) {
  // Start with false to avoid hydration mismatch
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check sessionStorage after hydration
    const hasLoaded = sessionStorage.getItem(SESSION_KEY) === "true";
    // Use queueMicrotask to avoid synchronous setState warning
    queueMicrotask(() => {
      setIsInitialLoad(!hasLoaded);
      setIsHydrated(true);
    });
  }, []);

  const markLoadComplete = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setIsInitialLoad(false);
  };

  // Don't render children until hydrated to avoid flash
  // Actually, we should render but just treat as non-initial until hydrated
  return (
    <InitialLoadContext.Provider
      value={{
        isInitialLoad: isHydrated && isInitialLoad,
        markLoadComplete,
      }}
    >
      {children}
    </InitialLoadContext.Provider>
  );
}

export function useInitialLoad() {
  return useContext(InitialLoadContext);
}
