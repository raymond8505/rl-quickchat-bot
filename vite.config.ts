import { defineConfig } from "vite";
import { builtinModules } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "node20",
    ssr: true,
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, "src/index.ts"),
      output: {
        format: "esm",
        entryFileNames: "index.mjs",
      },
      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        "discord.js",
        "@discordjs/ws",
        "@discordjs/rest",
        "@langchain/core",
        "@langchain/google-genai",
        "@langchain/langgraph",
        "dotenv",
        "pino",
        "pino-pretty",
        "zod",
      ],
    },
  },
});
