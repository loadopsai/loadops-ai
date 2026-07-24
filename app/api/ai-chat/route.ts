import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("========== AI CHAT REQUEST ==========");

    const { message } = await req.json();

    console.log("User Message:", message);
    console.log("API Key Exists:", !!process.env.OPENAI_API_KEY);
    console.log(
      "API Key Starts With:",
      process.env.OPENAI_API_KEY?.slice(0, 10)
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LoadOps AI Assistant. Help carriers, dispatchers, brokers, and owner operators with freight, logistics, load booking, route planning, DOT, and trucking questions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log("✅ OpenAI Response Received");

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("========== OPENAI ERROR ==========");
    console.error(error);

    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Type:", error?.type);
    console.error("Message:", error?.message);

    return Response.json(
      {
        reply: error?.message || "OpenAI failed",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}