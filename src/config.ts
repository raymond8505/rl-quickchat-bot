import { config as loadDotenv } from "dotenv";
import { z } from "zod";

loadDotenv();

const csv = z
  .string()
  .optional()
  .default("")
  .transform((v) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

export const ConfigSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  LOG_LEVEL: z.string().default("info"),
  ALLOWED_GUILD_IDS: csv,
  ALLOWED_CHANNEL_IDS: csv,
  COOLDOWN_SECONDS: z.coerce.number().int().min(0).default(30),
  CONTEXT_LIMIT: z.coerce.number().int().min(0).max(50).default(0),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Config = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = ConfigSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid configuration:\n${issues}`);
  }
  return parsed.data;
}
