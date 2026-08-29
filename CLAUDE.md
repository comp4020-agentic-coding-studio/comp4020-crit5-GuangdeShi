# COMP4020 prototype

Your starter repo for a COMP4020 prototype: a static site in HTML/CSS/TypeScript
that builds to plain HTML/CSS/JS and deploys to GitHub Pages. The deployed site
is what gets marked, not this repo.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## The link-preview card

`public/card.png` (1200x630) is the image a shared link shows; `index.html`'s
head points at it. Replace it and the `description` meta, and copy the head
block into any new page. The card URL resolves against the page that names it,
like any link --- `./card.png` is wrong one directory down, and nothing in CI
checks it, so the deployed head is the only place a broken one shows up.

## The checks

`pnpm check` runs them, and `pnpm check:evidence` is the extra gate before you
ship. CI runs the same plus links, secrets and the deploy.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` are in this repo and
say what they are for.

## This week: C5, "A game" --- Recall

The published spec at
[crits/05-game](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/crits/05-game/)
is the source of truth --- re-read it before changing scope, not this summary.

Recall is a card sequence memory game: memorise a short face-up sequence,
watch it flip face-down, then reconstruct it in order by clicking candidate
cards out of a larger face-down-then-face-up pool before a second timer runs
out.

- **No tutorial, anywhere.** No how-to-play modal, no instructions page,
  nothing in the README standing in for either. The opening screen (one large
  face-down card, visibly interactive on hover) has to make the first move
  obvious on its own, and the interface teaches everything after that through
  affordance and feedback, not text.
- **One mechanic: click cards.** Selecting a candidate and undoing a placed
  card both use the same click gesture --- no separate undo button, no drag
  requirement, no keyboard controls, no second mechanic layered on top.
- **The player must be able to lose.** A wrong sequence or an expired recall
  timer both end the run. Losing is a real, reachable outcome, not just a
  possibility in principle.
- **A stranger reaches an ending inside five minutes.** That bounds both the
  difficulty curve and the timers --- a first-time player should be able to
  lose or reach Level 12 well within that window.
- **Level configuration lives in one place.** Target/candidate counts and
  both timers per level are data in a single structure, not scattered through
  the game logic --- see `spec/README.md` for why sensors and rules need to
  stay easy to rebalance after playtesting.
- **One real game rule has a focused automated test.** Exact-identity,
  exact-order sequence comparison is that rule; see `spec/crit-5.test.ts`.
  Keep this test about the rule, not the DOM.
- **A real playtesting change is still owed.** At least one entry in
  `PROCESS.md` / `reflections/crit-5.md` must cite a change that came from
  actually playing the finished game, not from inspecting the code. Don't
  fabricate this before it happens.

## This file is yours

A starting point, not a rulebook: what you add to it is the harness, and the
harness is assessed. This file and the sensors you wire into `check` carry
across the course --- both come with you into next week's repo. The prototype
doesn't: source, and the tests answering this week's published spec, stay
behind. `spec/README.md` draws the line.
