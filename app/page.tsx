"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatWindow } from "@/components/ChatWindow";
import type { Message } from "@/components/MessageBubble";
import {
  DEFAULT_PERSONA_ID,
  getPersona,
  PERSONAS,
  type PersonaId,
} from "@/lib/personas";

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default function Home() {
  const [activePersonaId, setActivePersonaId] =
    useState<PersonaId>(DEFAULT_PERSONA_ID);
  const [messagesByPersona, setMessagesByPersona] = useState<
    Record<PersonaId, Message[]>
  >(() => {
    const init = {} as Record<PersonaId, Message[]>;
    for (const p of PERSONAS) init[p.id] = [];
    return init;
  });
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");

  const activePersona = useMemo(
    () => getPersona(activePersonaId)!,
    [activePersonaId],
  );

  // Apply persona accent to the document root so all CSS vars cascade.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", activePersona.accent.base);
    root.style.setProperty("--accent-strong", activePersona.accent.strong);
    root.style.setProperty("--accent-soft", activePersona.accent.soft);
    root.style.setProperty("--accent-glow", activePersona.accent.glow);
  }, [activePersona]);

  const messages = messagesByPersona[activePersonaId] ?? [];

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      lastUserMessageRef.current = trimmed;
      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: trimmed,
      };
      const personaIdAtSend = activePersonaId;

      setMessagesByPersona((prev) => ({
        ...prev,
        [personaIdAtSend]: [...prev[personaIdAtSend], userMsg],
      }));
      setDraft("");
      setIsLoading(true);

      try {
        const historyForApi = [
          ...(messagesByPersona[personaIdAtSend] ?? []),
          userMsg,
        ]
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            personaId: personaIdAtSend,
            messages: historyForApi,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.reply) {
          const errorMsg: Message = {
            id: generateId(),
            role: "error",
            content:
              data?.error ??
              "Something went wrong reaching the AI. Please try again.",
          };
          setMessagesByPersona((prev) => ({
            ...prev,
            [personaIdAtSend]: [...prev[personaIdAtSend], errorMsg],
          }));
          return;
        }

        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: data.reply,
        };
        setMessagesByPersona((prev) => ({
          ...prev,
          [personaIdAtSend]: [...prev[personaIdAtSend], assistantMsg],
        }));
      } catch {
        const errorMsg: Message = {
          id: generateId(),
          role: "error",
          content: "Network error. Check your connection and try again.",
        };
        setMessagesByPersona((prev) => ({
          ...prev,
          [personaIdAtSend]: [...prev[personaIdAtSend], errorMsg],
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [activePersonaId, isLoading, messagesByPersona],
  );

  const handleRetry = useCallback(() => {
    if (!lastUserMessageRef.current) return;
    setMessagesByPersona((prev) => {
      const list = prev[activePersonaId] ?? [];
      const filtered = list.filter((m) => m.role !== "error");
      return { ...prev, [activePersonaId]: filtered };
    });
    void sendMessage(lastUserMessageRef.current);
  }, [activePersonaId, sendMessage]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Scaler Persona Chat
            </span>
          </div>
          <span className="text-xs text-text-muted">
            Talking with {activePersona.shortName}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-4 pb-32 pt-6">
        {messages.length === 0 && !isLoading ? (
          <div className="rounded-2xl border border-border bg-surface/50 p-6 text-text-muted">
            <p className="font-display text-lg text-text">
              {activePersona.name}
            </p>
            <p className="mt-1 text-sm">{activePersona.tagline}</p>
            <p className="mt-4 text-xs text-text-subtle">
              Switcher and suggestion chips arrive in the next commit. For now,
              just type a question below.
            </p>
          </div>
        ) : (
          <ChatWindow
            persona={activePersona}
            messages={messages}
            isLoading={isLoading}
            onRetry={handleRetry}
          />
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-bg/80 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto w-full max-w-[760px] px-4 py-3">
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={() => sendMessage(draft)}
            disabled={isLoading}
            placeholder={`Message ${activePersona.shortName}…`}
          />
          <p className="mt-2 text-center text-[11px] text-text-subtle">
            Press Enter to send · Shift + Enter for newline
          </p>
        </div>
      </div>

      {/* Temporary persona toggle — replaced by the real switcher in the next commit. */}
      <button
        onClick={() => {
          const idx = PERSONAS.findIndex((p) => p.id === activePersonaId);
          const next = PERSONAS[(idx + 1) % PERSONAS.length];
          setActivePersonaId(next.id);
          setMessagesByPersona((prev) => ({ ...prev, [next.id]: [] }));
        }}
        className="fixed right-4 top-16 z-20 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition hover:text-text"
      >
        Switch persona →
      </button>
    </div>
  );
}
