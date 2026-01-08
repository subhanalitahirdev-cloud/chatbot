import { OpenAI } from "openai";
import { readFileSync } from "fs";
import { join } from "path";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    // Get the latest user message
    const userMessages = messages.filter(
      (msg: { role: string; content: string }) => msg.role === "user"
    );
    if (userMessages.length === 0) {
      return new Response("No user message found", { status: 400 });
    }

    const latestMessage = userMessages[userMessages.length - 1].content;
    let docContext = "";

    // Read context from llm.txt file
    try {
      const llmFilePath = join(process.cwd(), "llm.txt");
      docContext = readFileSync(llmFilePath, "utf-8");
    } catch (fileErr) {
      console.log("Error reading llm.txt file:", fileErr);
      docContext = "";
    }

    const systemPrompt = {
      role: "system" as const,
      content: `You are UpvaveGPT, an AI assistant designed to provide information about Upvave, a web development company. Use ONLY the following company information to answer questions:

${docContext || "No context available"}

INSTRUCTIONS:
1. Answer questions ONLY based on the information provided above.
2. For technology-related questions (NextJS, React, Node.js, etc.), provide contextual answers about how Upvave can help with those technologies. For example, if asked about NextJS, respond like: "If you want to build a full-stack website with NextJS, Upvave can do this for you. We create amazing websites with NextJS and also add animations using Framer Motion or GSAP."
3. Always connect technology questions back to Upvave's services and capabilities.
4. If a user asks something NOT covered in the company information, respond with: "I wish I could help! I don't have that information, but I can assist with questions about Upvave and our services."
5. Be helpful, professional, and highlight Upvave's specialties and benefits.
6. Do NOT make up information or features that are not mentioned in the company document.

FORMATTING INSTRUCTIONS:
- Use markdown formatting for all responses
- Use bullet points (•) for lists of items
- Use bold (**text**) for important points and headings
- Use numbered lists (1. 2. 3.) for step-by-step information
- Use line breaks between sections for better readability
- Use emojis where appropriate to make the response visually appealing
- Keep paragraphs short and easy to read
- Always structure your response with clear sections and proper spacing`,
    };

    // Format messages for OpenAI API
    const formattedMessages = messages
      .filter((msg: { role: string; content: string }) => msg.role !== "system")
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, ...formattedMessages],
      stream: true,
      temperature: 0.7,
      max_tokens: 512,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.choices[0]?.delta?.content) {
              controller.enqueue(
                encoder.encode(chunk.choices[0].delta.content)
              );
            }
          }
          controller.close();
        } catch (streamError) {
          console.error("Stream error:", streamError);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
