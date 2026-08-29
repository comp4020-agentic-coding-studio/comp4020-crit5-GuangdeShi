// The difficulty curve, in one place so it can be rebalanced after
// playtesting without touching game logic. Alternates which variable grows
// level-to-level (memory load vs. distractor load) rather than raising every
// axis at once, so the climb is a staircase, not a spike.

export interface LevelConfig {
  readonly level: number;
  readonly targetCount: number;
  readonly candidateCount: number;
  readonly memorizeSeconds: number;
  readonly recallSeconds: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { level: 1, targetCount: 3, candidateCount: 6, memorizeSeconds: 7, recallSeconds: 15 },
  { level: 2, targetCount: 3, candidateCount: 7, memorizeSeconds: 6, recallSeconds: 14 },
  { level: 3, targetCount: 4, candidateCount: 7, memorizeSeconds: 8, recallSeconds: 18 },
  { level: 4, targetCount: 4, candidateCount: 8, memorizeSeconds: 7, recallSeconds: 17 },
  { level: 5, targetCount: 5, candidateCount: 9, memorizeSeconds: 9, recallSeconds: 21 },
  { level: 6, targetCount: 5, candidateCount: 10, memorizeSeconds: 8, recallSeconds: 20 },
  { level: 7, targetCount: 6, candidateCount: 10, memorizeSeconds: 10, recallSeconds: 24 },
  { level: 8, targetCount: 6, candidateCount: 11, memorizeSeconds: 9, recallSeconds: 23 },
  { level: 9, targetCount: 7, candidateCount: 12, memorizeSeconds: 11, recallSeconds: 27 },
  { level: 10, targetCount: 7, candidateCount: 13, memorizeSeconds: 10, recallSeconds: 26 },
  { level: 11, targetCount: 8, candidateCount: 14, memorizeSeconds: 12, recallSeconds: 30 },
  { level: 12, targetCount: 9, candidateCount: 15, memorizeSeconds: 14, recallSeconds: 34 },
];

export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const config = LEVELS[level - 1];
  if (!config) throw new RangeError(`no level config for level ${level}`);
  return config;
}
