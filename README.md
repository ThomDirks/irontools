# Iron Tools

Skilling planners for Old School RuneScape ironmen, built on the OSRS Wiki's numbers.

| Calculator | Skill | What it does |
|---|---|---|
| Mahogany Homes | Construction | Contracts to a level, or what your planks and logs get you. Plank costs (sawmill or Plank Make), Miscellania days for teak and mahogany, rewards bought along the way. |
| Hosidius Kitchen | Cooking | Cook your bank, or raw fish needed for a level. Burn rates per level for fire, range, Lumbridge and Hosidius, with or without gauntlets. |
| Golem crafting | Crafting | Furs and sunstone into golems. |
| Tithe Farm | Farming | Sacks to a level, switching seeds at 54 and 74, rewards bought in your order with the hour each arrives. |
| Herb runs | Farming | Herbs and xp per patch with compost, secateurs, diaries and disease. Plant your seeds, reach a level, or plan a number of runs. Sends herbs to Mixology. |
| Vale Totems | Fletching | Logs into rounds, offerings and research points. |
| Mixology | Herblore | Seeds and bank herbs into paste, potions and resin. |
| Prayer | Prayer | Bones through the Chaos altar, the Ectofuntus or the libation bowl, with zealot's robes. |
| Giants' Foundry | Smithing | Alloys, moulds and shop-bought metal. |
| Blast Furnace | Smithing | Your ore into bars and levels, or bars to a level, with coal, coffer, foreman and Ordan's prices. |
| Miscellania | Kingdom | The in-game worker screen: set workers, approval and coffer, see what you collect after any number of days. |

Reward lists (Tithe Farm, Mahogany Homes) can be dragged into any order; wanted rewards are bought top to bottom.

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
- Miscellania follows the wiki's calculator module (resource points from the coffer payment and approval, approval decay), except "teak and mahogany", which uses the 121 each the wiki observes rather than the module's 131.
- Herb yields follow the wiki's herb farming calculator, which rounds each term down. One difference: planting xp is counted for dead patches too, as the wiki's seed table says you get it when clearing them.

## Group bank

The sidebar can load your group's items from the [Group Ironmen Tracker](https://groupiron.men) with the group name and token. Each calculator with a "what's in the bank" section then gets a "Fill from group bank" button (it replaces what's typed). Tick which members count, including the shared bank.

The name and token stay in the page's memory only: nothing is written to localStorage, cookies or the URL, and reloading forgets them. The request goes from the browser straight to groupiron.men, whose API accepts calls from other sites. Item ids come from the OSRS Wiki (`src/data/items.json`).

Hiscores come through [Wise Old Man](https://wiseoldman.net), which reads the official hiscores and allows browser requests.
