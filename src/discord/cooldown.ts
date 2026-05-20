export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

export class Cooldown {
  private readonly ttlMs: number;
  private readonly clock: Clock;
  private readonly hits = new Map<string, number>();

  constructor(ttlSeconds: number, clock: Clock = systemClock) {
    this.ttlMs = ttlSeconds * 1000;
    this.clock = clock;
  }

  /**
   * Returns true if the key is allowed to fire now (and records the hit).
   * Returns false if it's still within the cooldown window.
   */
  consume(key: string): boolean {
    if (this.ttlMs <= 0) return true;
    const now = this.clock.now();
    const last = this.hits.get(key);
    if (last !== undefined && now - last < this.ttlMs) return false;
    this.hits.set(key, now);
    return true;
  }

  /** Drops expired entries. Cheap to call periodically. */
  sweep(): void {
    if (this.ttlMs <= 0) return;
    const cutoff = this.clock.now() - this.ttlMs;
    for (const [k, t] of this.hits) {
      if (t < cutoff) this.hits.delete(k);
    }
  }

  size(): number {
    return this.hits.size;
  }
}
