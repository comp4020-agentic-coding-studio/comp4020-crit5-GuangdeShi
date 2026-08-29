import type { Suit } from "../game/cards.ts";

// Original geometric suit glyphs, drawn as SVG paths on a 0-24 viewBox so
// every card renders the same shape at any size (no font-dependent glyph
// metrics, no risk of a suit mark overflowing its box). These are generic
// heart/diamond/club/spade constructions, not traced from any reference
// artwork.

const HEART_PATH =
  "M12 20.5 L4.7 13.7 C2.6 11.7 2.6 8.4 4.7 6.5 C6.7 4.7 9.8 5 11.6 7.1 L12 7.6 L12.4 7.1 C14.2 5 17.3 4.7 19.3 6.5 C21.4 8.4 21.4 11.7 19.3 13.7 Z";

const DIAMOND_PATH = "M12 2.3 L20.7 12 L12 21.7 L3.3 12 Z";

const SPADE_PATH =
  "M12 3.3 L19.3 10.3 C21.4 12.3 21.4 15.6 19.3 17.5 C17.3 19.3 14.2 19 12.4 16.9 L12 16.4 L11.6 16.9 C9.8 19 6.7 19.3 4.7 17.5 C2.6 15.6 2.6 12.3 4.7 10.3 Z M10.3 18 L9.3 21.7 L14.7 21.7 L13.7 18 Z";

const CLUB_SHAPE =
  '<circle cx="12" cy="8.4" r="4.3"/><circle cx="7.7" cy="13.4" r="4.3"/><circle cx="16.3" cy="13.4" r="4.3"/>' +
  '<path d="M10.3 15.3 L9.2 21.7 L14.8 21.7 L13.7 15.3 Z"/>';

/** The suit's shape as SVG body markup (path/circle elements), unwrapped —
 *  used both for the standalone icon and reused inside the face-portrait
 *  chest emblem. */
export function suitShapeMarkup(suit: Suit): string {
  switch (suit) {
    case "hearts":
      return `<path d="${HEART_PATH}"/>`;
    case "diamonds":
      return `<path d="${DIAMOND_PATH}"/>`;
    case "spades":
      return `<path d="${SPADE_PATH}"/>`;
    case "clubs":
      return CLUB_SHAPE;
  }
}

/** A standalone suit icon: fills with the current text color, so a single
 *  `.card.red` / default-black rule on the card element controls it. */
export function suitIcon(suit: Suit, className = "suit-icon"): string {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${suitShapeMarkup(suit)}</svg>`;
}
