"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/new", label: "Nouveau MeetPoint" },
  { href: "/join", label: "Rejoindre" },
  { href: "/event/new", label: "Nouvel Événement" },
  { href: "/join-event", label: "Rejoindre Événement" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isHomepage = pathname === "/";

  return (
    <>
      {/* Fixed corner navigation button */}
      {!isHomepage && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed right-6 top-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-keria-forest/30 bg-keria-darker/90 backdrop-blur-md transition-all hover:ring-1 hover:ring-keria-gold/30"
          aria-label="Menu"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <motion.span
              className="block h-0.5 w-5 bg-keria-cream"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-5 bg-keria-cream"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-5 bg-keria-cream"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.button>
      )}

      {/* Full-screen nav overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-keria-darker/95 backdrop-blur-lg"
          >
            {/* Close on backdrop click */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
            />

            <motion.ul
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
                exit: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
              className="relative z-10 space-y-6 text-center"
            >
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative inline-flex items-center gap-4 font-display text-2xl font-bold transition-colors sm:text-3xl lg:text-4xl ${
                      pathname === link.href
                        ? "text-keria-gold"
                        : "text-keria-cream hover:text-keria-gold"
                    }`}
                  >
                    {/* Editorial number */}
                    <span className="font-mono text-xs text-keria-gold/60">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    {link.label}
                    {/* Underline effect */}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-keria-gold transition-all duration-300 ${
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* Decorative elements */}
            <motion.span
              className="absolute bottom-8 left-8 font-mono text-xs uppercase tracking-widest text-keria-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Navigation
            </motion.span>
            <motion.span
              className="absolute bottom-8 right-8 font-mono text-xs text-keria-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              2026
            </motion.span>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
