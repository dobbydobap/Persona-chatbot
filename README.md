# Scaler Persona Chat

A persona-based AI chatbot that lets you have real conversations with three Scaler / InterviewBit voices — **Anshuman Singh**, **Abhimanyu Saxena**, and **Kshitij Mishra**. Each persona has a distinct, hand-crafted system prompt — voice, values, few-shot examples, chain-of-thought reasoning, output constraints — so the bot doesn't just answer; it answers *like that person*.

Built for the Scaler Academy Prompt Engineering assignment.

> 🔗 **Live demo:** <https://persona-chatbot-alpha.vercel.app/>

---

## Screenshots

> _Add screenshots here after running locally — one per persona, plus a mobile shot._

```
public/screenshots/anshuman.png
public/screenshots/abhimanyu.png
public/screenshots/kshitij.png
public/screenshots/mobile.png
```

---

## What it does

- **Three personas** — Anshuman (technical, first-principles), Abhimanyu (career, mindset), Kshitij (DSA / system design teacher). Each is a distinct system prompt, not a re-skinned bot.
- **Persona switcher** with animated sliding pill (Framer Motion `layoutId`). Switching a persona resets that conversation and re-themes the entire UI to the persona's accent color.
- **Suggestion chips** specific to each persona, shown as the empty state.
- **Typing indicator** rendered as an assistant-style bubble.
- **Graceful error handling** — invalid keys, rate limits, safety blocks, and network failures all render an inline retry bubble. No browser alerts, no key leaks.
- **Mobile-first** — works at 375px width, sticky bottom input with safe-area padding, scroll-snap on the persona switcher.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [Tailwind CSS v4](https://tailwindcss.com) with CSS-variable theme tokens
- [Framer Motion](https://motion.dev) for the switcher pill, message bubble entries, and hero transitions
- [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai) — Gemini 2.0 Flash
- [Lucide](https://lucide.dev) icons, Inter + Sora fonts via `next/font`

## Project structure

```
app/
  api/chat/route.ts       POST /api/chat — calls Gemini with the active persona's system prompt
  layout.tsx              Root layout, fonts, viewport
  page.tsx                Main chat UI (state, fetch, persona accent application)
  globals.css             Theme tokens, persona-accent CSS vars, focus styles
components/
  PersonaSwitcher.tsx     Animated segmented control
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
prompts.md                All three system prompts annotated with rationale
reflection.md             300–500 word reflection on what worked, GIGO, what to improve
.env.example              GEMINI_API_KEY=
```

## Local setup

**Requirements:** Node.js 18.18+ (20+ recommended), npm.

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and paste your Gemini key
cp .env.example .env.local
# then edit .env.local and set GEMINI_API_KEY=...
# Get a free key at https://aistudio.google.com/app/apikey

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>. Switch between personas using the pills at the top. The active persona's accent color animates the entire UI.

### Other scripts

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # eslint
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. In **Environment Variables**, add `GEMINI_API_KEY` = your real key.
4. Click **Deploy**. Vercel auto-detects Next.js — no other config needed.
5. Once deployed, copy the live URL into the **Live demo** section of this README.

To redeploy, push to your default branch — Vercel rebuilds automatically.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Google AI Studio API key. Used server-side only, never exposed to the browser. |

The `.env.local` file is gitignored. The `.env.example` is committed as a template. **Never commit a real key.** If you accidentally do, rotate the key in AI Studio immediately.

## How the personas work

Each persona system prompt in `lib/prompts/*.ts` follows the same six-section structure:

1. **Identity** — who they are publicly
2. **Voice & values** — recurring themes and how they speak
3. **Chain-of-thought instruction** — silent step-by-step reasoning before replying
4. **Output format** — 4–6 sentences, conversational, ends with a follow-up question
5. **Few-shot examples** — at least 3 user / persona pairs with realistic content
6. **Constraints** — never break character, never fabricate quotes, never quote specific salary numbers, etc.

Read [`prompts.md`](./prompts.md) for the full prompts annotated with the rationale behind each section.

## Credits

Built by Varshitha · Scaler School of Technology (24bcs10271).

The personas are real public figures associated with Scaler / InterviewBit. The system prompts are written from publicly known facts and recurring themes from their public talks and posts; nothing in this project should be treated as a verified quote from any of them.
