/**
 * Sandbox Runner Module
 *
 * Launches per-session Docker containers with strict security constraints.
 * Bridges WebSocket <-> container stdio without any host shell involvement.
 *
 * Security constraints applied to each session container:
 * - --network none (no network access)
 * - --read-only (read-only root filesystem)
 * - --cap-drop ALL (drop all capabilities)
 * - --security-opt no-new-privileges (prevent privilege escalation)
 * - --pids-limit 128 (limit process count)
 * - --memory 512m (memory limit)
 * - --cpus 0.5 (CPU limit)
 * - --user 1000:1000 (non-root user)
 * - tmpfs mounts for writable paths
 */

import Docker from "dockerode";
import { EventEmitter } from "events";
import path from "path";

// Debug logging
const DEBUG =
  process.env.TERMINAL_DEBUG === "1" || process.env.TERMINAL_DEBUG === "true";
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[sandboxRunner]", ...args);
};

// Configuration
const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE || "quarry-session:latest";
const SESSION_TIMEOUT_SEC = parseInt(
  process.env.SESSION_TIMEOUT_SEC || "900",
  10
); // 15 minutes

// Docker client connects to local daemon (DOCKER_HOST env or default socket)
// Note: This is server-side only; session containers do NOT have docker access
const docker = new Docker();

export interface SandboxOptions {
  sessionId: string;
  sessionDir: string; // Host path for session output directory
  cols?: number;
  rows?: number;
  autoRunCmd?: string;
}

export interface SandboxSession extends EventEmitter {
  sessionId: string;
  containerId: string;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  kill(): Promise<void>;
}

/**
 * Create a new sandbox session container.
 *
 * Returns a SandboxSession that emits:
 * - 'data' (string) - output from container
 * - 'exit' ({ exitCode: number }) - container exited
 * - 'error' (Error) - error occurred
 */
