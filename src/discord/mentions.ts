/**
 * Removes `<@id>` and `<@!id>` user mentions of the bot from a message
 * content string, collapses resulting whitespace, and trims.
 */
export function stripMention(content: string, botId: string): string {
  const re = new RegExp(`<@!?${botId}>`, "g");
  return content.replace(re, "").replace(/\s+/g, " ").trim();
}
