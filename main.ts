import { advance, deselectCard, selectCard, startGame, tickMemorize, tickRecall } from "./src/game/state.ts";
import type { GameState } from "./src/game/state.ts";
import { render } from "./src/ui/render.ts";

const found = document.querySelector<HTMLDivElement>("#app");
if (!found) throw new Error("#app not found");
const app: HTMLDivElement = found;

let state: GameState = { phase: "opening", level: 0, target: [], candidates: [], answer: [], memorizeSecondsLeft: 0, recallSecondsLeft: 0, outcome: null };

function paint(): void {
  app.innerHTML = render(state);
}

function tick(): void {
  if (state.phase === "memorize") state = tickMemorize(state);
  else if (state.phase === "recall") state = tickRecall(state);
  else return;
  paint();
  if (state.phase === "success") scheduleAdvance();
}

function scheduleAdvance(): void {
  window.setTimeout(() => {
    state = advance(state);
    paint();
  }, 900);
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "start") {
    state = startGame();
    paint();
    return;
  }
  const [kind, cardId] = action.split(":");
  if (kind === "select" && cardId) {
    state = selectCard(state, cardId);
    paint();
    if (state.phase === "success") scheduleAdvance();
  } else if (kind === "deselect" && cardId) {
    state = deselectCard(state, cardId);
    paint();
  }
});

paint();
window.setInterval(tick, 1000);
