import { DataAPIClient } from "@datastax/astra-db-ts";
import { OpenAI } from "openai";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_API_KEY,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_NAMESPACE,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_API_KEY || "");
const db = client.db(
  typeof ASTRA_DB_API_ENDPOINT === "string" ? ASTRA_DB_API_ENDPOINT : "",
  { keyspace: typeof ASTRA_DB_NAMESPACE === "string" ? ASTRA_DB_NAMESPACE : "" }
);

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

    // Get embedding for semantic search
    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: latestMessage,
        encoding_format: "float",
      });

      // Fetch context from vector database
      try {
        const collection = await db.collection(
          ASTRA_DB_COLLECTION || "upvavegpt"
        );
        const cursor = collection.find(
          {},
          {
            sort: {
              $vector: embedding.data[0].embedding,
            },
            limit: 10,
          }
        );

        const documents = await cursor.toArray();
        const docsMap = documents?.map(
          (doc: Record<string, unknown>) => (doc as Record<string, string>).text
        );
        docContext = JSON.stringify(docsMap);
      } catch (err) {
        console.log("Error fetching from database:", err);
        docContext = "";
      }
    } catch (embErr) {
      console.log("Error creating embedding:", embErr);
      docContext = "";
    }

    const systemPrompt = {
      role: "system" as const,
      content: `You are UpvaveGPT, an AI assistant designed to provide information about Upvave, a web development company. Use the following context to answer the user's question:\n\n${
        docContext || "No context available"
      }\n\nIf the context does not contain the answer, respond with 'I'm sorry, I don't have that information at the moment.' Do not make up answers.`,
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
