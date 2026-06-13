import { describe, it, expect, vi, afterEach } from "vitest";
import { createORSClient } from "../openroute";
import type { Coordinates } from "@meetpoint/types";

interface MatrixRequestBody {
  locations: number[][];
  sources: number[];
  destinations: number[];
  metrics: string[];
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createORSClient.getMatrix", () => {
  it("indexes sources and destinations independently when their counts differ", async () => {
    let capturedBody: MatrixRequestBody | undefined;

    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      capturedBody = JSON.parse(init.body as string) as MatrixRequestBody;
      return {
        ok: true,
        json: async () => ({ durations: [[60, 120, 180]] }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = createORSClient({ apiKey: "test-key" });
    const sources: Coordinates[] = [{ lat: 48.0, lng: 2.0 }];
    const destinations: Coordinates[] = [
      { lat: 45.0, lng: 4.0 },
      { lat: 43.0, lng: 5.0 },
      { lat: 50.0, lng: 3.0 },
    ];

    const result = await client.getMatrix(sources, destinations, "driving");

    expect(capturedBody).toBeDefined();
    expect(capturedBody?.locations).toHaveLength(4);
    expect(capturedBody?.sources).toEqual([0]);
    // 1 source + 3 destinations -> destination indices must be [1, 2, 3],
    // not [1] (the bug that mapped over `sources` instead of `destinations`).
    expect(capturedBody?.destinations).toEqual([1, 2, 3]);
    expect(result).toEqual([[1, 2, 3]]);
  });
});
