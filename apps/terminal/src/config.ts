/**
 * Terminal Server Configuration
 *
 * Configuration values with environment variable overrides.
 * Secrets use placeholders - actual values must be set on the droplet.
 *
 * MANUAL: Set TOKEN_SECRET on the droplet:
 *   export TOKEN_SECRET=$(openssl rand -hex 32)
 */

// Server settings
export const SERVER_PORT = parseInt(process.env.TERMINAL_PORT || "4000", 10);
export const SERVER_HOST = process.env.TERMINAL_HOST || "127.0.0.1";
export const OUTPUT_DIR = process.env.TERMINAL_OUTPUT_DIR || "./data/quarry-output";
export const AUTO_RUN_CMD = process.env.TERMINAL_AUTO_RUN || "quarry";
export const DEBUG = process.env.TERMINAL_DEBUG === "1" || process.env.TERMINAL_DEBUG === "true";

// Sandbox settings
export const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE || "quarry-session:latest";
export const SESSION_TIMEOUT_SEC = parseInt(process.env.SESSION_TIMEOUT_SEC || "900", 10);

// Token settings
// MANUAL: Must set TOKEN_SECRET on the droplet (e.g., openssl rand -hex 32)
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "";
export const TOKEN_TTL_SEC = parseInt(process.env.TOKEN_TTL_SEC || "60", 10); // 60 seconds to establish WS

// Rate limiting settings
export const RATE_LIMIT = {
  // Per-IP concurrent session cap
  maxConcurrentSessions: parseInt(process.env.RATE_LIMIT_MAX_SESSIONS || "2", 10),

  // Per-IP connection attempts per minute
  maxConnectionsPerMinute: parseInt(process.env.RATE_LIMIT_CONNECTIONS_PER_MIN || "10", 10),

  // WS message rate limiting (messages per second)
  maxMessagesPerSecond: parseInt(process.env.RATE_LIMIT_MSG_PER_SEC || "30", 10),

  // Window duration for connection rate limiting (ms)
  connectionWindowMs: 60 * 1000, // 1 minute

  // Window duration for message rate limiting (ms)
  messageWindowMs: 1000, // 1 second
} as const;

// File download settings
export const FILE_SETTINGS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxSessionStorage: 50 * 1024 * 1024, // 50MB per session
  allowedExtensions: [".json", ".jsonl", ".csv", ".html", ".txt", ".md", ".yml", ".yaml"],
} as const;

// Host validation settings
// Only allow requests from the expected host (quarry.russellbomer.com)
// Set ALLOWED_HOSTS env to comma-separated list to override (e.g., for local dev: "localhost,127.0.0.1")
export const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "quarry.russellbomer.com")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

/**
 * Validate critical configuration at startup
 */
export function validateConfig(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!TOKEN_SECRET) {
    errors.push("TOKEN_SECRET is not set. MANUAL: Set this environment variable on the droplet.");
  }

  if (TOKEN_SECRET && TOKEN_SECRET.length < 32) {
    errors.push("TOKEN_SECRET should be at least 32 characters for security.");
  }

  if (ALLOWED_HOSTS.length === 0) {
    errors.push("ALLOWED_HOSTS is empty. Server will reject all requests.");
  }

  // Warn if localhost is allowed (likely dev mode)
  if (ALLOWED_HOSTS.some((h) => h === "localhost" || h === "127.0.0.1")) {
    warnings.push("ALLOWED_HOSTS includes localhost - ensure this is intentional for production.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
