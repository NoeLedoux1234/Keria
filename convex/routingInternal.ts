import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const ORS_BASE_URL = "https://api.openrouteservice.org";

const ORS_PROFILES: Record<string, string> = {
  driving: "driving-car",
  cycling: "cycling-regular",
  walking: "foot-walking",
  transit: "driving-car",
};

type ORSIsochroneFeature = {
  geometry: {
    coordinates: Array<Array<[number, number]>>;
  };
};

function decodePolyline(encoded: string): Array<[number, number]> {
  const coordinates: Array<[number, number]> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lng / 1e5, lat / 1e5]);
  }

  return coordinates;
}

export const calculateRoute = internalAction({
  args: {
    originLat: v.number(),
    originLng: v.number(),
    destLat: v.number(),
    destLng: v.number(),
    transportMode: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      return {
        success: false as const,
        error: "ORS_API_KEY not configured",
        durationMinutes: null,
        distanceKm: null,
      };
    }

    const profile = ORS_PROFILES[args.transportMode] || "driving-car";
    const url = `${ORS_BASE_URL}/v2/directions/${profile}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [args.originLng, args.originLat],
            [args.destLng, args.destLat],
          ],
          geometry: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ORS API error:", errorText);
        return {
          success: false as const,
          error: `ORS API error: ${response.status}`,
          durationMinutes: null,
          distanceKm: null,
        };
      }

      const data = await response.json();

      let summary: { distance: number; duration: number } | undefined;
      let coordinates: Array<[number, number]> = [];

      if ("features" in data && Array.isArray(data.features) && data.features[0]) {
        const feature = data.features[0];
        summary = feature?.properties?.summary;
        coordinates = feature?.geometry?.coordinates ?? [];
      } else if ("routes" in data && Array.isArray(data.routes) && data.routes[0]) {
        const route = data.routes[0];
        summary = route.summary;
        if (typeof route.geometry === "string") {
          coordinates = decodePolyline(route.geometry);
        } else if (route.geometry?.coordinates) {
          coordinates = route.geometry.coordinates;
        }
      }

      if (!summary) {
        console.error("ORS response format not recognized:", JSON.stringify(data).slice(0, 500));
        return {
          success: false as const,
          error: "No route found - invalid response format",
          durationMinutes: null,
          distanceKm: null,
        };
      }

      return {
        success: true as const,
        durationMinutes: Math.round(summary.duration / 60),
        distanceKm: Math.round(summary.distance / 100) / 10,
        polyline: coordinates.map(([lng, lat]) => ({
          lat,
          lng,
        })),
      };
    } catch (error) {
      console.error("Route calculation error:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
        durationMinutes: null,
        distanceKm: null,
      };
    }
  },
});

export const calculateIsochrone = internalAction({
  args: {
    lat: v.number(),
    lng: v.number(),
    transportMode: v.string(),
    durationMinutes: v.array(v.number()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      return {
        success: false as const,
        error: "ORS_API_KEY not configured",
        isochrones: [] as Array<{ durationMinutes: number | undefined; polygon: Array<{ lat: number; lng: number }> }>,
      };
    }

    const profile = ORS_PROFILES[args.transportMode] || "driving-car";
    const url = `${ORS_BASE_URL}/v2/isochrones/${profile}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locations: [[args.lng, args.lat]],
          range: args.durationMinutes.map((d) => d * 60),
          range_type: "time",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ORS Isochrone error:", errorText);
        return {
          success: false as const,
          error: `ORS API error: ${response.status}`,
          isochrones: [] as Array<{ durationMinutes: number | undefined; polygon: Array<{ lat: number; lng: number }> }>,
        };
      }

      const data = await response.json();

      const isochrones = data.features.map((feature: ORSIsochroneFeature, index: number) => ({
        durationMinutes: args.durationMinutes[index],
        polygon: feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) => ({
          lat,
          lng,
        })),
      }));

      return {
        success: true as const,
        isochrones,
      };
    } catch (error) {
      console.error("Isochrone calculation error:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
        isochrones: [] as Array<{ durationMinutes: number | undefined; polygon: Array<{ lat: number; lng: number }> }>,
      };
    }
  },
});
