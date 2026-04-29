"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PERSONAS, type PersonaId } from "@/lib/personas";

type Props = {
  activeId: PersonaId;
  onChange: (id: PersonaId) => void;
};

export function PersonaSwitcher({ activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Choose a persona"
      className={cn(
        "relative flex items-center gap-1 rounded-full border border-border bg-surface/70 p-1 backdrop-blur",
        "overflow-x-auto scroll-area scroll-snap-x",
      )}
      style={{ scrollSnapType: "x mandatory" }}
    >
      {PERSONAS.map((p) => {
        const isActive = p.id === activeId;
        return (
          <button
            key={p.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(p.id)}
            className={cn(
              "relative z-10 shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
              "snap-start outline-none",
              isActive ? "text-[#0b0b0f]" : "text-text-muted hover:text-text",
            )}
            style={{ scrollSnapAlign: "start" }}
          >
            {isActive && (
              <motion.span
                layoutId="persona-pill"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                style={{
                  background: `linear-gradient(135deg, ${p.accent.base}, ${p.accent.strong})`,
                  boxShadow: `0 4px 18px -6px ${p.accent.glow}`,
                }}
              />
            )}
            <span className="relative">{p.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
