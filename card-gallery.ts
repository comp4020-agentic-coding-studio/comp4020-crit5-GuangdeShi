import { buildDeck } from "./src/game/cards.ts";
import { faceUpCard } from "./src/ui/card-view.ts";

const RANK_ORDER = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_ORDER = ["spades", "hearts", "clubs", "diamonds"] as const;

const app = document.querySelector<HTMLDivElement>("#gallery");
if (!app) throw new Error("#gallery not found");

const deck = buildDeck();

app.innerHTML = SUIT_ORDER.map((suit) => {
  const cards = deck
    .filter((card) => card.suit === suit)
    .sort((a, b) => RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank));
  const row = cards.map((card) => faceUpCard(card, undefined, "")).join("");
  return `<section class="suit-row"><h2>${suit}</h2><div class="row">${row}</div></section>`;
}).join("");
