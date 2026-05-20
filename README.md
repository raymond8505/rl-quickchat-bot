# rl-discord-bot

Discord bot that replies in threads with the most relevant Rocket League quickchat. Powered by LangGraph + Gemini.

## Status

The bot replies with a quickchat when it is `@mentioned` in a channel or thread. It pulls up to `HISTORY_LIMIT` previous messages as context and asks Gemini to pick the most fitting quickchat from the static catalog. Scoring / prompt-tuning is the next iteration.

## Setup

1. **Install Node 20+** (see `.nvmrc`).
2. **Install deps:**
   ```sh
   yarn install
   ```
3. **Create `.env`** from the template and fill in secrets:
   ```sh
   cp .env.example .env
   ```
   - `DISCORD_TOKEN` — bot token from the [Discord Developer Portal](https://discord.com/developers/applications).
   - `GOOGLE_API_KEY` — from [ai.google.dev](https://ai.google.dev/).
4. **In the Discord Developer Portal** for your bot:
   - Enable the **Message Content** privileged intent.
   - Invite the bot to your test server with scopes `bot` + `applications.commands` and the **Send Messages** + **Read Message History** permissions.
5. **Run dev:**
   ```sh
   yarn dev
   ```

## Scripts

| Script           | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `yarn dev`       | Run with `vite-node` and watch for changes.           |
| `yarn build`     | Bundle to `dist/index.mjs` via Vite SSR build.        |
| `yarn start`     | Run the built bundle.                                 |
| `yarn typecheck` | `tsc --noEmit`.                                       |
| `yarn test`      | Run the vitest suite once.                            |
| `yarn test:watch`| Run vitest in watch mode.                             |

## Configuration

All env vars are validated by zod at startup (see [src/config.ts](src/config.ts)).

| Variable               | Default              | Purpose                                                                 |
| ---------------------- | -------------------- | ----------------------------------------------------------------------- |
| `DISCORD_TOKEN`        | _required_           | Bot token.                                                              |
| `GOOGLE_API_KEY`       | _required_           | Gemini API key.                                                         |
| `GEMINI_MODEL`         | `gemini-2.5-flash`   | Gemini model name.                                                      |
| `LOG_LEVEL`            | `info`               | pino level.                                                             |
| `ALLOWED_GUILD_IDS`    | _(empty = all)_      | Comma-separated guild allowlist.                                        |
| `ALLOWED_CHANNEL_IDS`  | _(empty = all)_      | Comma-separated channel/parent allowlist (matches thread or its parent).|
| `COOLDOWN_SECONDS`     | `30`                 | Per-thread-per-user cooldown. `0` disables.                             |
| `CONTEXT_LIMIT`        | `0`                  | Previous messages pulled as context (max 50). `0` = only the mention.   |

## Architecture

```
src/
├─ index.ts          # boot: load config → build agent → start Discord client
├─ config.ts         # zod-validated env
├─ logger.ts         # pino factory
├─ discord/
│  ├─ client.ts      # Client with intents + partials
│  ├─ handlers.ts    # messageCreate listener: filter, cooldown, agent, respond
│  ├─ respond.ts     # single chokepoint for how the bot answers
│  └─ cooldown.ts    # in-memory per-key cooldown
└─ agent/
   ├─ graph.ts       # LangGraph StateGraph + validateQuickchat()
   ├─ model.ts       # ChatGoogleGenerativeAI factory
   ├─ prompt.ts      # system prompt (placeholder — tuned next)
   └─ quickchats.ts  # static RL quickchat catalog + FALLBACK
```

## CodeGraph

This project uses [CodeGraph](https://github.com/codegraph/codegraph) for structural code intelligence. Initialize the local index once:

```sh
codegraph init -i
```
