// The difficulty curve, in one place so it can be rebalanced after
// playtesting without touching game logic. candidateCount now climbs from 16
// to 28 across the 12 levels rather than sitting fixed at a 26-card half-deck
// — a flat pool made level 1 as visually crowded as level 12, and a fixed
// half-deck at every level meant the only lever raising difficulty was the
// timers. Ramping the pool alongside target length means difficulty comes
// from having more cards to hold in memory and more distractors to tell
// apart, not just less time to act.

export interface LevelConfig {
  readonly level: number;
  readonly targetCount: number;
  readonly candidateCount: number;
  readonly memorizeSeconds: number;
  readonly recallSeconds: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { level: 1, targetCount: 3, candidateCount: 16, memorizeSeconds: 8, recallSeconds: 22 },
  { level: 2, targetCount: 3, candidateCount: 18, memorizeSeconds: 8, recallSeconds: 22 },
  { level: 3, targetCount: 4, candidateCount: 18, memorizeSeconds: 10, recallSeconds: 26 },
  { level: 4, targetCount: 4, candidateCount: 20, memorizeSeconds: 10, recallSeconds: 26 },
  { level: 5, targetCount: 5, candidateCount: 20, memorizeSeconds: 12, recallSeconds: 30 },
  { level: 6, targetCount: 5, candidateCount: 22, memorizeSeconds: 12, recallSeconds: 30 },
  { level: 7, targetCount: 6, candidateCount: 22, memorizeSeconds: 14, recallSeconds: 34 },
  { level: 8, targetCount: 6, candidateCount: 24, memorizeSeconds: 14, recallSeconds: 34 },
  { level: 9, targetCount: 7, candidateCount: 24, memorizeSeconds: 16, recallSeconds: 38 },
  { level: 10, targetCount: 7, candidateCount: 26, memorizeSeconds: 16, recallSeconds: 38 },
  { level: 11, targetCount: 8, candidateCount: 26, memorizeSeconds: 18, recallSeconds: 42 },
  { level: 12, targetCount: 8, candidateCount: 28, memorizeSeconds: 18, recallSeconds: 42 },
];

export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const config = LEVELS[level - 1];
  if (!config) throw new RangeError(`no level config for level ${level}`);
  return config;
}
