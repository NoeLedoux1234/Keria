"use client";

import { motion } from "framer-motion";

interface IntroScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: IntroScreenProps) {
  return (
    <motion.div
      className="bg-keria-darker fixed inset-0 z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    />
  );
}
