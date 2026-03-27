"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./loading-screen";

interface LoadingContextValue {
  hasSeenIntro: boolean;
}

const LoadingContext = createContext<LoadingContextValue>({
  hasSeenIntro: true,
});

export function useLoadingContext() {
  return useContext(LoadingContext);
}

export function LoadingScreenProvider({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setShowIntro(true);
  }, []);

  return (
    <LoadingContext.Provider value={{ hasSeenIntro: !showIntro }}>
      {children}
      {isClient && showIntro && (
        <AnimatePresence>
          <LoadingScreen key="intro" onComplete={() => setShowIntro(false)} />
        </AnimatePresence>
      )}
    </LoadingContext.Provider>
  );
}
