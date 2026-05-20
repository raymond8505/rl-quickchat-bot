import { describe, it, expect } from "vitest";
import { loadConfig } from "./config.js";

const base = {
  DISCORD_TOKEN: "tok",
  GOOGLE_API_KEY: "key",
};

describe("loadConfig", () => {
  it("parses required vars", () => {
    const c = loadConfig({ ...base });
    expect(c.DISCORD_TOKEN).toBe("tok");
    expect(c.GOOGLE_API_KEY).toBe("key");
  });

  it("applies defaults", () => {
    const c = loadConfig({ ...base });
    expect(c.GEMINI_MODEL).toBe("gemini-2.5-flash");
    expect(c.LOG_LEVEL).toBe("info");
    expect(c.COOLDOWN_SECONDS).toBe(30);
    expect(c.CONTEXT_LIMIT).toBe(0);
    expect(c.ALLOWED_GUILD_IDS).toEqual([]);
    expect(c.ALLOWED_CHANNEL_IDS).toEqual([]);
  });

  it("coerces CONTEXT_LIMIT from string", () => {
    const c = loadConfig({ ...base, CONTEXT_LIMIT: "5" });
    expect(c.CONTEXT_LIMIT).toBe(5);
  });

  it("clamps CONTEXT_LIMIT max", () => {
    expect(() => loadConfig({ ...base, CONTEXT_LIMIT: "100" })).toThrow();
  });

  it("parses CSV allowlists with trimming", () => {
    const c = loadConfig({
      ...base,
      ALLOWED_GUILD_IDS: "111, 222 , 333",
      ALLOWED_CHANNEL_IDS: "abc",
    });
    expect(c.ALLOWED_GUILD_IDS).toEqual(["111", "222", "333"]);
    expect(c.ALLOWED_CHANNEL_IDS).toEqual(["abc"]);
  });

  it("coerces COOLDOWN_SECONDS from string", () => {
    const c = loadConfig({ ...base, COOLDOWN_SECONDS: "5" });
    expect(c.COOLDOWN_SECONDS).toBe(5);
  });

  it("throws with a readable message when DISCORD_TOKEN is missing", () => {
    expect(() => loadConfig({ GOOGLE_API_KEY: "key" })).toThrow(/DISCORD_TOKEN/);
  });

  it("throws with a readable message when GOOGLE_API_KEY is missing", () => {
    expect(() => loadConfig({ DISCORD_TOKEN: "tok" })).toThrow(/GOOGLE_API_KEY/);
  });

  it("rejects negative COOLDOWN_SECONDS", () => {
    expect(() => loadConfig({ ...base, COOLDOWN_SECONDS: "-1" })).toThrow();
  });
});
