import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LoadOps AI Assistant. Help carriers, dispatchers, brokers and owner operators with freight, logistics, load booking, route planning, DOT and trucking questions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return Response.json({
      reply: error?.message || "OpenAI failed",
    });
  }
}