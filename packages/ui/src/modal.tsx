"use client";

import { useEffect, useCallback, useState, type ReactNode } from "react";
import { cn } from "./utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Gérer l'ouverture/fermeture avec animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Petit délai pour que le DOM soit prêt avant l'animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Durée de l'animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fermer avec Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop - sans flou, juste un overlay sombre */}
      <div
        className={cn(
          "absolute inset-0 bg-black transition-opacity duration-300",
          isAnimating ? "opacity-50" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal content - slide up animation */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg transform transition-all duration-300 ease-out",
          "max-h-[90vh] overflow-auto rounded-t-2xl bg-keria-darker border border-keria-forest/30 shadow-2xl sm:rounded-2xl sm:m-4",
          isAnimating
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-8",
          className
        )}
      >
        {/* Barre de drag (mobile) */}
        <div className="sticky top-0 z-10 flex justify-center bg-keria-darker pt-3 pb-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-keria-forest" />
        </div>

        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-keria-forest/50 text-keria-muted transition-colors hover:bg-keria-forest hover:text-keria-cream"
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
