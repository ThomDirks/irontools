import { test } from "node:test";
import assert from "node:assert/strict";
import { pearlsPerSearch, runeStack, RUNES, simulate as gotr } from "../src/tools/gotr/calc.js";
import { RUNES as ARC, hourly, simulate as arceuus } from "../src/tools/arceuus/calc.js";
import { WRECKS, ALCHABLE, defaultAlch, hour } from "../src/tools/salvage/calc.js";
import { xpForLevel } from "../src/lib/xp.js";

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("GOTR pearls a search follow the Rewards Guardian table", () => {
  close(pearlsPerSearch(true), 18 / 125 * 15, 1e-9);   // 2.16
  close(pearlsPerSearch(false), 18 / 140 * 15, 1e-9);  // 1.93
});

test("GOTR rune stacks shrink below the rune's level, but not under a tenth", () => {
  const nature = RUNES.find(r => r.name === "Nature rune");
  assert.equal(runeStack(nature, 44), 89);
  close(runeStack(nature, 40), 89 * Math.pow(40 / 44, 4), 1e-9);
  close(runeStack(nature, 22), 8.9, 1e-9);
});

test("GOTR buys the outfit in order and never overshoots the pearls", () => {
  const r = gotr({ startXp: xpForLevel(50), goal: { type: "rewards" }, gamesPerHour: 5, searchesPerGame: 6, pouches: true, startPearls: 0,
    owned: [], wishlist: ["hat", "top", "bottoms", "boots"] });
  assert.deepEqual(r.events.map(e => e.reward.id), ["hat", "top", "bottoms", "boots"]);
  close(r.pearlsEarned, 1350, 0.01);                      // just enough
  close(r.searches, 1350 / 2.16, 0.01);
});

test("Blood and soul runes an hour match the wiki's money making figures", () => {
  const blood = ARC.find(r => r.id === "blood"), soul = ARC.find(r => r.id === "soul");
  close(hourly(blood, {}).runes, 1473.90, 0.01);
  close(hourly(soul, {}).runes, 1450.95, 0.01);
  close(hourly(blood, { outfit: 4 }).runes, 1473.90 * 1.6, 0.02);
  close(hourly(blood, { essence: true }).fragments, 1412.49, 0.01);
  close(hourly(blood, { outfit: 4, essence: true }).runes, 1412.49 * 2.1, 0.03);
});

test("Arceuus auto plan moves to soul runes at 90", () => {
  const r = arceuus({ startXp: xpForLevel(80), goal: { type: "level", value: 95 }, choice: "auto", outfit: 0 });
  assert.deepEqual(r.rows.map(x => x.rune.id), ["blood", "soul"]);
  assert.equal(r.rows[0].toLv, 90);
  close(r.rows[0].hours, (xpForLevel(90) - xpForLevel(80)) / 36000, 1e-9);
});

test("Salvage loot tables add up and default alchs match the wiki guide", () => {
  for (const w of WRECKS) {
    const main = w.rows.filter(r => r.p > 0.001 || !/bottle|clue|sextant|compass|locket|block|knife|coin\b|mirror|doll|paint|barrel|nails/i.test(r.n));
    assert.ok(main.length > 5, w.id);
  }
  const merc = WRECKS.find(w => w.id === "mercenary");
  const set = new Set(ALCHABLE.filter(defaultAlch).map(i => i.name));
  const h = hour(merc, { kph: 1, share: 0.5, deck: 4, alch: n => set.has(n) });
  close(h.casts, (300 + 200 + 200 + 100 + 100 + 10) / 2440 + 1 / 700, 1e-6);
  close(h.sailing, 138 * (0.5 + 0.5 * 0.4) + 63.5, 1e-9);
});
