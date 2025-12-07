"use client";

import { useDemoSession } from "@/components/demo/DemoSessionProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "xterm/css/xterm.css";

type XTerm = typeof import("xterm");

const RESET_MS = 2 * 60 * 1000; // 2 minutes inactivity reset
const FEATURE_ENABLED =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_FEATURE_TERMINAL === "1" ||
      process.env.NEXT_PUBLIC_FEATURE_TERMINAL === "true")) ||
  false;
const WS_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_TERMINAL_WS_URL as string)) ||
  "ws://127.0.0.1:4001/ws";

export default function TerminalDemo() {
  const session = useDemoSession();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<InstanceType<XTerm["Terminal"]> | null>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const liveRef = useRef<boolean>(false);
  const dataDisposableRef = useRef<{ dispose: () => void } | null>(null);
  const resizeDisposableRef = useRef<{ dispose: () => void } | null>(null);
  const demoBufferRef = useRef<string>("");
  const [isLive, setIsLive] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);

  const script = useMemo(
    () => [
      "Thanks for checking out Quarry!",
      "Source code is available at https://github.com/russellbomer/quarry",
      "Hope to see you again soon! 😊",
    ],
    []
  );

  const writeLines = useCallback(
    (lines: string[], delay = 250, onDone?: () => void) => {
      if (!termRef.current) return;
      let i = 0;
      const tick = () => {
        if (!termRef.current) return;
        if (i >= lines.length) {
          if (onDone) onDone();
          return;
        }
        termRef.current.writeln(`\x1b[1;32m$\x1b[0m ${lines[i]}`);
        i += 1;
        setTimeout(tick, delay);
      };
      tick();
    },
    []
  );

  const printPrompt = useCallback(() => {
    if (!termRef.current) return;
    termRef.current.write("\r\n\x1b[1;32m$\x1b[0m ");
  }, []);

  const processDemoCommand = useCallback(
    (raw: string) => {
      if (!termRef.current) return;
      const term = termRef.current;
      const cmd = raw.trim().toLowerCase();
      if (cmd.length === 0) {
        // empty -> replay script, then prompt
        writeLines(script, 250, () => {
          printPrompt();
        });
        return;
      }
      if (cmd === "help") {
        term.writeln("\r\nCommands: help, clear, replay");
        printPrompt();
        return;
      }
      if (cmd === "clear") {
        term.clear();
        term.writeln("Portfolio Terminal Demo\r\n");
        term.writeln(`Session: ${session.sessionId}`);
        printPrompt();
        return;
      }
      if (cmd === "replay") {
        demoBufferRef.current = "";
        writeLines(script, 250, () => {
          printPrompt();
        });
        return;
      }
      term.writeln(
        `\r\nDemo mode: command not available ${JSON.stringify(
          raw.trim()
        )}. Try: help | clear | replay`
      );
      printPrompt();
    },
    [printPrompt, script, session.sessionId, writeLines]
  );

  const resetSession = useCallback(() => {
    if (!termRef.current) return;
    termRef.current.reset();
    termRef.current.writeln("Portfolio Terminal Demo\r\n");
    termRef.current.writeln(`Session: ${session.sessionId}`);
    if (FEATURE_ENABLED) {
      termRef.current.writeln(
        liveRef.current
          ? "Connected to live terminal. Type commands or Ctrl+C/Ctrl+L."
          : "Live terminal unavailable; using demo script."
      );
    } else {
      termRef.current.writeln("Type 'help' or press Enter to replay.");
    }
  }, [session.sessionId]);

  const scheduleReset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      session.reset();
      resetSession();
    }, RESET_MS);
  }, [resetSession, session]);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let handleWindowResize: (() => void) | null = null;
    (async () => {
      try {
        const xterm = await import("xterm");
        const { FitAddon } = await import("@xterm/addon-fit");
        xtermRef.current = xterm;
        if (disposed) return;
        const term = new xterm.Terminal({
          convertEol: true,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        });
        termRef.current = term;
        term.open(containerRef.current!);

        // Enable clipboard paste with Ctrl+V / Cmd+V
        term.attachCustomKeyEventHandler((event: KeyboardEvent) => {
          // Handle Ctrl+V / Cmd+V for paste
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "v" &&
            event.type === "keydown"
          ) {
            navigator.clipboard.readText().then((text) => {
              if (text && termRef.current) {
                // In live mode, send to websocket
                if (
                  liveRef.current &&
                  wsRef.current &&
                  wsRef.current.readyState === wsRef.current.OPEN
                ) {
                  wsRef.current.send(
                    JSON.stringify({ type: "input", data: text })
                  );
                } else {
                  // In demo mode, add to buffer and echo
                  demoBufferRef.current += text;
                  termRef.current.write(text);
                }
              }
            });
            return false; // Prevent default handling
          }

          // Handle Ctrl+C / Cmd+C for copy (when there's a selection)
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "c" &&
            event.type === "keydown"
          ) {
            const selection = term.getSelection();
            if (selection) {
              navigator.clipboard.writeText(selection);
              return false; // Prevent default handling
            }
            // If no selection, let Ctrl+C pass through (for SIGINT in live mode)
          }

          return true; // Allow default handling for other keys
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        // Clean startup - no messages before quarry banner
        // Initial fit after a tick so container is laid out
        setTimeout(() => {
          try {
            fitAddon.fit();
          } catch {
            // Ignore fit errors during initialization
          }
        }, 0);
        setLoaded(true);
        scheduleReset();

        // helper: detach any existing handlers
        const detachHandlers = () => {
          try {
            dataDisposableRef.current?.dispose();
          } catch {
            // Ignore dispose errors
          }
          try {
            resizeDisposableRef.current?.dispose();
          } catch {
            // Ignore dispose errors
          }
          dataDisposableRef.current = null;
          resizeDisposableRef.current = null;
        };

        // helper: attach demo handlers
        const attachDemoHandlers = () => {
          detachHandlers();
          const disp = term.onData((data: string) => {
            scheduleReset();
            session.touch();
            for (const ch of data) {
              if (ch === "\r" || ch === "\n") {
                const current = demoBufferRef.current;
                demoBufferRef.current = "";
                processDemoCommand(current);
              } else if (ch === "\u007f" || ch === "\b") {
                if (demoBufferRef.current.length > 0) {
                  demoBufferRef.current = demoBufferRef.current.slice(0, -1);
                  term.write("\b \b");
                }
              } else if (ch >= " " && ch <= "~") {
                demoBufferRef.current += ch;
                term.write(ch);
              } else {
                // ignore non-printable control chars
              }
            }
          });
          dataDisposableRef.current = disp as unknown as {
            dispose: () => void;
          };
          setIsLive(false);
          printPrompt();
        };

        // helper: attach live handlers
        const attachLiveHandlers = (_ws: WebSocket) => {
          detachHandlers();
          const dataDisp = term.onData((data: string) => {
            scheduleReset();
            session.touch();
            if (
              wsRef.current &&
              wsRef.current.readyState === wsRef.current.OPEN
            ) {
              wsRef.current.send(JSON.stringify({ type: "input", data }));
            }
          });
          const resizeDisp = term.onResize(({ cols, rows }) => {
            if (
              wsRef.current &&
              wsRef.current.readyState === wsRef.current.OPEN
            ) {
              wsRef.current.send(
                JSON.stringify({ type: "resize", cols, rows })
              );
            }
          });
          dataDisposableRef.current = dataDisp as unknown as {
            dispose: () => void;
          };
          resizeDisposableRef.current = resizeDisp as unknown as {
            dispose: () => void;
          };
          setIsLive(true);
        };

        // window/container resize handling (fit to container)
        const doFit = () => {
          try {
            fitAddon.fit();
          } catch {
            // Ignore fit errors on resize
          }
        };
        resizeObserver =
          typeof ResizeObserver !== "undefined" && containerRef.current
            ? new ResizeObserver(() => doFit())
            : null;
        if (resizeObserver && containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }
        handleWindowResize = () => doFit();
        if (typeof window !== "undefined" && handleWindowResize) {
          window.addEventListener("resize", handleWindowResize);
        }

        // If feature flag on, try to connect to live WS; else fall back to script
        if (FEATURE_ENABLED) {
          try {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
              liveRef.current = true;
              setIsLive(true);
              attachLiveHandlers(ws);
            };
            ws.onmessage = (ev) => {
              if (!termRef.current) return;
              const data = typeof ev.data === "string" ? ev.data : "";

              // Check for session message from server
              try {
                const msg = JSON.parse(data);
                if (msg && msg.type === "session" && msg.id) {
                  session.setServerSessionId(msg.id);
                  return; // Don't write session message to terminal
                }
              } catch {
                // Not JSON, treat as terminal output
              }

              termRef.current.write(data);
            };
            ws.onclose = (ev) => {
              liveRef.current = false;
              setIsLive(false);
              setWsError(
                `WebSocket closed (code: ${ev.code}, reason: ${
                  ev.reason || "no reason"
                })`
              );
              if (!disposed && termRef.current) {
                termRef.current.writeln(
                  "\r\n\x1b[1;33m[client]\x1b[0m disconnected. Falling back to demo script.\r\n"
                );
                attachDemoHandlers();
                writeLines(script, 250, () => {
                  printPrompt();
                });
              }
            };
            ws.onerror = (ev) => {
              liveRef.current = false;
              setIsLive(false);
              setWsError(
                `WebSocket error: ${
                  ev instanceof Event ? "Event" : JSON.stringify(ev)
                }`
              );
              if (!disposed && termRef.current) {
                termRef.current.writeln(
                  "\r\n\x1b[1;31m[client]\x1b[0m ws error. Using demo script.\r\n"
                );
                attachDemoHandlers();
                writeLines(script, 250, () => {
                  printPrompt();
                });
              }
            };
          } catch {
            // Fallback to script mode if WS construction fails
            attachDemoHandlers();
            writeLines(script, 250, () => {
              printPrompt();
            });
          }
        } else {
          // Simulated demo mode
          attachDemoHandlers();
          writeLines(script, 250, () => {
            printPrompt();
          });
        }
      } catch {
        // Graceful fallback to non-xterm preview
        setLoaded(false);
      }
    })();
    return () => {
      disposed = true;
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {
          // Ignore close errors
        }
        wsRef.current = null;
      }
      try {
        if (typeof window !== "undefined" && handleWindowResize) {
          window.removeEventListener("resize", handleWindowResize);
        }
        handleWindowResize = null;
      } catch {
        // Ignore cleanup errors
      }
      try {
        // disconnect any resize observer
        resizeObserver?.disconnect?.();
        resizeObserver = null;
      } catch {
        // Ignore cleanup errors
      }
      try {
        dataDisposableRef.current?.dispose();
      } catch {
        // Ignore dispose errors
      }
      try {
        resizeDisposableRef.current?.dispose();
      } catch {
        // Ignore dispose errors
      }
      if (termRef.current) {
        termRef.current.dispose?.();
        termRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col font-mono text-sm relative">
      {!FEATURE_ENABLED && (
        <div className="absolute inset-x-0 top-0 z-10 bg-yellow-100 text-yellow-900 text-xs px-3 py-1 border-b">
          Live terminal demo is disabled. Coming soon.
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-0">
        {wsError && (
          <div className="mb-2 rounded bg-red-100 text-red-800 text-xs px-3 py-2 border border-red-300 shrink-0">
            <strong>Terminal connection error:</strong> {wsError}
            <br />
            <span className="font-mono">{WS_URL}</span>
          </div>
        )}
        <div className="flex-1 min-h-0 flex flex-col">
          <div ref={containerRef} className="flex-1 min-h-0" />
          <div className="mt-2 text-[11px] text-white/70 shrink-0">
            <span>
              Mode:{" "}
              {FEATURE_ENABLED
                ? isLive
                  ? "Live"
                  : "Demo (fallback)"
                : "Demo (feature off)"}
              {FEATURE_ENABLED && <> • WS: {WS_URL}</>}
            </span>
          </div>
          {!loaded && (
            <div className="space-y-2 shrink-0">
              {script.map((line, i) => (
                <div key={i}>
                  <span className="text-primary">$</span> {line}
                </div>
              ))}
            </div>
          )}
          {loaded && (
            <div className="mt-2 text-xs text-white/70 shrink-0">
              Inactive: {Math.floor(session.inactiveMs / 1000)}s / Auto reset at{" "}
              {new Date(session.expiresAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
