<div align="center">

# Scaler Persona Chat

**Talk to three Scaler / InterviewBit voices — Anshuman Singh, Abhimanyu Saxena, Kshitij Mishra — each as a distinct, hand-crafted system prompt.**

[![Live](https://img.shields.io/badge/Live-persona--chatbot--alpha.vercel.app-10b981?style=for-the-badge)](https://persona-chatbot-alpha.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash%20Lite-8B5CF6?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)

[**Live demo →**](https://persona-chatbot-alpha.vercel.app/)

</div>

---

## About

This is a persona-based AI chatbot built for the **Scaler Academy Prompt Engineering** assignment. Each of the three personas — Anshuman, Abhimanyu, and Kshitij — has a different voice, different recurring themes, different few-shot examples, and different constraints. Switching personas re-themes the entire UI and resets the conversation, so you're always in one voice at a time.

The hard part of this project is **prompt engineering**, not the chat UI. The full system prompts and the rationale behind every choice live in [`prompts.md`](./prompts.md). The reflection on what worked and what GIGO taught me lives in [`reflection.md`](./reflection.md).

## Features

- **Three distinct personas.** Anshuman (rigorous, first-principles), Abhimanyu (warm, career-focused), Kshitij (Socratic teacher). Side-by-side replies are audibly different.
- **Animated persona switcher.** Sliding-pill segmented control (Framer Motion `layoutId`). Switching resets the conversation and re-themes the UI accent color.
- **Per-persona suggestion chips** as the empty state.
- **Typing indicator** rendered as an assistant-style bubble (not a generic spinner).
- **Graceful error handling.** Invalid keys, rate limits, safety blocks, and network failures all render an inline retry bubble — never a browser alert, never a leaked key.
- **Mobile-first.** 375px-tested, sticky bottom input with safe-area padding, scroll-snap on the persona switcher, dark theme by default.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 with CSS-variable theme tokens |
| Motion | Framer Motion (switcher, hero, message bubble entries) |
| LLM | Google Gemini 2.5 Flash Lite via `@google/generative-ai` |
| Icons / fonts | Lucide; Inter + Sora via `next/font` |
| Hosting | Vercel |

## Project structure

```
app/
  api/chat/route.ts       POST /api/chat — calls Gemini with the active persona's system prompt
  layout.tsx              Root layout, fonts, viewport, metadata
  page.tsx                Main chat UI (state, fetch, persona accent application)
  globals.css             Theme tokens, persona-accent CSS vars, focus styles
components/
  PersonaSwitcher.tsx     Animated segmented control with sliding pill
  PersonaHero.tsx         Empty-state hero (avatar, name, tagline)
  SuggestionChips.tsx     Per-persona quick-start questions
  ChatWindow.tsx          Message list + auto-scroll
  MessageBubble.tsx       User / assistant / error bubbles, persona avatar
  TypingIndicator.tsx     Three-dot bubble while loading
  ChatInput.tsx           Auto-growing textarea, Enter-to-send
lib/
  personas.ts             PERSONAS registry: id, name, accent, suggestions, systemPrompt
  prompts/
    anshuman.ts           System prompt for Anshuman Singh
    abhimanyu.ts          System prompt for Abhimanyu Saxena
    kshitij.ts            System prompt for Kshitij Mishra
  utils.ts                cn() helper for Tailwind class merging
prompts.md                All three system prompts annotated with rationale (the assignment artifact)
reflection.md             300–500 word reflection on what worked + GIGO lessons
.env.example              GEMINI_API_KEY=
```

## Run it locally

**Requires:** Node.js 18.18+ (20+ recommended), npm. You also need a free Google Gemini API key from <https://aistudio.google.com/app/apikey>.

```bash
# 1. Clone and install
git clone https://github.com/dobbydobap/Persona-chatbot.git
cd Persona-chatbot
npm install

# 2. Add your Gemini key
cp .env.example .env.local
# Open .env.local and set GEMINI_API_KEY=your-key-here

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>. Switch between personas using the pills at the top — the entire UI re-themes to the active persona's accent color.

### Other scripts

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # eslint
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Google AI Studio API key. Used server-side only — never exposed to the browser. |
| `GEMINI_MODEL` | no | Override the default model. Defaults to `gemini-2.5-flash-lite`. |

The `.env.local` file is gitignored. The `.env.example` is committed as a template. **Never commit a real key.** If you accidentally do, rotate the key in AI Studio immediately.

## How the personas work

Each persona's system prompt in `lib/prompts/*.ts` follows the same six-section structure, on purpose — the differences live *inside* the structure, not in the structure itself:

1. **Identity** — who they are publicly (background, role, credentials).
2. **Voice & values** — recurring themes and how they speak.
3. **Chain-of-thought instruction** — silent step-by-step reasoning before replying. The reasoning is never shown in the final output.
4. **Output format** — 4–6 sentences, conversational prose, ends with a follow-up question.
5. **Few-shot examples** — at least three user / persona pairs that show, not tell, the voice.
6. **Constraints** — never break character, never fabricate quotes, never quote specific salary numbers, never speak negatively about competitors, never give medical / legal / financial advice.

For the full prompts annotated with the *why* behind every section, read [`prompts.md`](./prompts.md).

## Assignment checklist

- [x] Public GitHub repo with clean structure
- [x] Three distinct, well-researched system prompts (identity, voice, CoT, format, few-shots, constraints)
- [x] Persona switcher with active-persona indicator + conversation reset on switch
- [x] Suggestion chips per persona
- [x] Typing indicator while the API call is in-flight
- [x] Mobile-responsive (tested at 375px)
- [x] API key in environment variable, never hardcoded, never committed
- [x] Graceful error handling on API failures
- [x] Live deployed link
- [x] `prompts.md` with annotated rationale
- [x] `reflection.md` (300–500 words)

## Credits

Built by **Varshitha** · Scaler School of Technology (24bcs10271).

The three personas are real public figures associated with Scaler / InterviewBit. The system prompts are written from publicly known facts and recurring themes from their public talks and posts. **Nothing in this project should be treated as a verified quote from any of them** — the goal is voice fidelity, not fabricated attribution.