export async function createSandbox(
  options: SandboxOptions
): Promise<SandboxSession> {
  const { sessionId, sessionDir, cols = 80, rows = 24, autoRunCmd } = options;

  log(`Creating sandbox for session ${sessionId}`);

  // Ensure session directory is absolute
  const absoluteSessionDir = path.resolve(sessionDir);

  // Build startup script that sets up environment and optionally runs auto command
  // This runs INSIDE the container, not on the host
  const startupScript = autoRunCmd
    ? `export PS1='user@quarry-demo> ' && cd /home/quarry/output && ${autoRunCmd}; exec /bin/sh -i`
    : `export PS1='user@quarry-demo> ' && cd /home/quarry/output && exec /bin/sh -i`;

  // Create container with strict security constraints
  const container = await docker.createContainer({
    Image: SANDBOX_IMAGE,
    Cmd: ["/bin/sh", "-c", startupScript],
    Tty: true,
    OpenStdin: true,
    StdinOnce: false,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    User: "1000:1000", // Non-root user
    WorkingDir: "/home/quarry/output",
    Env: [
      `SESSION_ID=${sessionId}`,
      "TERM=xterm-256color",
      "HOME=/home/quarry",
      "PS1=user@quarry-demo> ",
      "QUARRY_OUTPUT_DIR=/home/quarry/output",
    ],
    HostConfig: {
      // Network isolation - no network access
      NetworkMode: "none",

      // Read-only root filesystem
      ReadonlyRootfs: true,

      // Drop all capabilities
      CapDrop: ["ALL"],

      // Prevent privilege escalation
      SecurityOpt: ["no-new-privileges:true"],

      // Resource limits
      PidsLimit: 128,
      Memory: 512 * 1024 * 1024, // 512MB
      NanoCpus: 500000000, // 0.5 CPUs (in nanoseconds)

      // Auto-remove container when it exits
      AutoRemove: true,

      // Tmpfs mounts for writable paths
      Tmpfs: {
        "/tmp": "size=64M,mode=1777",
        "/home/quarry/.local": "size=64M,mode=755,uid=1000,gid=1000",
        "/home/quarry/.cache": "size=64M,mode=755,uid=1000,gid=1000",
      },

      // Bind mount for session output directory
      Binds: [`${absoluteSessionDir}:/home/quarry/output:rw`],

      // Stop timeout
      StopTimeout: 5,
    },
    // Container labels for identification
    Labels: {
      "quarry.session": sessionId,
      "quarry.created": new Date().toISOString(),
    },
    // Initial terminal size
    ...(cols &&
      rows && {
        // Note: Docker API uses HostConfig.ConsoleSize for initial size
      }),
  });

  log(`Container created: ${container.id}`);

  // Start the container
  await container.start();
  log(`Container started: ${container.id}`);

  // Attach to container stdin/stdout/stderr
  const stream = await container.attach({
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true,
    hijack: true,
  });

  // Resize terminal if dimensions provided
  if (cols && rows) {
    try {
      await container.resize({ w: cols, h: rows });
    } catch (err) {
      log(`Initial resize failed (non-fatal):`, err);
    }
  }

  // Create session object
  const session = new EventEmitter() as SandboxSession;
  session.sessionId = sessionId;
  session.containerId = container.id;

  // Write to container stdin
  session.write = (data: string) => {
    if (stream.writable) {
      stream.write(data);
    }
  };

  // Resize container terminal
  session.resize = async (newCols: number, newRows: number) => {
    try {
      await container.resize({ w: newCols, h: newRows });
      log(`Resized container to ${newCols}x${newRows}`);
    } catch (err) {
      log(`Resize failed:`, err);
    }
  };

  // Kill container
  session.kill = async () => {
    try {
      log(`Killing container ${container.id}`);
      await container.stop({ t: 1 });
    } catch (err) {
      // Container may already be stopped
      log(`Stop failed (may be already stopped):`, err);
      try {
        await container.remove({ force: true });
      } catch {
        // Ignore remove errors
      }
    }
  };

  // Handle stdout/stderr data from container
  stream.on("data", (chunk: Buffer) => {
    // Docker TTY streams are raw, no demuxing needed when Tty: true
    const data = chunk.toString("utf8");
    session.emit("data", data);
  });

  stream.on("end", () => {
    log(`Stream ended for container ${container.id}`);
  });

  stream.on("error", (err: Error) => {
    log(`Stream error for container ${container.id}:`, err);
    session.emit("error", err);
  });

  // Monitor container for exit
  container.wait().then(
    (result) => {
      log(`Container exited with code ${result.StatusCode}`);
      session.emit("exit", { exitCode: result.StatusCode });
    },
    (err) => {
      log(`Container wait error:`, err);
      session.emit("error", err);
    }
  );

  // Set up session timeout
  const timeoutId = setTimeout(async () => {
    log(`Session timeout reached for ${sessionId}`);
    session.emit("data", "\r\n\x1b[1;33m[server]\x1b[0m Session timed out.\r\n");
    await session.kill();
  }, SESSION_TIMEOUT_SEC * 1000);

  // Clean up timeout when session ends
  session.on("exit", () => clearTimeout(timeoutId));
  session.on("error", () => clearTimeout(timeoutId));

  return session;
}

/**
 * Check if Docker is available and the sandbox image exists.
 */
export async function checkDockerReady(): Promise<{
  ready: boolean;
  error?: string;
}> {
  try {
    // Check Docker is running
    await docker.ping();
    log("Docker is running");

    // Check if sandbox image exists
    try {
      await docker.getImage(SANDBOX_IMAGE).inspect();
      log(`Sandbox image ${SANDBOX_IMAGE} found`);
      return { ready: true };
    } catch {
      return {
        ready: false,
        error: `Sandbox image '${SANDBOX_IMAGE}' not found. Build it first.`,
      };
    }
  } catch (err) {
    return {
      ready: false,
      error: `Docker is not available: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Clean up any orphaned session containers (e.g., from server crash).
 */
export async function cleanupOrphanedContainers(): Promise<number> {
  try {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ["quarry.session"] },
    });

    let cleaned = 0;
    for (const containerInfo of containers) {
      try {
        const container = docker.getContainer(containerInfo.Id);
        await container.stop({ t: 1 }).catch(() => {});
        await container.remove({ force: true }).catch(() => {});
        cleaned++;
        log(`Cleaned up orphaned container: ${containerInfo.Id}`);
      } catch {
        // Ignore cleanup errors
      }
    }

    return cleaned;
  } catch (err) {
    log(`Failed to cleanup orphaned containers:`, err);
    return 0;
  }
}
