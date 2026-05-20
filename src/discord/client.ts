import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import type { Logger } from "../logger.js";

export function createClient(logger: Logger): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  client.once(Events.ClientReady, (c) => {
    logger.info(
      { tag: c.user.tag, guilds: c.guilds.cache.size },
      "discord client ready",
    );
  });

  client.on(Events.Error, (err) => logger.error({ err }, "discord error"));
  client.on(Events.Warn, (msg) => logger.warn({ msg }, "discord warn"));

  return client;
}
