/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as eventParticipants from "../eventParticipants.js";
import type * as eventStages from "../eventStages.js";
import type * as events from "../events.js";
import type * as googlePlaces from "../googlePlaces.js";
import type * as meets from "../meets.js";
import type * as participants from "../participants.js";
import type * as places from "../places.js";
import type * as routing from "../routing.js";
import type * as routingInternal from "../routingInternal.js";
import type * as searchPlaces from "../searchPlaces.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  eventParticipants: typeof eventParticipants;
  eventStages: typeof eventStages;
  events: typeof events;
  googlePlaces: typeof googlePlaces;
  meets: typeof meets;
  participants: typeof participants;
  places: typeof places;
  routing: typeof routing;
  routingInternal: typeof routingInternal;
  searchPlaces: typeof searchPlaces;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
