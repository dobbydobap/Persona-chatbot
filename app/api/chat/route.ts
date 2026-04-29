import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPersona } from "@/lib/personas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  personaId?: string;
  messages?: ChatMessage[];
};

const MODEL_NAME = "gemini-2.0-flash";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_MESSAGES = 30;

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return badRequest("Could not parse request body.");
  }

  const personaId = body.personaId;
  const messages = body.messages;

  if (!personaId || typeof personaId !== "string") {
    return badRequest("Missing personaId.");
  }
  const persona = getPersona(personaId);
  if (!persona) {
    return badRequest("Unknown persona.");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return badRequest("Messages array is required and cannot be empty.");
  }
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"
    ) {
      return badRequest("Every message must have role 'user' or 'assistant' and string content.");
    }
    if (m.content.length > MAX_MESSAGE_LENGTH) {
      return badRequest(`Messages must be under ${MAX_MESSAGE_LENGTH} characters.`);
    }
  }

  const trimmed = messages.slice(-MAX_HISTORY_MESSAGES);
  const last = trimmed[trimmed.length - 1];
  if (last.role !== "user") {
    return badRequest("The last message must be from the user.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return serverError(
      "The server is missing its API key. Please contact the site owner.",
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: persona.systemPrompt,
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 600,
      },
    });

    const history = trimmed.slice(0, -1).map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(last.content);
    const reply = result.response.text();

    if (!reply || !reply.trim()) {
      return serverError(
        "The model returned an empty response. Please try rephrasing your question.",
      );
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err) {
    console.error("Gemini API error:", err);
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: unknown }).message ?? "")
        : "";
    if (message.toLowerCase().includes("api key")) {
      return serverError(
        "The server's API key was rejected. Please contact the site owner.",
      );
    }
    if (message.toLowerCase().includes("safety") || message.toLowerCase().includes("block")) {
      return serverError(
        "That message was blocked by the safety filter. Please rephrase and try again.",
      );
    }
    if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate")) {
      return serverError(
        "We've hit the API rate limit. Please wait a moment and try again.",
      );
    }
    return serverError(
      "Something went wrong reaching the AI. Please try again in a moment.",
    );
  }
}
