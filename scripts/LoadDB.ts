/*
---- IMPORTANT: UNCOMMIT THIS FILE WHEN YOU NEED TO STORE MORE DATA IN VECTOR AND STORE THEM IN DATASTAX ----
This file has a depreciated dependency with the package name of "@langchain/community", which is currently not maintained and causes issues with the latest versions of other langchain packages. That is why that dependecy has been removed from the package.json file to avoid conflicts. If you need to change or add more data to the vector database, please uncommit this file, add the dependency "@langchain/community": "^1.1.2" back to the package.json file, run "npm seed" to add the data into the datastax database.
To use this file, please follow these steps:    
1- Uncommit this file from git.
2- Add the dependency "@langchain/community": "^1.1.2" back to the package.json file.
3- Run "npm seed" to add the data to database.
*/

// import { DataAPIClient } from "@datastax/astra-db-ts";
// import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import "dotenv/config";
// type SimilarityMetric = "dot_product" | "cosine" | "euclidean";
// import OpenAI from "openai";
// const {
//   ASTRA_DB_API_ENDPOINT,
//   ASTRA_DB_API_KEY,
//   ASTRA_DB_COLLECTION,
//   ASTRA_DB_NAMESPACE,
//   OPENAI_API_KEY,
// } = process.env;
// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
// const upvaveData = [
//   "https://upvave.com/",
//   "https://upvave.com/services/web-development",
//   "https://upvave.com/services/mobile-development",
//   "https://upvave.com/services/ui-ux-design",
//   "https://upvave.com/services/cloud-solutions",
//   "https://upvave.com/contact",
//   "https://upvave.com/about",
// ];
// const client = new DataAPIClient(ASTRA_DB_API_KEY);
// const db = client.db(
//   typeof ASTRA_DB_API_ENDPOINT === "string" ? ASTRA_DB_API_ENDPOINT : "",
//   { keyspace: typeof ASTRA_DB_NAMESPACE === "string" ? ASTRA_DB_NAMESPACE : "" }
// );
// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 512,
//   chunkOverlap: 100,
// });
// const createCollection = async (
//   similarityMetric: SimilarityMetric = "dot_product"
// ) => {
//   const res = await db.createCollection(ASTRA_DB_COLLECTION || "upvavegpt", {
//     vector: {
//       dimension: 1536,
//       metric: similarityMetric,
//     },
//   });
//   console.log(res);
// };
// const loadSampleData = async () => {
//   const collection = await db.collection(ASTRA_DB_COLLECTION || "upvavegpt");
//   for await (const url of upvaveData) {
//     const content = await scrapePage(url);
//     const chunks = await splitter.splitText(
//       typeof content === "string" ? content : ""
//     );
//     for await (const chunk of chunks) {
//       const embedding = await openai.embeddings.create({
//         model: "text-embedding-3-small",
//         input: chunk,
//         encoding_format: "float",
//       });
//       const vector = embedding.data[0].embedding;
//       const res = await collection.insertOne({
//         $vector: vector,
//         text: chunk,
//       });
//       console.log(res);
//     }
//   }
// };
// const scrapePage = async (url: string) => {
//   const loader = new PuppeteerWebBaseLoader(url, {
//     launchOptions: {
//       headless: true,
//     },
//     gotoOptions: {
//       waitUntil: "domcontentloaded",
//     },
//     evaluate: async (page, browser) => {
//       const result = await page.evaluate(() => document.body.innerHTML);
//       await browser.close();
//       return result;
//     },
//   });
//   const scraped = await loader.scrape();
//   return scraped?.replace(/\n/g, " ");
// };

// createCollection().then(() => loadSampleData());
