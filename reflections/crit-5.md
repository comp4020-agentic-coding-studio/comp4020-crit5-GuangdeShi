# Crit 5 reflection

## What was the breakthrough that moved the work forward?

The breakthrough was realising a green test suite and a good game are two
different claims. My first version had every rule working --- sequence
validation, both timers, every failure state, level progression all the way
to a win --- and I genuinely thought that meant it was done. Then I played it
and could clear the early levels by remembering three ranks, "5, 6, 7," and
ignoring suit and order completely, because the candidate pool was small
enough that I didn't need to. No test could have caught that, because "too
easy" isn't a rule violation, it's a judgement about the experience, and the
only way to reach it was to actually play. The tests checked whether the game
worked; playing the game showed whether the design worked. The card visuals
taught me the same lesson from a different angle: I asked for real
playing-card conventions, got a technically faithful redraw, and it still
looked wrong side by side in a gallery --- J/Q/K never read as face cards no
matter how precisely I specified pip counts and corner indices. Some
questions only a playtest or a look at the rendered result can answer.

## What did this work change about who I want to be as a software developer?

It changed how I direct an agent when something isn't good enough yet. My
first instinct used to be to just ask again, more insistently. What actually
worked was changing the constraint or the approach: swapping a flat candidate
pool for a ramping one instead of nudging the timer again, and eventually
swapping hand-drawn cards for a vendored open-source deck instead of asking
for another redraw. The difficulty curve alone went from a small pool, to an
overcorrection to the full 52 cards, back down to 26, then to a smoother
ramp starting at 16 --- not a straight line, but each pass told me something
real about where the actual problem was. I don't think I was just fixing
bugs along the way; I was correcting the agent's, and my own, assumption
about what "good enough" meant. I want to keep treating my own judgement
from actually playing and looking at the thing as evidence that matters, not
a rubber stamp I add after the check is already green.
