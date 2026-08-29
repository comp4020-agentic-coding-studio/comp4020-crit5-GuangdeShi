// The difficulty curve, in one place so it can be rebalanced after
// playtesting without touching game logic. candidateCount is currently the
// same at every level (a half-deck: 26 of the 52 cards), but it's still a
// per-level field rather than a hardcoded constant, so a future rebalance can
// vary it without restructuring anything.

export interface LevelConfig {
  readonly level: number;
  readonly targetCount: number;
  readonly candidateCount: number;
  readonly memorizeSeconds: number;
  readonly recallSeconds: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { level: 1, targetCount: 3, candidateCount: 26, memorizeSeconds: 3, recallSeconds: 8 },
  { level: 2, targetCount: 3, candidateCount: 26, memorizeSeconds: 3, recallSeconds: 7 },
  { level: 3, targetCount: 4, candidateCount: 26, memorizeSeconds: 4, recallSeconds: 9 },
  { level: 4, targetCount: 4, candidateCount: 26, memorizeSeconds: 4, recallSeconds: 8 },
  { level: 5, targetCount: 5, candidateCount: 26, memorizeSeconds: 5, recallSeconds: 11 },
  { level: 6, targetCount: 5, candidateCount: 26, memorizeSeconds: 5, recallSeconds: 10 },
  { level: 7, targetCount: 6, candidateCount: 26, memorizeSeconds: 6, recallSeconds: 13 },
  { level: 8, targetCount: 6, candidateCount: 26, memorizeSeconds: 6, recallSeconds: 12 },
  { level: 9, targetCount: 7, candidateCount: 26, memorizeSeconds: 7, recallSeconds: 15 },
  { level: 10, targetCount: 7, candidateCount: 26, memorizeSeconds: 7, recallSeconds: 14 },
  { level: 11, targetCount: 8, candidateCount: 26, memorizeSeconds: 8, recallSeconds: 18 },
  { level: 12, targetCount: 8, candidateCount: 26, memorizeSeconds: 8, recallSeconds: 16 },
];

export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const config = LEVELS[level - 1];
  if (!config) throw new RangeError(`no level config for level ${level}`);
  return config;
}
