"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PersonaAvatar } from "./MessageBubble";
import type { Persona } from "@/lib/personas";

export function PersonaHero({ persona }: { persona: Persona }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={persona.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 sm:p-8"
      >
        {/* Soft accent glow background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
          style={{ background: persona.accent.glow }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -bottom-16 size-48 rounded-full blur-3xl opacity-60"
          style={{ background: persona.accent.soft }}
        />

        <div className="relative flex items-start gap-4">
          <PersonaAvatar persona={persona} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider"
                style={{
                  color: persona.accent.base,
                  borderColor: `${persona.accent.base}55`,
                  background: persona.accent.soft,
                }}
              >
                <Sparkles className="size-3" />
                Persona
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-text sm:text-[28px]">
              {persona.name}
            </h1>
            <p className="mt-1 text-[13px] text-text-muted">{persona.title}</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-text-muted">
              {persona.tagline}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
