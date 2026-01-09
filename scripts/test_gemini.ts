import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

async function main() {
  console.log("Checking GOOGLE_API_KEY...");
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GOOGLE_API_KEY is missing via process.env");
    process.exit(1);
  } else {
      console.log("✅ GOOGLE_API_KEY is present (length: " + apiKey.length + ")");
  }

  try {
    console.log("Attempting to connect to Gemini...");
    const ai = new GoogleGenAI({ apiKey });
    
    // Use any to avoid TS errors during quick debug
    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
    });
    console.log("✅ Response received successfully");
    // console.log("Response keys:", Object.keys(response));
    // console.log("Response:", JSON.stringify(response, null, 2));
    if (typeof response.text === 'function') {
        console.log("Response text:", response.text());
    } else if (typeof response.text === 'string') {
        console.log("Response text:", response.text);
    } else {
        console.log("Response structure:", response);
    }

  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message);
    console.error("Full error:", error);
  }
}

main();
