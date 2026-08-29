// The difficulty curve, in one place so it can be rebalanced after
// playtesting without touching game logic. The candidate pool is always the
// full 52-card deck (see generate.ts) — difficulty comes entirely from target
// length and timer pressure, not from candidate count.

export interface LevelConfig {
  readonly level: number;
  readonly targetCount: number;
  readonly memorizeSeconds: number;
  readonly recallSeconds: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { level: 1, targetCount: 3, memorizeSeconds: 4, recallSeconds: 10 },
  { level: 2, targetCount: 3, memorizeSeconds: 4, recallSeconds: 9 },
  { level: 3, targetCount: 4, memorizeSeconds: 5, recallSeconds: 12 },
  { level: 4, targetCount: 4, memorizeSeconds: 5, recallSeconds: 11 },
  { level: 5, targetCount: 5, memorizeSeconds: 6, recallSeconds: 14 },
  { level: 6, targetCount: 5, memorizeSeconds: 6, recallSeconds: 13 },
  { level: 7, targetCount: 6, memorizeSeconds: 7, recallSeconds: 17 },
  { level: 8, targetCount: 6, memorizeSeconds: 7, recallSeconds: 16 },
  { level: 9, targetCount: 7, memorizeSeconds: 8, recallSeconds: 20 },
  { level: 10, targetCount: 7, memorizeSeconds: 8, recallSeconds: 19 },
  { level: 11, targetCount: 8, memorizeSeconds: 9, recallSeconds: 24 },
  { level: 12, targetCount: 8, memorizeSeconds: 9, recallSeconds: 22 },
];

export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const config = LEVELS[level - 1];
  if (!config) throw new RangeError(`no level config for level ${level}`);
  return config;
}
