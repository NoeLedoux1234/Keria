"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Always show intro on page load
    setShowIntro(true);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  };

  // Prevent hydration mismatch - show nothing on server
  if (!isClient) {
    return null;
  }

  return (
    <LoadingContext.Provider value={{ hasSeenIntro: !showIntro }}>
      <AnimatePresence mode="wait">
        {showIntro && (
          <LoadingScreen key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReady && (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}
