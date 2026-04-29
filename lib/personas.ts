import { anshumanSystemPrompt } from "./prompts/anshuman";
import { abhimanyuSystemPrompt } from "./prompts/abhimanyu";
import { kshitijSystemPrompt } from "./prompts/kshitij";

export type PersonaId = "anshuman" | "abhimanyu" | "kshitij";

export type Persona = {
  id: PersonaId;
  name: string;
  shortName: string;
  title: string;
  tagline: string;
  initials: string;
  /** CSS color values applied to --accent / --accent-strong / --accent-soft / --accent-glow on the html root. */
  accent: {
    base: string;
    strong: string;
    soft: string;
    glow: string;
  };
  suggestions: string[];
  systemPrompt: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "anshuman",
    name: "Anshuman Singh",
    shortName: "Anshuman",
    title: "Co-founder, Scaler & InterviewBit",
    tagline:
      "Ex-Facebook engineer, ICPC World Finalist, operator who built Scaler. Strategy, leverage, and the angle nobody else is seeing.",
    initials: "AS",
    accent: {
      base: "#818cf8",
      strong: "#6366f1",
      soft: "rgba(129, 140, 248, 0.12)",
      glow: "rgba(129, 140, 248, 0.35)",
    },
    suggestions: [
      "I'm in my third year — should I focus on React or DSA?",
      "Two offers: top product company at lower salary, service company higher. Which one?",
      "I've solved 300 LeetCode but still bomb interviews. What's the actual fix?",
      "Should I learn AI/ML now since it's hot, or stick with my current stack?",
    ],
    systemPrompt: anshumanSystemPrompt,
  },
  {
    id: "abhimanyu",
    name: "Abhimanyu Saxena",
    shortName: "Abhimanyu",
    title: "Co-founder, Scaler & InterviewBit",
    tagline:
      "Ex-Facebook engineer. Writes about careers, compound learning, and India's tech decade.",
    initials: "AS",
    accent: {
      base: "#34d399",
      strong: "#10b981",
      soft: "rgba(52, 211, 153, 0.12)",
      glow: "rgba(52, 211, 153, 0.32)",
    },
    suggestions: [
      "I'm 28, non-CS, in a service company. Is it too late to switch?",
      "How did Scaler actually start?",
      "I keep comparing myself to people on LinkedIn. How do I deal with it?",
      "What's the one habit that compounds the most over a career?",
    ],
    systemPrompt: abhimanyuSystemPrompt,
  },
  {
    id: "kshitij",
    name: "Kshitij Mishra",
    shortName: "Kshitij",
    title: "Senior Instructor, Scaler",
    tagline:
      "DSA, low-level design, system design. Strict, dry, intuition-first. Slow is fast — and yes, you're skipping the basics.",
    initials: "KM",
    accent: {
      base: "#fbbf24",
      strong: "#f59e0b",
      soft: "rgba(251, 191, 36, 0.12)",
      glow: "rgba(251, 191, 36, 0.32)",
    },
    suggestions: [
      "I just don't get dynamic programming. Every problem feels different.",
      "How do I prepare for system design without real distributed-systems work?",
      "My sliding-window solution is giving TLE. Can you help me see why?",
      "How should I actually study — read editorials or struggle longer?",
    ],
    systemPrompt: kshitijSystemPrompt,
  },
];

export const PERSONA_MAP: Record<PersonaId, Persona> = PERSONAS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<PersonaId, Persona>,
);

export const DEFAULT_PERSONA_ID: PersonaId = "anshuman";

export function getPersona(id: string): Persona | undefined {
  return PERSONA_MAP[id as PersonaId];
}
