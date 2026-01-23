/**
 * Rate Limiter Module
 *
 * Implements per-IP rate limiting for:
 * - Concurrent sessions
 * - Connection attempts per minute
 * - WebSocket message rate
 */

import { RATE_LIMIT, DEBUG } from "./config.js";

const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[rateLimiter]", ...args);
};

// Track concurrent sessions per IP
// Key: IP address, Value: Set of session IDs
const concurrentSessions = new Map<string, Set<string>>();

// Track connection attempts per IP
// Key: IP address, Value: Array of timestamps
const connectionAttempts = new Map<string, number[]>();

// Track message rate per session
// Key: session ID, Value: { timestamps: number[], warned: boolean }
const messageRates = new Map<string, { timestamps: number[]; warned: boolean }>();

// Clean up stale data periodically
setInterval(() => {
  const now = Date.now();
  const windowMs = RATE_LIMIT.connectionWindowMs;

  // Clean up old connection attempts
  for (const [ip, timestamps] of connectionAttempts) {
    const filtered = timestamps.filter((t) => now - t < windowMs);
    if (filtered.length === 0) {
      connectionAttempts.delete(ip);
    } else {
      connectionAttempts.set(ip, filtered);
    }
  }

  // Clean up empty session sets
  for (const [ip, sessions] of concurrentSessions) {
    if (sessions.size === 0) {
      concurrentSessions.delete(ip);
    }
  }

  log(`Cleanup: ${connectionAttempts.size} IPs tracked, ${concurrentSessions.size} IPs with sessions`);
}, 60 * 1000); // Every minute

/**
 * Normalize IP address (handle IPv6-mapped IPv4)
 */
function normalizeIp(ip: string): string {
  // Convert ::ffff:127.0.0.1 to 127.0.0.1
  if (ip.startsWith("::ffff:")) {
    return ip.slice(7);
  }
  return ip;
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfterMs?: number;
}

/**
 * Check if a connection attempt is allowed (rate limit check)
 *
 * @param ip - Client IP address
 * @returns Whether the connection is allowed
 */
export function checkConnectionRate(ip: string): RateLimitResult {
  const normalizedIp = normalizeIp(ip);
  const now = Date.now();
  const windowMs = RATE_LIMIT.connectionWindowMs;

  // Get or create attempt list for this IP
  let attempts = connectionAttempts.get(normalizedIp) || [];

  // Filter to recent attempts within window
  attempts = attempts.filter((t) => now - t < windowMs);

  if (attempts.length >= RATE_LIMIT.maxConnectionsPerMinute) {
    const oldestAttempt = attempts[0];
    const retryAfterMs = windowMs - (now - oldestAttempt);

    log(`Connection rate limit exceeded for IP ${normalizedIp}: ${attempts.length}/${RATE_LIMIT.maxConnectionsPerMinute}`);

    return {
      allowed: false,
      reason: `Rate limit exceeded. Max ${RATE_LIMIT.maxConnectionsPerMinute} connections per minute.`,
      retryAfterMs,
    };
  }

  // Record this attempt
  attempts.push(now);
  connectionAttempts.set(normalizedIp, attempts);

  return { allowed: true };
}

/**
 * Check if a new session is allowed (concurrent session check)
 *
 * @param ip - Client IP address
 * @param sessionId - Session ID to track
 * @returns Whether the session is allowed
 */
export function checkConcurrentSessions(ip: string, sessionId: string): RateLimitResult {
  const normalizedIp = normalizeIp(ip);

  // Get or create session set for this IP
  const sessions = concurrentSessions.get(normalizedIp) || new Set();

  if (sessions.size >= RATE_LIMIT.maxConcurrentSessions) {
    log(`Concurrent session limit exceeded for IP ${normalizedIp}: ${sessions.size}/${RATE_LIMIT.maxConcurrentSessions}`);

    return {
      allowed: false,
      reason: `Maximum ${RATE_LIMIT.maxConcurrentSessions} concurrent session(s) allowed per IP.`,
    };
  }

  // Track this session
  sessions.add(sessionId);
  concurrentSessions.set(normalizedIp, sessions);
  log(`Session ${sessionId} started for IP ${normalizedIp} (${sessions.size}/${RATE_LIMIT.maxConcurrentSessions})`);

  return { allowed: true };
}

/**
 * Remove a session from tracking (call on disconnect)
 *
 * @param ip - Client IP address
 * @param sessionId - Session ID to remove
 */
export function releaseSession(ip: string, sessionId: string): void {
  const normalizedIp = normalizeIp(ip);
  const sessions = concurrentSessions.get(normalizedIp);

  if (sessions) {
    sessions.delete(sessionId);
    log(`Session ${sessionId} released for IP ${normalizedIp} (${sessions.size} remaining)`);

    if (sessions.size === 0) {
      concurrentSessions.delete(normalizedIp);
    }
  }

  // Also clean up message rate tracking
  messageRates.delete(sessionId);
}

/**
 * Check if a WebSocket message is allowed (message rate limit)
 *
 * @param sessionId - Session ID
 * @returns Whether the message is allowed, and if limit is being approached
 */
export function checkMessageRate(sessionId: string): RateLimitResult & { warning?: boolean } {
  const now = Date.now();
  const windowMs = RATE_LIMIT.messageWindowMs;

  // Get or create rate tracking for this session
  let rateData = messageRates.get(sessionId);
  if (!rateData) {
    rateData = { timestamps: [], warned: false };
    messageRates.set(sessionId, rateData);
  }

  // Filter to recent messages within window
  rateData.timestamps = rateData.timestamps.filter((t) => now - t < windowMs);

  const currentRate = rateData.timestamps.length;
  const maxRate = RATE_LIMIT.maxMessagesPerSecond;

  // Check if over limit
  if (currentRate >= maxRate) {
    log(`Message rate limit exceeded for session ${sessionId}: ${currentRate}/${maxRate}`);

    return {
      allowed: false,
      reason: `Message rate limit exceeded. Max ${maxRate} messages per second.`,
    };
  }

  // Record this message
  rateData.timestamps.push(now);

  // Warn if approaching limit (80%)
  const warningThreshold = Math.floor(maxRate * 0.8);
  const warning = currentRate >= warningThreshold && !rateData.warned;

  if (warning) {
    rateData.warned = true;
    log(`Message rate warning for session ${sessionId}: ${currentRate}/${maxRate}`);
  }

  // Reset warning flag if we're below threshold again
  if (currentRate < warningThreshold) {
    rateData.warned = false;
  }

  return { allowed: true, warning };
}

/**
 * Get rate limiter stats for monitoring
 */
export function getRateLimiterStats(): {
  trackedIps: number;
  activeSessions: number;
  totalSessionsTracked: number;
} {
  let totalSessions = 0;
  for (const sessions of concurrentSessions.values()) {
    totalSessions += sessions.size;
  }

  return {
    trackedIps: connectionAttempts.size,
    activeSessions: totalSessions,
    totalSessionsTracked: messageRates.size,
  };
}
