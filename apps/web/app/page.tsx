"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-keria-darker">
      {/* Background image with heavy blur */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) brightness(0.25) saturate(0.7)",
          transform: "scale(1.2)",
        }}
      />

      {/* Animated gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] animate-gradient-shift opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(198, 168, 124, 0.1) 0%, transparent 40%, rgba(61, 68, 53, 0.15) 70%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Heavy grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />

      {/* Abstract location pins - decorative with floating animation */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Pin 1 */}
        <motion.div
          className="absolute left-[15%] top-[20%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-4 w-4 rounded-full border-2 border-keria-gold" />
            <div className="mx-auto h-8 w-px bg-gradient-to-b from-keria-gold to-transparent" />
          </motion.div>
        </motion.div>

        {/* Pin 2 */}
        <motion.div
          className="absolute right-[20%] top-[35%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="h-3 w-3 rounded-full border border-keria-cream" />
            <div className="mx-auto h-6 w-px bg-gradient-to-b from-keria-cream to-transparent" />
          </motion.div>
        </motion.div>

        {/* Pin 3 */}
        <motion.div
          className="absolute bottom-[30%] left-[25%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="h-5 w-5 rounded-full border border-keria-muted" />
            <div className="mx-auto h-10 w-px bg-gradient-to-b from-keria-muted to-transparent" />
          </motion.div>
        </motion.div>

        {/* Connection lines between pins */}
        <svg className="absolute inset-0 h-full w-full">
          <motion.line
            x1="15%"
            y1="25%"
            x2="50%"
            y2="50%"
            stroke="rgba(198, 168, 124, 0.08)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.2, duration: 1.5 }}
          />
          <motion.line
            x1="80%"
            y1="38%"
            x2="50%"
            y2="50%"
            stroke="rgba(198, 168, 124, 0.08)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.4, duration: 1.5 }}
          />
          <motion.line
            x1="25%"
            y1="72%"
            x2="50%"
            y2="50%"
            stroke="rgba(198, 168, 124, 0.08)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.6, duration: 1.5 }}
          />
          {/* Center point */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="6"
            fill="rgba(198, 168, 124, 0.15)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.8, duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Top decorative line */}
        <motion.div
          className="absolute left-1/2 top-12 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-keria-gold/50 to-keria-gold"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />

        {/* Main content */}
        <div className="text-center">
          {/* Pre-title */}
          <motion.p
            className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em] text-keria-muted/70"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Trouvez votre
          </motion.p>

          {/* MASSIVE title with gold glow */}
          <div className="relative">
            {/* Gold glow behind title */}
            <div
              className="pointer-events-none absolute inset-0 -inset-x-20 -inset-y-10"
              style={{
                background: "radial-gradient(ellipse at center, rgba(198, 168, 124, 0.08) 0%, transparent 70%)",
              }}
            />
            <motion.h1
              className="relative font-display text-[clamp(6rem,25vw,18rem)] font-bold leading-[0.8] tracking-[-0.04em] text-keria-cream"
              initial={{ opacity: 0, y: 60, filter: "blur(30px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.4,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              KERIA
            </motion.h1>
          </div>

          {/* Accent line */}
          <motion.div
            className="mx-auto my-8 h-[2px] bg-gradient-to-r from-transparent via-keria-gold to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />

          {/* Tagline */}
          <motion.p
            className="text-lg tracking-wide text-keria-cream/90 sm:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Point de rencontre
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/new"
                className="inline-block min-w-[200px] border border-keria-gold bg-keria-gold px-8 py-4 text-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-keria-darker transition-all hover:bg-keria-gold-light"
              >
                MeetPoint
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/event/new"
                className="inline-block min-w-[200px] border border-white/10 bg-white/5 px-8 py-4 text-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-keria-cream/80 backdrop-blur-md transition-all hover:border-keria-gold/50 hover:text-keria-gold"
              >
                Événement
              </Link>
            </motion.div>
          </motion.div>

          {/* Secondary links */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <Link
              href="/join"
              className="text-[10px] uppercase tracking-[0.25em] text-keria-muted/80 transition-colors hover:text-keria-gold"
            >
              Rejoindre
            </Link>
            <div className="h-3 w-px bg-keria-forest/30" />
            <Link
              href="/join-event"
              className="text-[10px] uppercase tracking-[0.25em] text-keria-muted/80 transition-colors hover:text-keria-gold"
            >
              Code événement
            </Link>
          </motion.div>
        </div>

        {/* Bottom scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-8 w-px bg-gradient-to-b from-keria-gold/40 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Corner elements */}
        <motion.div
          className="absolute left-6 top-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-keria-gold/40" />
            <span className="font-mono text-[10px] text-keria-muted/70">
              48.8566° N
            </span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-6 right-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-keria-muted/70">
              2.3522° E
            </span>
            <div className="h-2 w-2 rounded-full bg-keria-gold/40" />
          </div>
        </motion.div>

        <motion.span
          className="absolute right-6 top-6 font-mono text-[10px] text-keria-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          2026
        </motion.span>
      </div>

      {/* Features section */}
      <section className="relative z-20 border-t border-keria-forest/10 px-6 py-32">
        <div className="mx-auto max-w-4xl">
          {/* Section title */}
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl font-bold tracking-tight text-keria-cream sm:text-6xl lg:text-7xl">
              L'équité
              <br />
              <span className="text-keria-muted/80">avant tout</span>
            </h2>
          </motion.div>

          {/* Features with icons and stagger */}
          <motion.div
            className="grid gap-16 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <Feature
              icon={
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              }
              title="Calculez"
              description="Un point optimal pour tous"
            />
            <Feature
              icon={
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              }
              title="Partagez"
              description="Un code, plusieurs amis"
            />
            <Feature
              icon={
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              }
              title="Retrouvez"
              description="Le lieu parfait vous attend"
            />
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 px-6 py-32">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Big decorative text */}
          <span className="block font-display text-[clamp(5rem,20vw,12rem)] font-bold leading-none tracking-tighter text-keria-forest/20">
            GO
          </span>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8 inline-block">
            <Link
              href="/new"
              className="inline-block border border-keria-gold bg-keria-gold px-16 py-5 font-display text-xs font-semibold uppercase tracking-[0.25em] text-keria-darker transition-all hover:bg-keria-gold-light"
            >
              Commencer
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 px-6 pb-8 pt-0">
        {/* Gold separator line */}
        <div className="mx-auto mb-8 h-px max-w-4xl bg-gradient-to-r from-transparent via-keria-gold/30 to-transparent" />

        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-display text-sm font-bold text-keria-cream/70">
            KERIA
          </span>

          {/* Social icons placeholder */}
          <div className="flex items-center gap-4">
            <svg className="h-4 w-4 text-keria-muted transition-colors hover:text-keria-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
            <svg className="h-4 w-4 text-keria-muted transition-colors hover:text-keria-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <svg className="h-4 w-4 text-keria-muted transition-colors hover:text-keria-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
            </svg>
          </div>

          <span className="font-mono text-[10px] text-keria-muted">
            © 2026
          </span>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="text-center"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-keria-gold/60">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-2xl font-bold text-keria-cream">
        {title}
      </h3>
      <p className="text-sm text-keria-muted/70">{description}</p>

      {/* Mobile separator */}
      <div className="mx-auto mt-8 h-px w-16 bg-keria-gold/20 sm:hidden" />
    </motion.div>
  );
}
