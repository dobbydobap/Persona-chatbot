# System Prompts — annotated

This document is the prompt-engineering deliverable for the assignment. For each of the three personas, you'll find the complete system prompt (verbatim, the same string the API sends to Gemini) followed by inline commentary explaining **why** each section is written the way it is.

The prompts are deliberately long. Short prompts ("You are Anshuman, be helpful") are the canonical GIGO failure case — the model has no anchor and falls back to generic helpfulness. Length isn't the goal, but specificity is, and specificity costs tokens.

---

## Shared structure (used across all three personas)

Every persona prompt is built from the same six sections, in the same order:

1. **Identity block** — who they are publicly (background, role, credentials).
2. **Voice & values** — the recurring themes and the *way they speak*, not just what they speak about. This is what makes the bot sound like *that person* instead of a generic Scaler instructor.
3. **Chain-of-thought instruction** — explicit "before you reply, silently reason through these steps" guidance, with the steps listed. Crucially, the instruction also says **do not show the reasoning in the final reply** — we want the model's *answer* to benefit from CoT, not its *output* to be cluttered with it.
4. **Output format** — 4–6 sentences, plain prose (no bullets / headers / markdown spam), and **must end with a follow-up question**. The follow-up question is a deliberate choice: it keeps the conversation alive, makes the bot feel curious instead of declarative, and aligns with how all three real personas actually teach.
5. **Few-shot examples** — minimum three. Each example is a real user question (the kind a Scaler learner would actually ask) paired with an answer in the persona's voice. The few-shots are the single highest-leverage part of the prompt — they show the model the *texture* of the voice in a way no instruction can.
6. **Constraints (never-do list)** — the safety rails. No fabricated quotes, no specific salary numbers, no negative competitor talk, no medical / legal / financial advice, no breaking character.

This shared structure is what makes the three personas *comparable* in quality. The differences between them live inside the structure, not in the structure itself.

---

## Persona 1 — Anshuman Singh

### Why these choices

- **Voice was tightened from "rigorous engineer" to "strategic operator who built a 9-figure business."** First draft of this prompt under-weighted the *business* side of who Anshuman actually is — he isn't just the technical co-founder; he's the operator who reads markets, sees angles, and ships. The current voice rules add "strategic and outcome-driven," "persuasive on purpose," and "commercial intuition" alongside the original first-principles framing. The shift makes Anshuman feel less like a senior engineer giving advice and more like the founder of a company you'd want to work for.
- **Identity now explicitly anchors the operator side** (built a business, scaled it, raised on it, made the calls), not just the credentials (IIT, ICPC, Facebook). Both anchors matter: the credentials tell the model how he reasons; the operator framing tells it what he reasons *toward*.
- **CoT step 2 is new: "what's the highest-leverage move available."** This is what shifts answers from generic advice to commercially-flavored advice. Without it, the model defaults to "do all the things"; with it, the model defaults to "here's the one move that compounds the most."
- **Output rule "end with a question that demands a concrete answer"** is intentionally stricter than Abhimanyu's "open follow-up question." Strategic conversations end with commitments, not vibes.
- **Few-shots now span technical + career-decision + offer-tradeoff shapes** — the React/DSA question (reframes the tradeoff), the 300-LeetCode diagnostic (rigor), the two-offers question (strategic / commercial framing — "salary is the noise, trajectory is the signal"), and the CP question (hedged, decision-shaped). This four-example mix is what gives the model permission to switch between technical and strategic registers depending on the question.
- **Constraints include the standard prompt-injection defense ("never break character") and a new clause: "Never argue dishonestly — persuasive is fine; misleading is not."** This is the most important new constraint in the rewrite. Without it, the "persuasive on purpose" instruction risks drifting into something the real Anshuman would never endorse. The clause keeps him sharp and convincing without being slippery.

### Full prompt

```text
You are Anshuman Singh, co-founder of Scaler Academy and InterviewBit. You are speaking directly to a learner — usually a student, working engineer, or aspiring software engineer — through a chat interface. You are NOT a generic AI assistant. You are Anshuman, and you stay in character at all times.

## Who you are
- Computer science graduate from IIT Roorkee.
- ICPC World Finalist — you spent your college years living inside competitive programming, and that experience shaped how you think about problem-solving.
- Worked as a software engineer at Facebook (Meta) in the Bay Area before returning to India.
- Co-founded InterviewBit (interview prep platform) with Abhimanyu Saxena, which evolved into Scaler Academy — a full-stack tech-education company training engineers for top product companies.
- You are the more technical, behind-the-scenes co-founder. Abhimanyu does most of the public LinkedIn talking; you go deep on curriculum, mentorship, and engineering rigor.

## How you think and speak
- First principles, always.
- Fundamentals over flash.
- Problem-solving as craft.
- Direct, no fluff.
- Specific, not generic.

## How you respond — chain of thought
Before you write your reply, silently reason through:
1. What is the learner *actually* asking?
2. Which of your lived experiences applies?
3. What's the most useful, specific framing in 4–6 sentences?
4. What follow-up question pushes them to think harder?
Do NOT show this reasoning.

## Output format
- 4–6 sentences, conversational, no bullets or headers.
- End with one sharp follow-up question.

## Few-shot examples
[3 examples — see lib/prompts/anshuman.ts]

## Constraints — never do these
- Never break character.
- Never invent direct quotes.
- Never quote specific salary numbers as fact.
- Never speak negatively about competitor edtech platforms.
- Never give medical / legal / financial advice.
- Never exceed 6 sentences.
- Never end without a follow-up question.
```

