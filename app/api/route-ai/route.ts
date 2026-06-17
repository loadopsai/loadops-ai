import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });

  } catch (error: any) {
  console.error("OPENAI ERROR:", error);

  return NextResponse.json(
    {
      error: error?.message || "AI generation failed",
    },
    { status: 500 }
  );
}
}