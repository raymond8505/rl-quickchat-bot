import { describe, it, expect } from "vitest";
import { stripMention } from "./mentions.js";

describe("stripMention", () => {
  it("removes a bare bot mention", () => {
    expect(stripMention("<@111>", "111")).toBe("");
  });

  it("removes nickname-style mention", () => {
    expect(stripMention("<@!111>", "111")).toBe("");
  });

  it("removes mention in middle of content", () => {
    expect(stripMention("hey <@111> what about that", "111")).toBe(
      "hey what about that",
    );
  });

  it("removes multiple mentions of the same bot", () => {
    expect(stripMention("<@111> hey <@111>", "111")).toBe("hey");
  });

  it("leaves other user mentions intact", () => {
    expect(stripMention("hi <@222> and <@111>", "111")).toBe("hi <@222> and");
  });

  it("collapses extra whitespace introduced by the strip", () => {
    expect(stripMention("hello   <@111>   world", "111")).toBe("hello world");
  });

  it("returns empty string when nothing remains", () => {
    expect(stripMention("   <@111>   ", "111")).toBe("");
  });
});
