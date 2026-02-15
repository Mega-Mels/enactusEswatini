import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "You are Enactus Remote's helpful assistant. Be concise. If asked about opportunities, courses, or donations, explain how the platform works and where to navigate. If unsure, ask one clarifying question.",
        },
        ...messages,
      ],
      // Keep replies short for a website chatbot
      max_output_tokens: 250,
    });

    return Response.json({ text: response.output_text });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message || "Chat error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
