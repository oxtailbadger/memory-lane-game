# TODO / Roadmap

Loose backlog for Memory Lane. Not a commitment — a place to park ideas so we
don't lose them between sessions. Check items off as they ship.

## Next up (personalize for Mike)

- [ ] **Swap puzzle art for real photos / scenes Mike knows** — a place he
      lived, a pet, a monument he visited. The `PUZZLES` array in `src/App.jsx`
      has a TODO comment; a photo can be dropped in as the `svg` field's data
      source, keeping the same 3×3 slice approach.
- [ ] **Swap "Name the Place" seed questions for Mike's own photos + locations.**
      The seven personal places are grouped and commented at the end of
      `PLACE_QUESTIONS` ("Places close to home for Mike") for easy replacement.
- [ ] Consider a photo-based Matching game (pairs of family photos).

## Code health

- [ ] **Refactor `GuessYearGame` + `NamePlaceGame` into one shared `QuizGame`
      component** before adding a third quiz-style game (see DECISIONS.md).
- [ ] Consider splitting `src/App.jsx` into per-game files if it keeps growing.

## New game / feature ideas

- [ ] More question banks / rotating themes for Guess the Year and Name the Place.
- [ ] Optional larger-text toggle or high-contrast switch in a simple settings area.
- [ ] Gentle audio: a soft chime on a correct match (with an easy mute).
- [ ] Remember best scores per game (localStorage) — framed encouragingly.
- [ ] A "Word Play" third mode, or a simple trivia/reminiscence prompt game.

## Polish

- [ ] Custom PWA icon that better reflects the app (current one is a generic
      sunrise-over-hills made during scaffolding).
- [ ] Review each puzzle SVG for detail that reads well when sliced into 9 pieces.
- [ ] Test the installed PWA on Mike's actual device (add-to-home-screen flow,
      offline load).

## Done (for reference)

- [x] Scaffold as installable PWA (Vite + React).
- [x] Rotating personalized greetings for Mike.
- [x] Guess the Year (30-question bank, 8 per round).
- [x] Name the Place (30 places incl. Mike's, 8 per round).
- [x] Continue-button pacing on all quizzes; 2.5s Matching flips.
- [x] Fix puzzle tile alignment; add flying Superhero puzzle.
- [x] Deploy to Vercel with auto-deploy on push to `main`.
