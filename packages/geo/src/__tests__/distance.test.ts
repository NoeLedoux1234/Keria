import { describe, it, expect } from "vitest";
import {
  degreesToRadians,
  radiansToDegrees,
  haversineDistance,
  distanceStandardDeviation,
} from "../distance";
import type { Coordinates } from "@meetpoint/types";

describe("degreesToRadians", () => {
  it("converts 0 degrees to 0 radians", () => {
    expect(degreesToRadians(0)).toBe(0);
  });

  it("converts 180 degrees to pi radians", () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  });

  it("converts 360 degrees to 2*pi radians", () => {
    expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
  });
});

describe("radiansToDegrees", () => {
  it("converts 0 radians to 0 degrees", () => {
    expect(radiansToDegrees(0)).toBe(0);
  });

  it("converts pi radians to 180 degrees", () => {
    expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
  });

  it("converts 2*pi radians to 360 degrees", () => {
    expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
  });
});

describe("haversineDistance", () => {
  it("returns ~392km between Paris and Lyon", () => {
    const paris: Coordinates = { lat: 48.8566, lng: 2.3522 };
    const lyon: Coordinates = { lat: 45.764, lng: 4.8357 };

    const distance = haversineDistance(paris, lyon);

    expect(distance).toBeGreaterThan(387);
    expect(distance).toBeLessThan(397);
  });

  it("returns 0 for the same point", () => {
    const point: Coordinates = { lat: 48.8566, lng: 2.3522 };

    expect(haversineDistance(point, point)).toBe(0);
  });
});

describe("distanceStandardDeviation", () => {
  it("returns low std dev for equidistant points", () => {
    const origin: Coordinates = { lat: 48.8566, lng: 2.3522 };
    const destinations: Coordinates[] = [
      { lat: 48.9, lng: 2.3522 },
      { lat: 48.8132, lng: 2.3522 },
    ];

    const stdDev = distanceStandardDeviation(origin, destinations);

    expect(stdDev).toBeLessThan(1);
  });

  it("returns 0 for empty destinations", () => {
    const origin: Coordinates = { lat: 48.8566, lng: 2.3522 };

    expect(distanceStandardDeviation(origin, [])).toBe(0);
  });
});
