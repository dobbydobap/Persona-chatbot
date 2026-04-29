"use client";

import { motion } from "framer-motion";
import { PersonaAvatar } from "./MessageBubble";
import type { Persona } from "@/lib/personas";

export function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex w-full gap-3 justify-start"
      role="status"
      aria-live="polite"
      aria-label={`${persona.shortName} is typing`}
    >
      <PersonaAvatar persona={persona} />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-4">
        <span
          className="typing-dot inline-block size-1.5 rounded-full"
          style={{ background: "var(--accent)", animationDelay: "0ms" }}
        />
        <span
          className="typing-dot inline-block size-1.5 rounded-full"
          style={{ background: "var(--accent)", animationDelay: "180ms" }}
        />
        <span
          className="typing-dot inline-block size-1.5 rounded-full"
          style={{ background: "var(--accent)", animationDelay: "360ms" }}
        />
      </div>
    </motion.div>
  );
}
