import {
  Events,
  MessageType,
  type Client,
  type Message,
  type TextBasedChannel,
} from "discord.js";
import type { Config } from "../config.js";
import type { Logger } from "../logger.js";
import type { Agent, AgentInput } from "../agent/graph.js";
import { Cooldown } from "./cooldown.js";
import { stripMention } from "./mentions.js";
import { respond } from "./respond.js";

export interface HandlerDeps {
  client: Client;
  config: Config;
  logger: Logger;
  agent: Agent;
}

export function registerHandlers({ client, config, logger, agent }: HandlerDeps): void {
  const cooldown = new Cooldown(config.COOLDOWN_SECONDS);
  const guildAllowlist = new Set(config.ALLOWED_GUILD_IDS);
  const channelAllowlist = new Set(config.ALLOWED_CHANNEL_IDS);

  client.on(Events.MessageCreate, async (message: Message) => {
    try {
      logger.debug(
        {
          guildId: message.guildId,
          channelId: message.channelId,
          authorBot: message.author.bot,
          system: message.system,
          type: message.type,
          contentLen: message.content.length,
          mentionedUsers: message.mentions.users.map((u) => u.id),
        },
        "messageCreate",
      );

      if (message.author.bot) return;
      if (message.system) return;
      if (message.type !== MessageType.Default && message.type !== MessageType.Reply) return;
      if (!message.inGuild()) return;
      if (!client.user) return;

      const mentionsBot = message.mentions.has(client.user, {
        ignoreEveryone: true,
        ignoreRoles: true,
        ignoreRepliedUser: true,
      });
      if (!mentionsBot) {
        logger.debug(
          { botId: client.user.id, mentionedUsers: message.mentions.users.map((u) => u.id) },
          "skipped — bot not mentioned",
        );
        return;
      }

      if (guildAllowlist.size > 0 && !guildAllowlist.has(message.guildId)) return;
      if (
        channelAllowlist.size > 0 &&
        !channelAllowlist.has(message.channelId) &&
        !channelAllowlist.has(message.channel.parentId ?? "")
      ) {
        return;
      }

      const cooldownKey = `${message.channelId}:${message.author.id}`;
      if (!cooldown.consume(cooldownKey)) {
        logger.debug({ cooldownKey }, "skipped due to cooldown");
        return;
      }

      const cleanedMessage = stripMention(message.content, client.user.id);
      const recentMessages = await fetchRecentContext(
        message,
        config.CONTEXT_LIMIT,
        client.user.id,
      );

      const input: AgentInput = {
        message: cleanedMessage,
        authorName: message.member?.displayName ?? message.author.username,
        threadName: "name" in message.channel ? message.channel.name : undefined,
        recentMessages,
      };

      const result = await agent.run(input);
      logger.info(
        {
          from: input.authorName,
          incoming: cleanedMessage,
          sincere: result.sincereResponse,
          quickchat: result.quickchat,
          contextSize: recentMessages.length,
        },
        "agent response",
      );

      await respond(message, result.quickchat);
    } catch (err) {
      logger.error({ err }, "handler failed");
    }
  });
}

async function fetchRecentContext(
  message: Message<true>,
  limit: number,
  botId: string,
): Promise<string[]> {
  if (limit <= 0) return [];
  const channel: TextBasedChannel = message.channel;
  if (!("messages" in channel)) return [];

  const fetched = await channel.messages.fetch({ limit, before: message.id });
  return fetched
    .filter((m) => !m.system)
    .map((m) => {
      const name = m.member?.displayName ?? m.author.username;
      const content = stripMention(m.content, botId);
      return `${name}: ${content}`;
    })
    .reverse(); // oldest first
}
