interface Bucket {
  tokens: number;
  lastRefill: number;
}

// In-memory token bucket registry
const ipBuckets = new Map<string, Bucket>();

const MAX_TOKENS = 100; // Capped requests
const REFILL_RATE_PER_MS = 100 / (60 * 1000); // 100 tokens per minute

/**
 * Checks if the request from the given IP address is rate-limited.
 * Returns true if allowed, false if rate-limited.
 */
export function checkRateLimit(ipAddress: string): boolean {
  const now = Date.now();
  
  // Prevent memory leaks: periodically prune inactive buckets (inactive for >10 mins)
  if (ipBuckets.size > 2000) {
    const pruneThreshold = now - 10 * 60 * 1000;
    for (const [ip, b] of ipBuckets.entries()) {
      if (b.lastRefill < pruneThreshold) {
        ipBuckets.delete(ip);
      }
    }
  }

  let bucket = ipBuckets.get(ipAddress);

  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: now };
    ipBuckets.set(ipAddress, bucket);
  }

  // Calculate token refill since last refill
  const elapsedMs = now - bucket.lastRefill;
  const refilledTokens = elapsedMs * REFILL_RATE_PER_MS;
  
  bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refilledTokens);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true; // Request allowed
  }

  return false; // Rate limited
}
