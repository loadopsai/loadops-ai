import OpenAI from "openai";
import { NextResponse } from "next/server";

// ── Config ────────────────────────────────────────────────────────────────────

const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_PROMPT_CHARS = 12_000; // guards against runaway token cost from a bad caller
const MAX_RETRIES = 2;

const SYSTEM_PROMPT =
  "You are a freight logistics AI. Always respond with ONLY a raw JSON object — no markdown, no backticks, no explanation, no preamble. Your entire response must be valid parseable JSON and nothing else.";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new HttpError(500, "AI service is not configured");
    }
    client = new OpenAI({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 });
  }
  return client;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripCodeFences(raw: string): string {
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

async function requestCompletion(openai: OpenAI, prompt: string, attempt = 1): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      response_format: { type: "json_object" }, // ask the API to enforce JSON, not just the prompt
    });

    const choice = completion.choices[0];

    if (choice?.finish_reason === "length") {
      // Truncated mid-JSON — this will fail to parse, so surface a clear cause.
      throw new HttpError(502, "AI response was cut off before completing. Try a shorter prompt.");
    }

    const raw = choice?.message?.content;
    if (!raw) {
      throw new HttpError(502, "AI returned an empty response.");
    }

    return raw;
  } catch (err) {
    if (err instanceof HttpError) throw err;

    const status = (err as { status?: number })?.status;

    // Retry once on rate limit / transient server errors, not on bad requests.
    if (attempt <= MAX_RETRIES && (status === 429 || (status && status >= 500))) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return requestCompletion(openai, prompt, attempt + 1);
    }

    if (status === 401 || status === 403) {
      throw new HttpError(500, "AI service authentication failed.");
    }
    if (status === 429) {
      throw new HttpError(429, "AI service is rate-limited. Please try again shortly.");
    }

    throw new HttpError(502, "AI generation failed.");
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const prompt = body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "`prompt` is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (prompt.length > MAX_PROMPT_CHARS) {
      return NextResponse.json(
        { error: `\`prompt\` is too long (max ${MAX_PROMPT_CHARS} characters)` },
        { status: 400 }
      );
    }

    const openai = getClient();
    const raw = await requestCompletion(openai, prompt);
    const clean = stripCodeFences(raw);

    // Validate it's parseable before sending to the client.
    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      throw new HttpError(502, "AI returned malformed JSON — try again.");
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new HttpError(502, "AI response was valid JSON but not the expected object shape.");
    }

    return NextResponse.json({ result: clean });

  } catch (err: unknown) {
    if (err instanceof HttpError) {
      console.error(`OPENAI ERROR [${err.status}]:`, err.message);
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error("OPENAI ERROR:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}