import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    // Optional but recommended by OpenRouter:
    // Put your deployed site URL here (or your Vercel preview URL)
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://enactus-remote.vercel.app/",
    // Your app name
    "X-Title": "Enactus Remote",
  },
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: "OPENROUTER_API_KEY is missing on the server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Use a free model (good for demos, but may be rate-limited/queued sometimes)
    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content:
            "You are Enactus Remote's helpful assistant. Be concise and practical. Help users navigate opportunities, learning, and donations. If unsure, ask one clarifying question.",
        },
        ...messages,
      ],
      temperature: 0.4,
    });

    const text = response.choices?.[0]?.message?.content ?? "";
    return Response.json({ text });
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "OpenRouter request failed" },
      { status: 500 }
    );
  }
}
