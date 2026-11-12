// The four calculators added second, checked against wiki figures.
import { test } from "node:test";
import assert from "node:assert/strict";
import { xpForLevel } from "../src/lib/xp.js";
import * as herbs from "../src/tools/herbs/calc.js";
import * as prayer from "../src/tools/prayer/calc.js";
import * as bf from "../src/tools/blastfurnace/calc.js";
import * as kd from "../src/tools/kingdom/calc.js";

test("herbs: matches the wiki herb calculator (guam, level 70, ultra, secateurs: 7.65)", () => {
  const o = { compost: "ultra", secateurs: true, cape: false, anima: "none", outfit: false };
  const guam = herbs.HERBS.find(h => h.id === "guam");
  const r = herbs.patchResult(guam, 70, o, { prot: false, diary: 0, xpMult: 1 });
  assert.equal(r.herbs.toFixed(2), "7.65");
  // and the chance of death the calculator prints: 6.868%
  assert.equal((herbs.deathChance(o, false) * 100).toFixed(3), "6.868");
});

test("herbs: Mod Kieren's example, guam at 50 is 53/256 to save", () => {
  const guam = herbs.HERBS.find(h => h.id === "guam");
  assert.equal(herbs.chanceToSave(guam, 50, { compost: "none" }) * 256, 53);
});

test("prayer: chaos altar with full zealot's is 7.37x per bone", () => {
  const bones = prayer.BONES.find(b => b.id === "bones");
  const p = prayer.perBone(bones, "chaos", { zealot: 4 });
  assert.equal((p.xp / bones.xp).toFixed(2), "7.37");
  assert.equal(prayer.perBone(bones, "chaos", { zealot: 0 }).xp / bones.xp, 7);
});

test("prayer: dragon bones give 58 shards, 348 xp with sunfire wine", () => {
  const d = prayer.BONES.find(b => b.id === "dragon");
  assert.equal(prayer.perBone(d, "libation", { zealot: 0, wine: "sunfire" }).xp, 348);
});

test("blast furnace: coal is halved", () => {
  const need = bf.materials([{ bar: bf.BARS.find(b => b.id === "rune"), n: 10 }]);
  assert.deepEqual(need, { runite: 10, coal: 40 });
});

test("kingdom: one day at max matches the wiki's yields", () => {
  const pts = kd.simulateDays({ days: 1, rt: true, coffer: 7500000, approval: 100, topUpEvery: 1 }).points;
  const main = (cat, opt) => {
    const o = kd.CATEGORIES.find(c => c.id === cat).options.find(x => x.id === opt);
    return kd.categoryYield(o, 10, pts).items.filter(i => i.main).map(i => Math.round(i.qty));
  };
  assert.deepEqual(main("wood", "maple"), [892]);
  assert.deepEqual(main("mining", "coal"), [546]);
  assert.deepEqual(main("fishing", "raw"), [440, 132]);
  assert.deepEqual(main("hardwood", "teak"), [301]);
  assert.deepEqual(main("hardwood", "mahogany"), [223]);
  assert.deepEqual(main("hardwood", "both"), [121, 121]);
  assert.deepEqual(main("herbs", "flax"), [1250]);
  assert.equal(main("herbs", "herbs").reduce((a, b) => a + b, 0), 61);
});

test("kingdom: before Royal Trouble, 595 maple a day", () => {
  const pts = kd.simulateDays({ days: 1, rt: false, coffer: 5000000, approval: 100, topUpEvery: 1 }).points;
  const o = kd.CATEGORIES.find(c => c.id === "wood").options[0];
  assert.equal(kd.categoryYield(o, 10, pts).base, 595);
});
