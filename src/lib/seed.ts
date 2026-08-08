// Everything generated at module load has to render identically on the server
// and the client, so no Math.random anywhere in the data layer.

export function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: number) {
  const r = mulberry32(seed);
  return {
    next: r,
    int(min: number, max: number) {
      return Math.floor(r() * (max - min + 1)) + min;
    },
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(r() * arr.length)];
    },
    weighted<T>(entries: readonly (readonly [T, number])[]): T {
      const total = entries.reduce((s, e) => s + e[1], 0);
      let roll = r() * total;
      for (const [value, weight] of entries) {
        roll -= weight;
        if (roll <= 0) return value;
      }
      return entries[entries.length - 1][0];
    },
    chance(p: number) {
      return r() < p;
    },
  };
}
