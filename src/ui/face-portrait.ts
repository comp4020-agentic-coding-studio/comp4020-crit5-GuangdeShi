import type { Suit } from "../game/cards.ts";
import { suitShapeMarkup } from "./suits.ts";

type FaceRank = "J" | "Q" | "K";

// A simplified, original double-headed face-card portrait system. Each rank
// gets a distinct headwear silhouette (cap+plume / orb crown / spike crown
// with cross) plus a small facial-silhouette detail, so J/Q/K stay visually
// distinct even at small candidate-grid size. None of this is traced from
// reference artwork — it's built from plain geometric primitives (circles,
// lines, simple paths).

const GARMENT =
  '<path d="M14 88 L14 60 C14 50 20 45 30 45 C40 45 46 50 46 60 L46 88 Z"/>' +
  '<path d="M22 47 L30 55 L38 47" fill="none" stroke="currentColor" stroke-width="2"/>';

const HEAD = '<circle cx="30" cy="32" r="14"/>';

/** Headwear, the main rank-distinguishing shape: a soft domed cap with a
 *  plume for Jack (no crown — the junior court card), a banded crown topped
 *  with three orbs for Queen, and a banded crown with spikes and a small
 *  cross for King. */
const ORNAMENT: Record<FaceRank, string> = {
  J:
    '<path d="M18 20 C18 10 42 10 42 20 Z"/>' +
    '<line x1="40" y1="14" x2="47" y2="6" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="47" cy="6" r="2.2"/>',
  Q:
    '<path d="M17 21 L43 21 L43 17 L17 17 Z"/>' +
    '<circle cx="22" cy="13" r="3"/><circle cx="30" cy="11" r="3.4"/><circle cx="38" cy="13" r="3"/>',
  K:
    '<path d="M16 21 L44 21 L44 17 L16 17 Z"/>' +
    '<path d="M16 17 L20 7 L24 17 L28 5 L32 17 L36 5 L40 17 L44 17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<line x1="32" y1="7" x2="32" y2="3" stroke="currentColor" stroke-width="2"/>' +
    '<line x1="29" y1="4" x2="35" y2="4" stroke="currentColor" stroke-width="2"/>',
};

/** A secondary silhouette detail beyond the headwear: Jack stays plain
 *  (youthful, unadorned), Queen gets soft hair flares beside the head, King
 *  gets a short beard — so the three ranks read differently even in outline. */
const FACE_DETAIL: Record<FaceRank, string> = {
  J: "",
  Q:
    '<path d="M16 34 C12 30 12 22 16 18" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
    '<path d="M44 34 C48 30 48 22 44 18" fill="none" stroke="currentColor" stroke-width="2.4"/>',
  K: '<path d="M20 40 C22 46 38 46 40 40 L38 44 C34 48 26 48 22 44 Z"/>',
};

/** A small suit-shaped cutout on the chest, filled with the card background
 *  colour so it reads as an emblem without needing a second ink colour. */
function emblem(suit: Suit): string {
  return `<g transform="translate(22,60) scale(0.667)" fill="var(--card-bg)">${suitShapeMarkup(suit)}</g>`;
}

/** One mirrored half of a double-headed face card. The caller renders this
 *  twice — once as-is, once rotated 180deg — to form the full figure, the
 *  same way a real face card reads from either end. */
export function facePortrait(rank: FaceRank, suit: Suit): string {
  const body = `${GARMENT}${HEAD}${FACE_DETAIL[rank]}${ORNAMENT[rank]}${emblem(suit)}`;
  return `<svg class="face-portrait-svg" viewBox="0 0 60 90" fill="currentColor" aria-hidden="true">${body}</svg>`;
}
