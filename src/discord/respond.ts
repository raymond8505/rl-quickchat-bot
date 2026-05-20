import type { Message } from "discord.js";

/**
 * Single chokepoint for how the bot answers in a thread.
 * Today: a plain message reply. Later this is where reactions,
 * webhook impersonation, or rich embeds will be swapped in.
 */
export async function respond(message: Message, quickchat: string): Promise<void> {
  await message.reply({
    content: quickchat,
    allowedMentions: { repliedUser: false },
  });
}
