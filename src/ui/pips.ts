import type { Rank } from "../game/cards.ts";

/** Pip positions for numbered cards (2-10), in the standard French-suited
 *  layout: a 3-column (left/centre/right) by 9-row grid, using odd rows for
 *  the "main" positions and even rows for the extra pips 7-10 need. Pips in
 *  the top half are drawn upside-down, matching a real deck. */
export interface PipPosition {
  readonly row: number;
  readonly col: 1 | 2 | 3;
  readonly rotated: boolean;
}

const LAYOUTS: Partial<Record<Rank, ReadonlyArray<readonly [row: number, col: 1 | 2 | 3]>>> = {
  "2": [[1, 2], [9, 2]],
  "3": [[1, 2], [5, 2], [9, 2]],
  "4": [[1, 1], [1, 3], [9, 1], [9, 3]],
  "5": [[1, 1], [1, 3], [5, 2], [9, 1], [9, 3]],
  "6": [[1, 1], [1, 3], [5, 1], [5, 3], [9, 1], [9, 3]],
  "7": [[1, 1], [1, 3], [3, 2], [5, 1], [5, 3], [9, 1], [9, 3]],
  "8": [[1, 1], [1, 3], [3, 2], [5, 1], [5, 3], [7, 2], [9, 1], [9, 3]],
  "9": [[1, 1], [1, 3], [3, 1], [3, 3], [5, 2], [7, 1], [7, 3], [9, 1], [9, 3]],
  "10": [[1, 1], [1, 3], [3, 1], [3, 3], [4, 2], [6, 2], [7, 1], [7, 3], [9, 1], [9, 3]],
};

export function pipLayout(rank: Rank): readonly PipPosition[] {
  const layout = LAYOUTS[rank];
  if (!layout) return [];
  return layout.map(([row, col]) => ({ row, col, rotated: row < 5 }));
}
