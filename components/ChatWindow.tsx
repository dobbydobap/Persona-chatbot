"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble, type Message } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Persona } from "@/lib/personas";

type Props = {
  persona: Persona;
  messages: Message[];
  isLoading: boolean;
  onRetry?: () => void;
};

export function ChatWindow({ persona, messages, isLoading, onRetry }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  return (
    <div className="flex flex-col gap-4 px-1">
      <AnimatePresence initial={false} mode="popLayout">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            persona={persona}
            onRetry={m.role === "error" ? onRetry : undefined}
          />
        ))}
        {isLoading && <TypingIndicator key="typing" persona={persona} />}
      </AnimatePresence>
      <div ref={bottomRef} aria-hidden className="h-1" />
    </div>
  );
}
