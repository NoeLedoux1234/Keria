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

      {/* Heavy grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.15]"
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

      {/* Abstract location pins - decorative */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Pin 1 */}
        <motion.div
          className="absolute left-[15%] top-[20%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="h-4 w-4 rounded-full border-2 border-keria-gold" />
          <div className="mx-auto h-8 w-px bg-gradient-to-b from-keria-gold to-transparent" />
        </motion.div>

        {/* Pin 2 */}
        <motion.div
          className="absolute right-[20%] top-[35%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
        >
          <div className="h-3 w-3 rounded-full border border-keria-cream" />
          <div className="mx-auto h-6 w-px bg-gradient-to-b from-keria-cream to-transparent" />
        </motion.div>

        {/* Pin 3 */}
        <motion.div
          className="absolute bottom-[30%] left-[25%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <div className="h-5 w-5 rounded-full border border-keria-muted" />
          <div className="mx-auto h-10 w-px bg-gradient-to-b from-keria-muted to-transparent" />
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

          {/* MASSIVE title */}
          <motion.h1
            className="font-display text-[clamp(6rem,25vw,18rem)] font-bold leading-[0.8] tracking-[-0.04em] text-keria-cream"
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
            <Link href="/new">
              <motion.button
                className="min-w-[200px] border border-keria-gold bg-keria-gold px-8 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-keria-darker transition-all hover:bg-keria-gold-light"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                MeetPoint
              </motion.button>
            </Link>
            <Link href="/event/new">
              <motion.button
                className="min-w-[200px] border border-keria-cream/20 bg-transparent px-8 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-keria-cream/80 backdrop-blur-sm transition-all hover:border-keria-gold/50 hover:text-keria-gold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Événement
              </motion.button>
            </Link>
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
              className="text-[10px] uppercase tracking-[0.25em] text-keria-muted/50 transition-colors hover:text-keria-gold"
            >
              Rejoindre
            </Link>
            <div className="h-3 w-px bg-keria-forest/30" />
            <Link
              href="/join-event"
              className="text-[10px] uppercase tracking-[0.25em] text-keria-muted/50 transition-colors hover:text-keria-gold"
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
            <span className="font-mono text-[10px] text-keria-muted/40">
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
            <span className="font-mono text-[10px] text-keria-muted/40">
              2.3522° E
            </span>
            <div className="h-2 w-2 rounded-full bg-keria-gold/40" />
          </div>
        </motion.div>

        <motion.span
          className="absolute right-6 top-6 font-mono text-[10px] text-keria-muted/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          2026
        </motion.span>
      </div>

      {/* Features section - minimal */}
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
              <span className="text-keria-muted/50">avant tout</span>
            </h2>
          </motion.div>

          {/* Minimal features */}
          <div className="grid gap-16 sm:grid-cols-3">
            <Feature
              number="01"
              title="Calculez"
              description="Un point optimal pour tous"
            />
            <Feature
              number="02"
              title="Partagez"
              description="Un code, plusieurs amis"
            />
            <Feature
              number="03"
              title="Retrouvez"
              description="Le lieu parfait vous attend"
            />
          </div>
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

          <Link href="/new">
            <motion.button
              className="mt-8 border border-keria-gold bg-keria-gold px-16 py-5 font-display text-xs font-semibold uppercase tracking-[0.25em] text-keria-darker transition-all hover:bg-keria-gold-light"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Commencer
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Minimal footer */}
      <footer className="relative z-20 border-t border-keria-forest/10 px-6 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-display text-sm font-bold text-keria-cream/50">
            KERIA
          </span>
          <span className="font-mono text-[10px] text-keria-muted/30">
            © 2026
          </span>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <span className="mb-4 block font-mono text-[10px] text-keria-gold/40">
        {number}
      </span>
      <h3 className="mb-2 font-display text-2xl font-bold text-keria-cream">
        {title}
      </h3>
      <p className="text-sm text-keria-muted/70">{description}</p>
    </motion.div>
  );
}
