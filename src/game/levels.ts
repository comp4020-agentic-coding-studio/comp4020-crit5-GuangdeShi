// The difficulty curve, in one place so it can be rebalanced after
// playtesting without touching game logic. Revision 3: the 12-level curve
// (targetCount climbing 3,3,4,4,5,5...) still felt smooth and samey between
// levels, so the target-count steps are now bigger and less regular
// (3,4,6,6,8,8...) and the run is longer (15 levels instead of 12), so early,
// medium, hard and very-hard stretches are each clearly distinguishable.
// Timers scale up with targetCount rather than shrinking — a level with
// twice as many cards to hold gets meaningfully more time, not less, so the
// added difficulty comes from memory load and picking targets out of a
// bigger candidate pool, not from being rushed.

export interface LevelConfig {
  readonly level: number;
  readonly targetCount: number;
  readonly candidateCount: number;
  readonly memorizeSeconds: number;
  readonly recallSeconds: number;
}

export const LEVELS: readonly LevelConfig[] = [
  { level: 1, targetCount: 3, candidateCount: 16, memorizeSeconds: 8, recallSeconds: 22 },
  { level: 2, targetCount: 4, candidateCount: 18, memorizeSeconds: 10, recallSeconds: 26 },
  { level: 3, targetCount: 6, candidateCount: 20, memorizeSeconds: 14, recallSeconds: 32 },
  { level: 4, targetCount: 6, candidateCount: 22, memorizeSeconds: 13, recallSeconds: 34 },
  { level: 5, targetCount: 8, candidateCount: 24, memorizeSeconds: 18, recallSeconds: 40 },
  { level: 6, targetCount: 8, candidateCount: 26, memorizeSeconds: 17, recallSeconds: 42 },
  { level: 7, targetCount: 10, candidateCount: 28, memorizeSeconds: 22, recallSeconds: 48 },
  { level: 8, targetCount: 10, candidateCount: 30, memorizeSeconds: 21, recallSeconds: 50 },
  { level: 9, targetCount: 12, candidateCount: 32, memorizeSeconds: 26, recallSeconds: 56 },
  { level: 10, targetCount: 12, candidateCount: 34, memorizeSeconds: 25, recallSeconds: 58 },
  { level: 11, targetCount: 14, candidateCount: 36, memorizeSeconds: 30, recallSeconds: 64 },
  { level: 12, targetCount: 14, candidateCount: 38, memorizeSeconds: 29, recallSeconds: 66 },
  { level: 13, targetCount: 16, candidateCount: 40, memorizeSeconds: 34, recallSeconds: 72 },
  { level: 14, targetCount: 16, candidateCount: 42, memorizeSeconds: 33, recallSeconds: 74 },
  { level: 15, targetCount: 18, candidateCount: 44, memorizeSeconds: 38, recallSeconds: 80 },
];

export const MAX_LEVEL = LEVELS.length;

export function levelConfig(level: number): LevelConfig {
  const config = LEVELS[level - 1];
  if (!config) throw new RangeError(`no level config for level ${level}`);
  return config;
}
