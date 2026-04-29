"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Persona } from "@/lib/personas";

type Props = {
  persona: Persona;
  onPick: (text: string) => void;
  disabled?: boolean;
};

export function SuggestionChips({ persona, onPick, disabled }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-text-subtle">
        Try one of these
      </p>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
        }}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {persona.suggestions.map((s) => (
          <motion.li
            key={s}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
            }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(s)}
              className="group flex w-full items-start gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 hover:border-[color:var(--accent)]/40 hover:bg-surface"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:scale-110">
                <ArrowUpRight className="size-3" strokeWidth={2.5} />
              </span>
              <span className="text-[13.5px] leading-[1.45] text-text-muted group-hover:text-text">
                {s}
              </span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
