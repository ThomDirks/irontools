// Checks the calculators against figures the OSRS Wiki states directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { xpForLevel, levelFromXp } from "../src/lib/xp.js";
import * as tithe from "../src/tools/tithe/calc.js";
import * as mh from "../src/tools/mahogany/calc.js";
import * as cook from "../src/tools/cooking/calc.js";

test("xp table", () => {
  assert.equal(xpForLevel(99), 13034431);
  assert.equal(xpForLevel(92), 6517253);
  assert.equal(levelFromXp(13034430), 98);
});

test("tithe: a full sack matches the wiki (9,660 / 22,540 / 37,030)", () => {
  assert.deepEqual(tithe.SEEDS.map(tithe.sackXp), [9660, 22540, 37030]);
});

test("tithe: 35 points per 100 fruit, outfit is 2.5%", () => {
  assert.equal(tithe.sackPoints(), 35);
  assert.ok(Math.abs(tithe.outfitBoost(new Set(["hat", "top", "legs", "boots"])) - 0.025) < 1e-9);
});

test("tithe: seeds switch at 54 and 74, outfit bought in order", () => {
  const r = tithe.simulate({ startXp: xpForLevel(34), goal: { type: "level", value: 99 }, seed: "auto",
    wishlist: ["hat", "top", "legs", "boots"], owned: [] });
  const switches = r.events.filter(e => e.kind === "seed").map(e => [e.what, e.level]);
  assert.deepEqual(switches, [["Bologano", 54], ["Logavano", 74]]);
  const buys = r.events.filter(e => e.kind === "reward").map(e => e.what);
  assert.deepEqual(buys, ["Farmer's strawhat", "Farmer's jacket", "Farmer's boro trousers", "Farmer's boots"]);
  assert.ok(r.endXp >= xpForLevel(99));
});

test("mahogany: wiki outfit xp is 2.5% on top", () => {
  const t = mh.TIERS.find(t => t.id === "expert");
  assert.ok(Math.abs(t.xp * 1.025 - 4488.3) < 0.1);
});

test("mahogany: tiers move up with level", () => {
  const r = mh.simulate({ mode: "target", startXp: xpForLevel(1), goal: { type: "level", value: 80 },
    tier: "auto", pace: "mid", owned: [], wishlist: ["sack"] });
  const tiers = r.events.filter(e => e.kind === "tier");
  assert.deepEqual(tiers.map(e => e.what), ["Novice contracts", "Adept contracts", "Expert contracts"]);
  // A switch happens on the first contract after the unlock (a contract can skip a level).
  tiers.forEach((e, i) => assert.ok(e.level >= [20, 50, 70][i] && e.level <= [21, 51, 71][i]));
  assert.ok(r.planksNeeded.plank > 0 && r.planksNeeded.mahogany > 0);
});

test("mahogany: bank mode stops when planks run out", () => {
  const r = mh.simulate({ mode: "bank", startXp: xpForLevel(70), tier: "auto", pace: "mid",
    planks: { mahogany: 1285 }, logs: {}, owned: [], wishlist: [] });
  assert.equal(r.contracts, 100);
});

test("miscellania: 301 teak a day", () => {
  assert.equal(mh.kingdom(602, 0).days, 2);
  assert.equal(mh.kingdom(0, 224).days, 2);
});

test("cooking: stop-burn levels match the wiki", () => {
  const f = id => cook.FISH.find(x => x.id === id);
  // Wiki: sharks stop burning at 94 with gauntlets, 84 at Hosidius (elite) with gauntlets.
  assert.equal(cook.stopBurnLevel(f("shark"), "range", true), 94);
  assert.equal(cook.stopBurnLevel(f("shark"), "hos10", true), 84);
  // Lobster stops at 74 on a fire or range (Cooking/Burn level).
  assert.equal(cook.stopBurnLevel(f("lobster"), "range", false), 74);
  // Swordfish 86 fire / 80 range / 76 Hosidius; karambwan 99 / 93 / 87.
  assert.equal(cook.stopBurnLevel(f("swordfish"), "fire", false), 86);
  assert.equal(cook.stopBurnLevel(f("swordfish"), "range", false), 80);
  assert.equal(cook.stopBurnLevel(f("swordfish"), "hos5", false), 76);
  assert.equal(cook.stopBurnLevel(f("karambwan"), "range", false), 99);
  assert.equal(cook.stopBurnLevel(f("karambwan"), "hos5", false), 93);
  // The burn-level table says 87 here; it truncates each term, while the
  // wiki's current formula module rounds once, which gives 86.
  assert.equal(cook.stopBurnLevel(f("karambwan"), "hos10", false), 86);
  assert.equal(cook.stopBurnLevel(f("anglerfish"), "hos10", true), 87);
});

test("cooking: bank and target plans are consistent", () => {
  const plan = cook.planToTarget(xpForLevel(80), xpForLevel(90), ["shark"], "range", true);
  const raw = plan.segs.reduce((s, x) => s + x.raw, 0);
  const back = cook.cookBank(xpForLevel(80), { shark: raw }, "range", true);
  assert.ok(back.endXp >= xpForLevel(90) - 300);
});
