# rl-discord-bot

Discord bot that replies in threads with the most relevant Rocket League quickchat. Powered by LangGraph + Gemini.

## Status

The bot replies with a quickchat when it is `@mentioned` in a channel or thread. It pulls up to `CONTEXT_LIMIT` previous messages as context, generates a sincere reply to the thread based on its voice, then maps that reply to a quick chat

ex:
> User: @RL-Quickchat-Bot I almost dropped my milk... but then I caught it!
> LLM Sincere: good catch!
> Mapped Quickchat: What a save!

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
   ├─ prompt.ts      # two-step prompts: sincere draft → catalog mapping
   └─ quickchats.ts  # static RL quickchat catalog + FALLBACK
```

## Editing the quickchat catalog

The catalog is a static `readonly` array in [src/agent/quickchats.ts](src/agent/quickchats.ts). Each entry has this shape:

```ts
export type Category =
  | "Information"
  | "Compliments"
  | "Reactions"
  | "Apologies"
  | "PostGame";

export interface Quickchat {
  category: Category;
  text: string;       // exact in-game string
  useCases: string[]; // sincere situational descriptions
}
```

Example entry:

```ts
{
  category: "Information",
  text: "I got it!",
  useCases: [
    "Stepping forward when there's a thing to be handled",
    "Claiming the next move before anyone else",
    "Volunteering for whatever's in front of you",
  ],
},
```

**To add a quickchat**, append a new object to the `QUICKCHATS` array. Two rules that matter:

- `text` must be the **exact** in-game quickchat string — that is what gets sent to Discord.
- `useCases` should be **3+ sincere situational descriptions**, phrased away from Rocket League jargon. The model treats these as ground truth when matching a real conversation moment to a quickchat — abstract, sincere descriptions match more unexpected moments than literal in-game ones do.

The array is `as const`, so the `category` field must match the `Category` union. After editing, run:

```sh
yarn test
```

[src/agent/quickchats.test.ts](src/agent/quickchats.test.ts) checks for empty `text`, empty `useCases`, and duplicate entries — so a busted entry fails locally instead of silently breaking the agent.

The catalog is rendered into the mapping prompt by [src/agent/prompt.ts](src/agent/prompt.ts) and consumed by the `mapToQuickchat` node in [src/agent/graph.ts](src/agent/graph.ts).

## Editing the prompts

Both LLM prompts live as inline string constants in [src/agent/prompt.ts](src/agent/prompt.ts) — there are no separate `.md`/`.txt` template files.

| Constant                   | What it does                                                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SINCERE_RESPONSE_PROMPT`  | **Step 1**: Gemini drafts a natural one-sentence teammate reply, ignoring the quickchat catalog entirely. Tuning this changes the bot's *voice*.                                   |
| `QUICKCHAT_MAPPING_PROMPT` | **Step 2**: Gemini picks the single closest entry from the catalog (interpolated via `${QUICKCHAT_LIST}`). Tuning this changes how the sincere draft gets *snapped* to a quickchat. |

Both are passed as `SystemMessage`s on the corresponding LLM invocations in [src/agent/graph.ts](src/agent/graph.ts). Edit, save, and `yarn dev` picks the changes up on next mention.

## CodeGraph

This project uses [CodeGraph](https://github.com/codegraph/codegraph) for structural code intelligence. Initialize the local index once:

```sh
codegraph init -i
```
