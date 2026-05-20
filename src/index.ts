import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { createClient } from "./discord/client.js";
import { registerHandlers } from "./discord/handlers.js";
import { createAgent } from "./agent/graph.js";
import { createModel } from "./agent/model.js";

async function main() {
  const config = loadConfig();
  const logger = createLogger(config.LOG_LEVEL, config.NODE_ENV !== "production");

  logger.info(
    {
      model: config.GEMINI_MODEL,
      cooldown: config.COOLDOWN_SECONDS,
      guildAllowlist: config.ALLOWED_GUILD_IDS.length,
      channelAllowlist: config.ALLOWED_CHANNEL_IDS.length,
    },
    "starting rl-discord-bot",
  );

  const model = createModel(config);
  const agent = createAgent({ model, logger });
  const client = createClient(logger);

  registerHandlers({ client, config, logger, agent });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down");
    await client.destroy();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await client.login(config.DISCORD_TOKEN);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("fatal", err);
  process.exit(1);
});
