"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/personas";

export type MessageRole = "user" | "assistant" | "error";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

type Props = {
  message: Message;
  persona: Persona;
  onRetry?: () => void;
};

export function MessageBubble({ message, persona, onRetry }: Props) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <PersonaAvatar persona={persona} dim={isError} />
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-4 py-3 text-[15px] leading-[1.55] whitespace-pre-wrap break-words",
          isUser &&
            "bg-[var(--accent-soft)] text-text border border-[color:var(--accent)]/25 rounded-br-md",
          !isUser &&
            !isError &&
            "bg-surface text-text border border-border rounded-bl-md shadow-[0_1px_0_0_rgba(255,255,255,0.02)_inset]",
          isError &&
            "bg-red-500/8 text-red-200 border border-red-500/30 rounded-bl-md",
        )}
      >
        {message.content}

        {isError && onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-100 transition hover:bg-red-500/20"
          >
            Try again
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function PersonaAvatar({
  persona,
  dim = false,
  size = 36,
}: {
  persona: Persona;
  dim?: boolean;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold tracking-tight text-[13px]",
        dim && "opacity-60",
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${persona.accent.base}, ${persona.accent.strong})`,
        color: "#0b0b0f",
        boxShadow: `0 0 0 1px ${persona.accent.glow}, 0 6px 20px -8px ${persona.accent.glow}`,
      }}
    >
      {persona.initials}
    </div>
  );
}
