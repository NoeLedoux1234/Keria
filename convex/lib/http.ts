// Shared HTTP helper for Convex actions that call external APIs.
// Plain module (no query/mutation/action) so it stays out of the generated API.

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 1;

export interface FetchWithTimeoutOptions extends RequestInit {
  /** Abort the request after this many milliseconds. Defaults to 10s. */
  timeoutMs?: number;
  /** Extra attempts on timeout / network error / 429 / 5xx. Defaults to 1. */
  retries?: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt: number): number {
  return 300 * 2 ** attempt;
}

/**
 * fetch with an enforced timeout and bounded retries on transient failures.
 * Never hangs an action on a slow upstream, and rides out brief 429/5xx blips.
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES, ...init } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });

      // Retry rate-limits and server errors, but surface client errors as-is.
      if ((response.status === 429 || response.status >= 500) && attempt < retries) {
        lastError = new Error(`Upstream responded ${response.status}`);
        await delay(backoffMs(attempt));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await delay(backoffMs(attempt));
        continue;
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Network request failed");
}
