import { describe, it, expect } from "vitest";
import {
  calculateGeographicCenter,
  calculateMidpointWithMetrics,
  optimizeMeetingPoint,
} from "../midpoint";
import { distanceStandardDeviation, haversineDistance } from "../distance";
import type { Coordinates } from "@meetpoint/types";

describe("calculateGeographicCenter", () => {
  it("returns the midpoint between two points", () => {
    const paris: Coordinates = { lat: 48.8566, lng: 2.3522 };
    const lyon: Coordinates = { lat: 45.764, lng: 4.8357 };

    const center = calculateGeographicCenter([paris, lyon]);

    expect(center.lat).toBeGreaterThan(45.764);
    expect(center.lat).toBeLessThan(48.8566);
    expect(center.lng).toBeGreaterThan(2.3522);
    expect(center.lng).toBeLessThan(4.8357);
  });

  it("returns the same point when given a single point", () => {
    const point: Coordinates = { lat: 48.8566, lng: 2.3522 };

    const center = calculateGeographicCenter([point]);

    expect(center.lat).toBe(point.lat);
    expect(center.lng).toBe(point.lng);
  });
});

describe("calculateMidpointWithMetrics", () => {
  it("returns high fairness score for equidistant participants", () => {
    const north: Coordinates = { lat: 49.0, lng: 2.3522 };
    const south: Coordinates = { lat: 48.7, lng: 2.3522 };

    const result = calculateMidpointWithMetrics([north, south]);

    expect(result.fairnessScore).toBeGreaterThan(80);
  });

  it("returns all expected metrics", () => {
    const paris: Coordinates = { lat: 48.8566, lng: 2.3522 };
    const lyon: Coordinates = { lat: 45.764, lng: 4.8357 };

    const result = calculateMidpointWithMetrics([paris, lyon]);

    expect(result).toHaveProperty("midpoint");
    expect(result).toHaveProperty("fairnessScore");
    expect(result).toHaveProperty("averageDistanceKm");
    expect(result).toHaveProperty("maxDistanceKm");
    expect(result.midpoint).toHaveProperty("lat");
    expect(result.midpoint).toHaveProperty("lng");
    expect(typeof result.fairnessScore).toBe("number");
    expect(typeof result.averageDistanceKm).toBe("number");
    expect(typeof result.maxDistanceKm).toBe("number");
    expect(result.averageDistanceKm).toBeGreaterThan(0);
    expect(result.maxDistanceKm).toBeGreaterThanOrEqual(result.averageDistanceKm);
  });
});

describe("optimizeMeetingPoint", () => {
  it("never increases dispersion relative to the geographic centre", () => {
    const pts: Coordinates[] = [
      { lat: 48.85, lng: 2.35 },
      { lat: 48.86, lng: 2.36 },
      { lat: 45.76, lng: 4.83 },
    ];

    const stdCenter = distanceStandardDeviation(calculateGeographicCenter(pts), pts);
    const stdOptimized = distanceStandardDeviation(optimizeMeetingPoint(pts), pts);

    expect(stdOptimized).toBeLessThanOrEqual(stdCenter);
  });

  it("reaches a fairer point far from the centroid (search radius scales with spread)", () => {
    // Two nearby points + one far away: the fair point sits tens of km from the
    // vector centroid, well beyond the old fixed 2 km search box.
    const pts: Coordinates[] = [
      { lat: 48.85, lng: 2.35 },
      { lat: 48.87, lng: 2.4 },
      { lat: 43.3, lng: 5.4 },
    ];

    const center = calculateGeographicCenter(pts);
    const optimized = optimizeMeetingPoint(pts);

    expect(distanceStandardDeviation(optimized, pts)).toBeLessThan(
      distanceStandardDeviation(center, pts)
    );
    expect(haversineDistance(center, optimized)).toBeGreaterThan(5);
  });

  it("returns the centre for two already-equidistant points", () => {
    const points: Coordinates[] = [
      { lat: 49.0, lng: 2.35 },
      { lat: 48.7, lng: 2.35 },
    ];

    const center = calculateGeographicCenter(points);
    const optimized = optimizeMeetingPoint(points);

    expect(optimized.lat).toBeCloseTo(center.lat, 5);
    expect(optimized.lng).toBeCloseTo(center.lng, 5);
  });
});
