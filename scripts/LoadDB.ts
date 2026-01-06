import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";
type SimilarityMetric = "dot_product" | "cosine" | "euclidean";
import OpenAI from "openai";
const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_API_KEY,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_NAMESPACE,
  OPENAI_API_KEY,
} = process.env;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const upvaveData = [
  "https://upvave.com/",
  "https://upvave.com/services/web-development",
  "https://upvave.com/services/mobile-development",
  "https://upvave.com/services/ui-ux-design",
  "https://upvave.com/services/cloud-solutions",
  "https://upvave.com/contact",
  "https://upvave.com/about",
];
const client = new DataAPIClient(ASTRA_DB_API_KEY);
const db = client.db(
  typeof ASTRA_DB_API_ENDPOINT === "string" ? ASTRA_DB_API_ENDPOINT : "",
  { keyspace: typeof ASTRA_DB_NAMESPACE === "string" ? ASTRA_DB_NAMESPACE : "" }
);
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});
const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION || "upvavegpt", {
    vector: {
      dimension: 1536,
      metric: similarityMetric,
    },
  });
};
const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION || "upvavegpt");
  for await (const url of upvaveData) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });
    }
  }
};
