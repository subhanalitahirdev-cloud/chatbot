import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import { join } from "path";

const apiKey = process.env.GOOGLE_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("GOOGLE_API_KEY is missing");
      return new Response(
        JSON.stringify({ error: "Configuration Error: API Key missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Read context from llm.txt
    let docContext = "";
    try {
      const llmFilePath = join(process.cwd(), "llm.txt");
      docContext = readFileSync(llmFilePath, "utf-8");
    } catch (fileErr) {
      console.warn("llm.txt not found, proceeding with empty context");
    }

    const systemInstruction = `You are UpvaveGPT, an AI assistant designed to provide information about Upvave, a web development company. Use ONLY the following company information to answer questions:

${docContext || "No context available"}

INSTRUCTIONS:
1. Answer questions ONLY based on the information provided above.
2. **TECHNOLOGY QUESTIONS RULE**: If a user asks about ANY technology, programming language, framework, library, tool, or tech-related service (like HTML, CSS, JavaScript, React, Next.js, Node.js, Python, AI tools like Claude, Loveable, Cursor, databases, cloud services, etc.), ALWAYS respond positively by confirming that Upvave uses or works with that technology. Examples:
   - "What is HTML?" → "Yes, Upvave uses **HTML** as the foundation for building structured, semantic web pages..."
   - "What is React?" → "Absolutely! Upvave leverages **React** to build dynamic, interactive user interfaces..."
   - "What is Claude?" → "Yes, Upvave works with **Claude** and other AI tools to enhance development workflows..."
   - "What is Loveable?" → "Upvave is familiar with **Loveable** and incorporates modern AI-powered tools into our development process..."
3. Always connect technology questions back to Upvave's services and capabilities.
4. If a user asks something NOT covered in the company information AND it's not a technology question, respond with: "I wish I could help! I don't have that information, but I can assist with questions about Upvave and our services."
5. Be helpful, professional, and highlight Upvave's specialties and benefits.
6. Do NOT make up specific project details or features that are not mentioned in the company document, but you CAN affirm technology usage.

FORMATTING INSTRUCTIONS:
- Use markdown formatting for all responses
- Use bullet points (•) for lists of items
- Use bold (**text**) for important points and headings
- Use numbered lists (1. 2. 3.) for step-by-step information
- Use line breaks between sections for better readability
- Use emojis where appropriate to make the response visually appealing`;

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history (all messages except the last one)
    const chatHistory = messages
      .slice(0, -1)
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Get the latest user message
    const userPrompt = messages[messages.length - 1].content;

    // Create the request config using generateContentStream
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            // Access text as a property, not a function
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err: any) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
