// Plain helper module (no Convex functions) — excluded from the generated API.

/**
 * Run an async mapper over items with a bounded number of concurrent workers.
 * Faster than a sequential for-await loop without flooding rate-limited APIs.
 * Results preserve input order.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]!, index);
    }
  }

  const workerCount = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
}
