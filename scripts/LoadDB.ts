import { DataAPIClient } from "@datastax/astra-db-ts";
import { OpenAI } from "openai/client.js";
import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
