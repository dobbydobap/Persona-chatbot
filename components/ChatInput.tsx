"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Ask anything…",
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = 180;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit();
      }}
      className={cn(
        "group relative flex items-end gap-2 rounded-[20px] border border-border bg-surface/80 backdrop-blur",
        "px-3 py-2.5 transition-colors",
        "focus-within:border-[color:var(--accent)]/50",
        "focus-within:shadow-[0_0_0_4px_var(--accent-soft)]",
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 resize-none bg-transparent text-[15px] leading-[1.5] text-text placeholder:text-text-subtle",
          "py-1.5 px-1 outline-none",
          "max-h-[180px] overflow-y-auto scroll-area",
        )}
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition",
          canSend
            ? "bg-[var(--accent)] text-[#0b0b0f] hover:brightness-110 hover:scale-[1.04] active:scale-95"
            : "bg-surface-2 text-text-subtle cursor-not-allowed",
        )}
      >
        <ArrowUp className="size-4" strokeWidth={2.5} />
      </button>
    </form>
  );
}
