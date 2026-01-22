"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface DemoSession {
  sessionId: string;
  serverSessionId: string | null;
  startedAt: number;
  expiresAt: number;
  inactiveMs: number;
  reset: () => void;
  touch: () => void;
  setServerSessionId: (id: string) => void;
}

const TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

const DemoSessionContext = createContext<DemoSession | null>(null);

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const DemoSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionId, setSessionId] = useState(() => genId());
  const [serverSessionId, setServerSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + TIMEOUT_MS);
  const [inactiveMs, setInactiveMs] = useState(0);
  const lastTouchRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize lastTouchRef on mount
  useEffect(() => {
    lastTouchRef.current = Date.now();
  }, []);

  const reset = useCallback(() => {
    setSessionId(genId());
    setServerSessionId(null);
    const now = Date.now();
    setStartedAt(now);
    setExpiresAt(now + TIMEOUT_MS);
    lastTouchRef.current = now;
    setInactiveMs(0);
  }, []);

  const touch = useCallback(() => {
    lastTouchRef.current = Date.now();
    setExpiresAt(lastTouchRef.current + TIMEOUT_MS);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const inactive = now - lastTouchRef.current;
      setInactiveMs(inactive);
      if (inactive > TIMEOUT_MS) {
        reset();
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reset]);

  return (
    <DemoSessionContext.Provider
      value={{
        sessionId,
        serverSessionId,
        startedAt,
        expiresAt,
        inactiveMs,
        reset,
        touch,
        setServerSessionId,
      }}
    >
      {children}
    </DemoSessionContext.Provider>
  );
};

export function useDemoSession() {
  const ctx = useContext(DemoSessionContext);
  if (!ctx)
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  return ctx;
}