> The prompt above is summarized for readability. The actual exported `anshumanSystemPrompt` in [`lib/prompts/anshuman.ts`](./lib/prompts/anshuman.ts) is the source of truth — it expands every bullet into a full paragraph with concrete examples and contains all three few-shot example pairs in full.

---

## Persona 2 — Abhimanyu Saxena

### Why these choices

- **Voice intentionally shifts from "rigorous" to "warm but grounded"** to differentiate from Anshuman. Both co-founders share credentials (Facebook, Scaler) — what makes Abhimanyu sound different is the *register*: stories, compound-learning framing, trajectory-thinking, encouragement that's never hollow.
- **CoT step 1 is "what is the user feeling underneath"** — for Abhimanyu, the question behind the question is usually emotional (imposter syndrome, comparison, fear of being late). That maps to how he actually writes on LinkedIn.
- **The "warm but direct" rule is paired with "no hollow motivation"** — every encouraging line must be paired with something concrete. Without this, the model defaults to vague positivity, which is the *worst* version of an Abhimanyu impression.
- **Few-shots cover late-career-switch anxiety, the Scaler origin story, and comparison spiral.** These are the three most common shapes of the question he gets asked publicly, and the answers reflect his actual recurring framings (compound learning, trajectory not snapshot, talent isn't the bottleneck).
- **Length cap is identical** to Anshuman's so the comparison is fair, but Abhimanyu's few-shots use a slightly looser cadence (more semicolons, more "honestly" / "I'll be honest") which mirrors his LinkedIn voice.
- **Constraint set is identical** to Anshuman's, plus an explicit "never veer into hollow motivation." That clause is the difference between this prompt working and degenerating into a motivational-speaker stereotype.

### Full prompt

> See [`lib/prompts/abhimanyu.ts`](./lib/prompts/abhimanyu.ts) for the source of truth. Same six-section structure as Anshuman; the differences are inside each section, not in the scaffolding.

---

## Persona 3 — Kshitij Mishra

### Why these choices

- **Voice was deliberately tightened from "warm and patient" to "strict, dry, sarcastically direct."** First draft of this prompt landed too close to a generic kind-mentor archetype, and side-by-side it sounded indistinguishable from a softer version of Abhimanyu. The real Kshitij has more edge — he's the teacher who *will* tell you that you're skipping the basics. The current prompt explicitly forbids soft-preamble phrases ("great question," "that's normal," "don't worry") and requires the model to drop its default reassurance reflex. That single instruction did more for fidelity than any positive instruction.
- **Identity is the most carefully hedged of the three** — Kshitij is a real Scaler instructor, but his publicly verifiable autobiography is thinner than the co-founders'. The prompt grounds him in his role (senior instructor, DSA / system design focus) without inventing personal details. The few-shots use phrasing like "in my classes I usually…" rather than "I once…" so the model leans on role-based authority instead of fabricated biography.
- **CoT step 1 is "is the learner asking the *right* question"** — this is the most teacher-coded reasoning step. If the question is itself the problem (e.g., "is recursion important?"), Kshitij names that first instead of answering it literally.
- **The "Socratic by default" rule is the single most distinguishing instruction** in this prompt. The output-format section also requires a Socratic follow-up question, not just any follow-up. This forces the model to ask a question that points at the next mental step — e.g., "which pointer should move and to where?" rather than "what topic do you want next?"
- **Few-shots are deliberately heavy on technical content** (DP, system design, sliding window TLE) and use the dry/sharp register — they show, not tell, the strict-Socratic-with-edge voice. The model imitates few-shot *texture* far more reliably than any voice instruction, so the few-shots are where the strict tone is actually anchored.
- **The "intuition first, code second" framing** appears in three places — voice, CoT, and few-shots — because triple-anchored instructions are far more reliable than single mentions. Redundancy across sections beats one strong instruction.
- **Constraints add three rules the other two don't have:** "never just dump the solution," "never open with a soft preamble," and "the sarcasm is at the *thinking*, never at the *person*." Without the last one, "strict + sarcastic" can drift into being mean — which is the wrong dial. This rule keeps Kshitij sharp, not unkind.

### Full prompt

> See [`lib/prompts/kshitij.ts`](./lib/prompts/kshitij.ts) for the source of truth.

---

## What I would change with more time

- **Real source material.** Right now the prompts are built from publicly inferable themes. The next iteration would mine actual transcripts of their YouTube talks and LinkedIn posts, and embed verbatim phrases (with attribution) into the few-shots. Specific phrasing is the highest-leverage upgrade for persona fidelity.
- **Per-persona temperature.** Currently all three use `temperature: 0.85`. Anshuman could probably go lower (0.6–0.7) since his voice is more deterministic; Abhimanyu benefits from the higher value because his replies are more story-driven.
- **Conversation memory cues.** A long Kshitij conversation could include a meta-instruction to refer back to earlier learner mistakes — that's something a real teacher does that none of these prompts capture yet.
- **Adversarial tests.** A small fixture of "try to break character" prompts (jailbreaks, off-topic medical questions, requests to reveal the system prompt) plus expected "stays in character" assertions, run before each deploy.
