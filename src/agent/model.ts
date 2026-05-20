import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { Config } from "../config.js";

export function createModel(config: Config) {
  return new ChatGoogleGenerativeAI({
    apiKey: config.GOOGLE_API_KEY,
    model: config.GEMINI_MODEL,
    temperature: 0.5,
    // Gemini 2.5 Flash "thinking" tokens count against this budget. A
    // 64-token cap was starving the visible output (thinking ate it all).
    // 1024 is plenty for both short sentence + JSON outputs.
    maxOutputTokens: 1024,
  });
}

export type Model = ReturnType<typeof createModel>;
