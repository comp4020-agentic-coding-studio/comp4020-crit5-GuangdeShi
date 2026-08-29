import type { Rank } from "../game/cards.ts";

/** Pip positions for numbered cards (2-10), in the standard French-suited
 *  layout: a 3-column (left/centre/right) by 7-row grid — every row slot is
 *  used by at least one rank, so pips get the most vertical room the card
 *  can give them. Pips in the top half are drawn upside-down (row < 4,
 *  below the row-4 centre line), matching a real deck read from either end. */
export interface PipPosition {
  readonly row: number;
  readonly col: 1 | 2 | 3;
  readonly rotated: boolean;
}

const LAYOUTS: Partial<Record<Rank, ReadonlyArray<readonly [row: number, col: 1 | 2 | 3]>>> = {
  "2": [[1, 2], [7, 2]],
  "3": [[1, 2], [4, 2], [7, 2]],
  "4": [[1, 1], [1, 3], [7, 1], [7, 3]],
  "5": [[1, 1], [1, 3], [4, 2], [7, 1], [7, 3]],
  "6": [[1, 1], [1, 3], [4, 1], [4, 3], [7, 1], [7, 3]],
  "7": [[1, 1], [1, 3], [2, 2], [4, 1], [4, 3], [7, 1], [7, 3]],
  "8": [[1, 1], [1, 3], [2, 2], [4, 1], [4, 3], [6, 2], [7, 1], [7, 3]],
  "9": [[1, 1], [1, 3], [2, 1], [2, 3], [4, 2], [6, 1], [6, 3], [7, 1], [7, 3]],
  "10": [[1, 1], [1, 3], [2, 1], [2, 3], [3, 2], [5, 2], [6, 1], [6, 3], [7, 1], [7, 3]],
};

export function pipLayout(rank: Rank): readonly PipPosition[] {
  const layout = LAYOUTS[rank];
  if (!layout) return [];
  return layout.map(([row, col]) => ({ row, col, rotated: row < 4 }));
}
