import data from "../../data/tithe.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const SEEDS = data.seeds;
export const REWARDS = data.rewards;
export const SACK = data.sack;

/** Experience for one full sack of 100 fruit, before the outfit bonus. */
export function sackXp(seed) {
  const { size, doubleFrom } = SACK;
  const normal = doubleFrom - 1;            // fruit 1..74
  const doubled = size - normal;            // fruit 75..100
  return size * seed.harvestXp + normal * seed.depositXp + doubled * 2 * seed.depositXp + seed.bonusXp;
}

/** Points for one sack: one per three fruit, plus two for the 100th. */
export function sackPoints() {
  return Math.floor(SACK.size / 3) * SACK.pointsPerThreeFruit + SACK.bonusPointsAt100;
}

export function outfitBoost(owned, rewards = REWARDS, setBonus = data.outfitSetBonus) {
  const pieces = rewards.filter(r => r.outfit);
  let b = 0;
  for (const p of pieces) if (owned.has(p.id)) b += p.xpBoost;
  if (pieces.every(p => owned.has(p.id))) b += setBonus;
  return b;
}

export function bestSeed(level) {
  let best = null;
  for (const s of SEEDS) if (level >= s.level) best = s;
  return best;
}

/**
 * Run sack by sack. The seed follows your level (or stays fixed), rewards are
 * bought in the order given as soon as the points are there, and outfit
 * pieces start boosting experience from the next sack.
 */
export function simulate(o) {
  const owned = new Set(o.owned || []);
  const queue = (o.wishlist || []).filter(id => !owned.has(id));
  let xp = Math.min(MAX_XP, o.startXp);
  let points = Math.min(SACK.pointsCap, o.startPoints || 0);
  const minutes = o.minutesPer100 || data.pace.minutesPer100;
  const perSack = sackPoints();

  const goalXp = o.goal.type === "level" ? xpForLevel(o.goal.value)
    : o.goal.type === "xp" ? Math.min(MAX_XP, o.goal.value) : Infinity;
  const goalRuns = o.goal.type === "runs" ? Math.max(0, Math.round(o.goal.value)) : Infinity;
  const goalRewards = o.goal.type === "rewards";

  const events = [];
  const bySeed = {};
  let runs = 0, earned = 0, seed = null, blocked = null;

  while (runs < 50000) {
    if (xp >= goalXp || runs >= goalRuns) break;
    if (goalRewards && !queue.length) break;
    const level = levelFromXp(xp);
    const pick = o.seed === "auto" ? bestSeed(level) : SEEDS.find(s => s.id === o.seed);
    if (!pick || level < pick.level) { blocked = pick || SEEDS[0]; break; }
    if (!seed || pick.id !== seed.id) {
      if (seed) events.push({ run: runs, level, kind: "seed", what: pick.name, sub: "level " + pick.level });
      seed = pick;
    }
    const boost = outfitBoost(owned);
    const gained = sackXp(seed) * (1 + boost);
    xp = Math.min(MAX_XP, xp + gained);
    runs++;
    const add = Math.min(perSack, SACK.pointsCap - points);
    points += add; earned += add;
    const b = (bySeed[seed.id] ||= { seed, runs: 0, xp: 0 });
    b.runs++; b.xp += gained;

    while (queue.length) {
      const r = REWARDS.find(x => x.id === queue[0]);
      if (points < r.cost) break;
      points -= r.cost; owned.add(r.id); queue.shift();
      events.push({ run: runs, level: levelFromXp(xp), kind: "reward", what: r.name, reward: r });
    }
  }

  const startSeed = o.seed === "auto" ? bestSeed(levelFromXp(o.startXp)) : SEEDS.find(s => s.id === o.seed);
  return {
    runs, fruit: runs * SACK.size, hours: runs * minutes / 60,
    startXp: o.startXp, endXp: xp, gained: xp - o.startXp,
    points, earned, events, bySeed: Object.values(bySeed), startSeed,
    owned, unbought: queue, blocked, boost: outfitBoost(owned)
  };
}
