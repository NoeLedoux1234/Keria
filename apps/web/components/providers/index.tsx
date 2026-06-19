"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import { env } from "@/lib/env";

const convex = new ConvexReactClient(env.CONVEX_URL);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ConvexProvider>
  );
}
