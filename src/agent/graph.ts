import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { HumanMessage, SystemMessage, type AIMessage } from "@langchain/core/messages";
import type { Model } from "./model.js";
import type { Logger } from "../logger.js";
import { SINCERE_RESPONSE_PROMPT, QUICKCHAT_MAPPING_PROMPT } from "./prompt.js";

export interface AgentInput {
  message: string;
  authorName?: string;
  threadName?: string;
  /** Pre-formatted "name: content" strings, oldest first. */
  recentMessages?: string[];
}

export interface AgentResult {
  quickchat: string;
  sincereResponse: string;
}

export interface Agent {
  run(input: AgentInput): Promise<AgentResult>;
}

function extractText(res: AIMessage): string {
  if (typeof res.content === "string") return res.content;
  return res.content.map((c) => ("text" in c ? c.text : "")).join("");
}

function formatSituation(state: {
  message: string;
  authorName?: string;
  threadName?: string;
  recentMessages: string[];
}): string {
  const parts: string[] = [];
  if (state.threadName) parts.push(`Channel/thread: ${state.threadName}`);
  if (state.recentMessages.length > 0) {
    parts.push("Recent messages (oldest first):");
    for (const m of state.recentMessages) parts.push(`- ${m}`);
  }
  const author = state.authorName ?? "A user";
  const incoming =
    state.message.trim().length > 0
      ? `"${state.message}"`
      : "(no text — just a mention)";
  parts.push(`${author} just @mentioned you with: ${incoming}`);
  return parts.join("\n");
}

const State = Annotation.Root({
  message: Annotation<string>,
  authorName: Annotation<string | undefined>,
  threadName: Annotation<string | undefined>,
  recentMessages: Annotation<string[]>,
  sincereResponse: Annotation<string>,
  quickchat: Annotation<string>,
});

export interface AgentDeps {
  model: Model;
  logger: Logger;
}

export function createAgent({ model }: AgentDeps): Agent {
  const respondSincerely = async (state: typeof State.State) => {
    const situation = formatSituation(state);
    const res = await model.invoke([
      new SystemMessage(SINCERE_RESPONSE_PROMPT),
      new HumanMessage(situation),
    ]);
    const sincereResponse = extractText(res).trim();
    return { sincereResponse };
  };

  const mapToQuickchat = async (state: typeof State.State) => {
    const situation = formatSituation(state);
    const userContent = [
      situation,
      "",
      `Sincere teammate reply: "${state.sincereResponse}"`,
      "",
      "Pick the catalog quickchat whose listed situations best match that reply.",
    ].join("\n");

    const res = await model.invoke([
      new SystemMessage(QUICKCHAT_MAPPING_PROMPT),
      new HumanMessage(userContent),
    ]);
    const quickchat = extractText(res).trim();
    return { quickchat };
  };

  const compiled = new StateGraph(State)
    .addNode("respond_sincerely", respondSincerely)
    .addNode("map_to_quickchat", mapToQuickchat)
    .addEdge(START, "respond_sincerely")
    .addEdge("respond_sincerely", "map_to_quickchat")
    .addEdge("map_to_quickchat", END)
    .compile();

  return {
    async run(input) {
      const out = await compiled.invoke({
        message: input.message,
        authorName: input.authorName,
        threadName: input.threadName,
        recentMessages: input.recentMessages ?? [],
        sincereResponse: "",
        quickchat: "",
      });
      return {
        quickchat: out.quickchat,
        sincereResponse: out.sincereResponse,
      };
    },
  };
}
