/**
 * Token Manager Module
 *
 * Handles session token generation and validation.
 * Tokens are short-lived (default 60s) and bound to client IP.
 *
 * Token format: HMAC-signed JSON payload containing:
 * - Session nonce (random)
 * - Client IP (optional binding)
 * - Expiration timestamp
 * - User-Agent hash (optional)
 */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { TOKEN_SECRET, TOKEN_TTL_SEC, DEBUG } from "./config.js";

const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[tokenManager]", ...args);
};

interface TokenPayload {
  nonce: string;
  ip: string;
  uaHash: string;
  exp: number; // Expiration timestamp (ms)
}

// In-memory token store for revocation and single-use enforcement
// Key: nonce, Value: { used: boolean, exp: number }
const tokenStore = new Map<string, { used: boolean; exp: number }>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [nonce, data] of tokenStore) {
    if (data.exp < now) {
      tokenStore.delete(nonce);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    log(`Cleaned up ${cleaned} expired tokens`);
  }
}, 60 * 1000); // Every minute

/**
 * Hash user-agent for storage (we don't need the full string)
 */
function hashUserAgent(ua: string): string {
  return createHmac("sha256", "ua-salt").update(ua || "").digest("hex").slice(0, 16);
}

/**
 * Sign a payload with HMAC-SHA256
 */
function signPayload(payload: TokenPayload): string {
  const data = JSON.stringify(payload);
  const signature = createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");
  // Token format: base64(payload).signature
  const encodedPayload = Buffer.from(data).toString("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and parse a token
 */
function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      log("Invalid token format");
      return null;
    }

    const [encodedPayload, signature] = parts;
    const data = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const expectedSig = createHmac("sha256", TOKEN_SECRET).update(data).digest("hex");

    // Timing-safe comparison
    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");

    if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
      log("Invalid token signature");
      return null;
    }

    return JSON.parse(data) as TokenPayload;
  } catch (err) {
    log("Token verification error:", err);
    return null;
  }
}

/**
 * Create a new session token
 *
 * @param clientIp - Client IP address
 * @param userAgent - Client user-agent (optional)
 * @returns Token string
 */
export function createSessionToken(clientIp: string, userAgent?: string): string {
  const nonce = randomBytes(16).toString("hex");
  const exp = Date.now() + TOKEN_TTL_SEC * 1000;

  const payload: TokenPayload = {
    nonce,
    ip: clientIp,
    uaHash: hashUserAgent(userAgent || ""),
    exp,
  };

  // Store token for single-use enforcement
  tokenStore.set(nonce, { used: false, exp });

  const token = signPayload(payload);
  log(`Created token for IP ${clientIp}, expires in ${TOKEN_TTL_SEC}s`);

  return token;
}

export interface TokenValidationResult {
  valid: boolean;
  error?: string;
  payload?: TokenPayload;
}

/**
 * Validate a session token
 *
 * @param token - Token string from client
 * @param clientIp - Client IP address (for binding check)
 * @param userAgent - Client user-agent (for binding check, optional)
 * @returns Validation result
 */
export function validateSessionToken(
  token: string,
  clientIp: string,
  userAgent?: string
): TokenValidationResult {
  if (!token) {
    return { valid: false, error: "Token required" };
  }

  // Verify signature and parse payload
  const payload = verifyToken(token);
  if (!payload) {
    return { valid: false, error: "Invalid token" };
  }

  // Check expiration
  if (Date.now() > payload.exp) {
    log(`Token expired for IP ${clientIp}`);
    return { valid: false, error: "Token expired" };
  }

  // Check IP binding
  if (payload.ip !== clientIp) {
    log(`Token IP mismatch: expected ${payload.ip}, got ${clientIp}`);
    return { valid: false, error: "Token IP mismatch" };
  }

  // Check user-agent binding (optional, warn only)
  const currentUaHash = hashUserAgent(userAgent || "");
  if (payload.uaHash !== currentUaHash) {
    log(`Token UA mismatch for IP ${clientIp} (proceeding anyway)`);
    // We don't reject on UA mismatch, just log it
  }

  // Check single-use
  const stored = tokenStore.get(payload.nonce);
  if (!stored) {
    log(`Token nonce not found (may have expired from store)`);
    return { valid: false, error: "Token not found" };
  }

  if (stored.used) {
    log(`Token already used for IP ${clientIp}`);
    return { valid: false, error: "Token already used" };
  }

  // Mark as used
  stored.used = true;
  log(`Token validated for IP ${clientIp}`);

  return { valid: true, payload };
}

/**
 * Get token stats for debugging
 */
export function getTokenStats(): { active: number; used: number } {
  let active = 0;
  let used = 0;
  const now = Date.now();

  for (const [, data] of tokenStore) {
    if (data.exp > now) {
      if (data.used) {
        used++;
      } else {
        active++;
      }
    }
  }

  return { active, used };
}
