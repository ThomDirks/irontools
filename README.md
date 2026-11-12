# Iron Tools

Skilling planners for Old School RuneScape ironmen, built on the OSRS Wiki's numbers.

| Calculator | Skill | What it does |
|---|---|---|
| Mahogany Homes | Construction | Contracts to a level, or what your planks and logs get you. Plank costs (sawmill or Plank Make), Miscellania days for teak and mahogany, rewards bought along the way. |
| Cooking | Cooking | Cook your bank, or raw fish needed for a level. Burn rates per level for fire, range, Lumbridge and Hosidius, with or without gauntlets. |
| Golem crafting | Crafting | Furs and sunstone into golems. |
| Tithe Farm | Farming | Sacks to a level, switching seeds at 54 and 74, rewards bought as points come in. |
| Vale Totems | Fletching | Logs into rounds, offerings and research points. |
| Mixology | Herblore | Seeds and bank herbs into paste, potions and resin. |
| Giants' Foundry | Smithing | Alloys, moulds and shop-bought metal. |

## Running it

```sh
npm install
npm run dev      # local dev server
npm test         # checks the calculators against figures the wiki states
npm run build    # static site in dist/
```

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to GitHub Pages.

## Layout

```
index.html               shell: map, sidebar, intro
src/main.js              entry point
src/shell/shell.js       map camera, routing, hiscores box
src/lib/                 xp table, formatting, form binding, render helpers, hiscores
src/styles/              tokens, shell, calculator components, re-skin for older tools
src/data/*.json          game data, each file names its wiki source
src/tools/registry.js    the list of calculators and their map markers
src/tools/<id>/          one folder per calculator
tests/                   node --test checks
```

## Adding a calculator

1. Make `src/tools/<id>/` with `calc.js` (pure functions) and `index.js` exporting `html`, `mount(root)`, and optionally `subtitle` and `reqs`.
2. Put the game data in `src/data/<id>.json` with a `_source` line.
3. Add an entry to `src/tools/registry.js`. For the marker, open the site with `#calibrate` and click the map to read off x/y.
4. Add a test in `tests/` for any number the wiki states outright.

## Data notes

- Cooking success uses the wiki's own formula from Module:Skilling success chart. The wiki's burn-level table rounds differently in two places (monkfish and karambwan at Hosidius +10%, one level apart). The calculator follows the formula.
- Mahogany Homes contracts an hour come from the wiki's xp-an-hour range per tier. Treat the hours as a guide.
- Miscellania figures are the maximum daily yield: Royal Trouble done, 10 workers, 100% approval, 750k or more in the coffer.

Hiscores come through [Wise Old Man](https://wiseoldman.net), which reads the official hiscores and allows browser requests.
