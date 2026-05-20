import { describe, it, expect } from "vitest";
import { QUICKCHATS } from "./quickchats.js";

describe("quickchats catalog", () => {
  it("has entries", () => {
    expect(QUICKCHATS.length).toBeGreaterThan(20);
  });

  it("contains no empty strings", () => {
    for (const q of QUICKCHATS) {
      expect(q.text.trim()).not.toBe("");
    }
  });

  it("contains no duplicate texts", () => {
    const texts = QUICKCHATS.map((q) => q.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("every entry has at least one use case", () => {
    for (const q of QUICKCHATS) {
      expect(q.useCases.length).toBeGreaterThan(0);
    }
  });

  it("no use case is empty", () => {
    for (const q of QUICKCHATS) {
      for (const u of q.useCases) {
        expect(u.trim()).not.toBe("");
      }
    }
  });

  it("no quickchat has duplicate use cases", () => {
    for (const q of QUICKCHATS) {
      expect(new Set(q.useCases).size).toBe(q.useCases.length);
    }
  });
});
