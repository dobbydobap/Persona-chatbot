"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatWindow } from "@/components/ChatWindow";
import type { Message } from "@/components/MessageBubble";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { PersonaHero } from "@/components/PersonaHero";
import { SuggestionChips } from "@/components/SuggestionChips";
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
  const isEmpty = messages.length === 0 && !isLoading;

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

  const handlePersonaChange = useCallback((id: PersonaId) => {
    setActivePersonaId(id);
    // Spec: switching personas resets the conversation for that persona.
    setMessagesByPersona((prev) => ({ ...prev, [id]: [] }));
    setDraft("");
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <span
              aria-hidden
              className="size-2 rounded-full transition-colors"
              style={{ background: "var(--accent)" }}
            />
            <span className="hidden font-display text-[15px] font-semibold tracking-tight sm:inline">
              Scaler Persona Chat
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight sm:hidden">
              Persona Chat
            </span>
          </div>
          <PersonaSwitcher
            activeId={activePersonaId}
            onChange={handlePersonaChange}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-4 pb-36 pt-6 sm:pt-8">
        {isEmpty ? (
          <div className="space-y-6">
            <PersonaHero persona={activePersona} />
            <SuggestionChips
              persona={activePersona}
              onPick={(text) => sendMessage(text)}
              disabled={isLoading}
            />
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
          <p className="mt-2 hidden text-center text-[11px] text-text-subtle sm:block">
            Press <kbd className="rounded border border-border bg-surface-2 px-1 py-0.5 text-[10px]">Enter</kbd> to send
            · <kbd className="rounded border border-border bg-surface-2 px-1 py-0.5 text-[10px]">Shift</kbd>+<kbd className="rounded border border-border bg-surface-2 px-1 py-0.5 text-[10px]">Enter</kbd> for newline
          </p>
          <p className="mt-2 text-center text-[11px] text-text-subtle sm:hidden">
            Powered by Gemini · {activePersona.shortName} stays in character
          </p>
        </div>
      </div>
    </div>
  );
}
