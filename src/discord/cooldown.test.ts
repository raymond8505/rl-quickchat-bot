import { describe, it, expect } from "vitest";
import { Cooldown, type Clock } from "./cooldown.js";

function fakeClock(start = 0): Clock & { advance(ms: number): void } {
  let t = start;
  return {
    now: () => t,
    advance(ms) {
      t += ms;
    },
  };
}

describe("Cooldown", () => {
  it("allows the first hit", () => {
    const cd = new Cooldown(30, fakeClock());
    expect(cd.consume("a")).toBe(true);
  });

  it("blocks repeat hits within the window", () => {
    const clock = fakeClock();
    const cd = new Cooldown(30, clock);
    expect(cd.consume("a")).toBe(true);
    clock.advance(10_000);
    expect(cd.consume("a")).toBe(false);
  });

  it("allows again after the window elapses", () => {
    const clock = fakeClock();
    const cd = new Cooldown(30, clock);
    expect(cd.consume("a")).toBe(true);
    clock.advance(30_000);
    expect(cd.consume("a")).toBe(true);
  });

  it("isolates keys", () => {
    const cd = new Cooldown(30, fakeClock());
    expect(cd.consume("a")).toBe(true);
    expect(cd.consume("b")).toBe(true);
  });

  it("ttl of zero disables cooldown entirely", () => {
    const cd = new Cooldown(0, fakeClock());
    expect(cd.consume("a")).toBe(true);
    expect(cd.consume("a")).toBe(true);
    expect(cd.consume("a")).toBe(true);
  });

  it("sweep drops expired entries", () => {
    const clock = fakeClock();
    const cd = new Cooldown(30, clock);
    cd.consume("a");
    cd.consume("b");
    expect(cd.size()).toBe(2);
    clock.advance(60_000);
    cd.sweep();
    expect(cd.size()).toBe(0);
  });
});
