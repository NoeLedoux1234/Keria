"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: IntroScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollAccumulator = useRef(0);
  const isTriggered = useRef(false);

  // Motion values for drag gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-300, 0], [0, 1]);
  const scale = useTransform(y, [-300, 0], [0.8, 1]);

  // Trigger exit animation
  const triggerExit = useCallback(() => {
    if (isTriggered.current) return;
    isTriggered.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  }, [onComplete]);

  // Handle wheel/trackpad scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTriggered.current) return;

      // On Mac with natural scrolling: swipe up gesture = positive deltaY
      // On traditional scrolling: scroll up = negative deltaY
      // Support both directions for better compatibility
      const scrollUp = Math.abs(e.deltaY);

      scrollAccumulator.current += scrollUp;

      // Update motion value for visual feedback
      const newY = Math.max(-300, -scrollAccumulator.current * 0.3);
      y.set(newY);

      // Trigger if scrolled enough
      if (scrollAccumulator.current > 100) {
        triggerExit();
      }

      // Slowly decay accumulator to allow reset
      setTimeout(() => {
        if (!isTriggered.current) {
          scrollAccumulator.current = Math.max(0, scrollAccumulator.current - 20);
          if (scrollAccumulator.current === 0) {
            y.set(0);
          }
        }
      }, 500);
    };

    // Handle touch events for mobile swipe
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTriggered.current) return;
      const deltaY = touchStartY - e.touches[0].clientY;

      if (deltaY > 0) {
        y.set(-deltaY);
        if (deltaY > 150) {
          triggerExit();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [y, triggerExit]);

  // Handle drag end
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // If dragged up more than 100px or with velocity, trigger exit
      if (info.offset.y < -100 || info.velocity.y < -500) {
        triggerExit();
      }
    },
    [triggerExit]
  );

  // Handle click/tap to reveal instructions
  const handleTap = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isExiting ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.2, bottom: 0 }}
          onDragEnd={handleDragEnd}
          onTap={handleTap}
          style={{ y }}
        >
          {/* Blurred background image */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px) brightness(0.4)",
              transform: "scale(1.1)",
            }}
          />

          {/* Gradient overlay for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(30, 34, 26, 0.6) 0%, rgba(30, 34, 26, 0.8) 50%, rgba(30, 34, 26, 0.95) 100%)",
            }}
          />

          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
            }}
          />

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            style={{ opacity, scale }}
          >
            {/* Corner decorations */}
            <motion.div
              className="absolute -left-20 -top-16 h-12 w-px bg-keria-gold/40"
              initial={{ height: 0 }}
              animate={{ height: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <motion.div
              className="absolute -left-20 -top-16 h-px w-12 bg-keria-gold/40"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <motion.div
              className="absolute -right-20 -bottom-16 h-12 w-px bg-keria-gold/40"
              initial={{ height: 0 }}
              animate={{ height: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <motion.div
              className="absolute -right-20 -bottom-16 h-px w-12 bg-keria-gold/40"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            {/* Logo */}
            <motion.h1
              className="font-display text-[clamp(5rem,18vw,12rem)] font-bold leading-none tracking-[-0.02em] text-keria-cream"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              KERIA
            </motion.h1>

            {/* Gold accent line */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-keria-gold to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            />

            {/* Tagline */}
            <motion.p
              className="mt-8 text-center font-sans text-sm uppercase tracking-[0.4em] text-keria-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Trouvez votre point de rencontre
            </motion.p>
          </motion.div>

          {/* Swipe indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <motion.p
              className="text-xs uppercase tracking-[0.3em] text-keria-muted/80"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Glissez vers le haut
            </motion.p>

            {/* Animated arrow */}
            <motion.div
              className="flex flex-col items-center"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-keria-gold"
              >
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              className="h-12 w-px bg-gradient-to-b from-keria-gold/50 to-transparent"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Year */}
          <motion.span
            className="absolute right-8 top-8 font-mono text-xs text-keria-muted/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            2026
          </motion.span>
        </motion.div>
      ) : (
        /* Exit animation - dramatic reveal */
        <motion.div
          key="exit"
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Split screen reveal animation */}
          <motion.div
            className="absolute inset-0 flex"
            initial={{ opacity: 1 }}
          >
            {/* Left panel */}
            <motion.div
              className="h-full w-1/2 bg-keria-darker"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px) brightness(0.4)",
                }}
              />
              <div className="absolute inset-0 bg-keria-darker/80" />
            </motion.div>

            {/* Right panel */}
            <motion.div
              className="h-full w-1/2 bg-keria-darker"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(20px) brightness(0.4)",
                }}
              />
              <div className="absolute inset-0 bg-keria-darker/80" />
            </motion.div>
          </motion.div>

          {/* Center line that expands */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-keria-gold"
            initial={{ scaleY: 1, opacity: 1 }}
            animate={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          />

          {/* Particles effect */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-keria-gold"
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.03,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
