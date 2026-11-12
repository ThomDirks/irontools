import data from "../../data/mahogany.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const TIERS = data.tiers;
export const PLANKS = data.planks;
export const REWARDS = data.rewards;
export const MISC = data.miscellania;
export const PLANK_MAKE = data.plankMake;
export const TYPES = ["plank", "oak", "teak", "mahogany"];

export function outfitBoost(owned) {
  const pieces = REWARDS.filter(r => r.outfit);
  let b = 0;
  for (const p of pieces) if (owned.has(p.id)) b += p.xpBoost;
  if (pieces.every(p => owned.has(p.id))) b += data.outfitSetBonus;
  return b;
}

const PACE = { low: 0, mid: 0.5, high: 1 };

/** Contracts an hour from the wiki's xp/hr range for the tier. */
export function contractsPerHour(tier, sack, pace = "mid") {
  const [lo, hi] = sack ? tier.xpHrSack : tier.xpHr;
  return (lo + (hi - lo) * PACE[pace]) / tier.xp;
}

function bestTier(level, have) {
  let best = null;
  for (const t of TIERS) {
    if (level < t.level) continue;
    if (have && have[t.plank] < t.planks) continue;
    best = t;
  }
  return best;
}

/**
 * Contract by contract. In "target" mode it runs until the goal and counts
 * what it used; in "bank" mode it spends the planks you have (logs count once
 * they are turned into planks), always on the best tier you can stock.
 */
export function simulate(o) {
  const owned = new Set(o.owned || []);
  const queue = (o.wishlist || []).filter(id => !owned.has(id));
  const bank = o.mode === "bank";
  const have = bank ? Object.fromEntries(TYPES.map(k => [k, (o.planks?.[k] || 0) + (o.logs?.[k] || 0)])) : null;

  let xp = Math.min(MAX_XP, o.startXp), points = o.startPoints || 0;
  const goalXp = bank ? Infinity : o.goal.type === "level" ? xpForLevel(o.goal.value) : Math.min(MAX_XP, o.goal.value);

  const used = Object.fromEntries(TYPES.map(k => [k, 0]));
  const byTier = {};
  const events = [];
  let contracts = 0, hours = 0, bars = 0, tier = null, blocked = null;

  while (contracts < 100000 && xp < goalXp) {
    const level = levelFromXp(xp);
    let pick;
    if (o.tier === "auto") pick = bestTier(level, have);
    else {
      pick = TIERS.find(t => t.id === o.tier);
      if (level < pick.level) { blocked = pick; break; }
      if (have && have[pick.plank] < pick.planks) pick = null;
    }
    if (!pick) break;
    if (!tier || pick.id !== tier.id) {
      if (tier) events.push({ contract: contracts, hours, level, kind: "tier", what: pick.name + " contracts", sub: PLANKS[pick.plank].name.toLowerCase() + "s" });
      tier = pick;
    }
    const sack = owned.has("sack");
    const gained = tier.xp * (1 + outfitBoost(owned));
    xp = Math.min(MAX_XP, xp + gained);
    contracts++;
    hours += 1 / contractsPerHour(tier, sack, o.pace);
    used[tier.plank] += tier.planks;
    bars += tier.bars;
    if (have) have[tier.plank] -= tier.planks;
    points += tier.points;
    const b = (byTier[tier.id] ||= { tier, contracts: 0, xp: 0 });
    b.contracts++; b.xp += gained;

    while (queue.length) {
      const r = REWARDS.find(x => x.id === queue[0]);
      if (points < r.cost) break;
      points -= r.cost; owned.add(r.id); queue.shift();
      events.push({ contract: contracts, hours, level: levelFromXp(xp), kind: "reward", what: r.name, reward: r });
    }
  }

  const planksNeeded = Object.fromEntries(TYPES.map(k => [k, Math.ceil(used[k] - 1e-9)]));
  return {
    contracts, hours, bars: Math.ceil(bars), planksNeeded,
    startXp: o.startXp, endXp: xp, gained: xp - o.startXp,
    points, events, byTier: Object.values(byTier), owned, unbought: queue, blocked,
    leftover: have
  };
}

/**
 * Where the planks come from. Planks in the bank go first, then logs you
 * already have; anything still missing is logs to gather. Teak and mahogany
 * can come from Miscellania.
 */
export function supply(planksNeeded, bankPlanks, bankLogs, method) {
  const rows = [];
  let coins = 0, casts = 0;
  for (const k of TYPES) {
    const need = planksNeeded[k] || 0;
    if (!need) continue;
    const fromPlanks = Math.min(need, bankPlanks[k] || 0);
    const toMake = need - fromPlanks;
    const fromLogs = Math.min(toMake, bankLogs[k] || 0);
    const gather = toMake - fromLogs;
    const price = method === "plankMake" ? PLANKS[k].plankMake : PLANKS[k].sawmill;
    const cost = toMake * price;
    coins += cost; casts += toMake;
    rows.push({ type: k, need, fromPlanks, fromLogs, gather, toMake, price, cost });
  }
  const runes = method === "plankMake"
    ? Object.fromEntries(Object.entries(PLANK_MAKE.runes).map(([r, n]) => [r, n * casts])) : null;
  return {
    rows, coins, casts, runes,
    magicXp: method === "plankMake" ? casts * PLANK_MAKE.xp : 0,
    castHours: method === "plankMake" ? casts / PLANK_MAKE.perHour : 0
  };
}

/** Days of Miscellania to gather the teak and mahogany logs still missing. */
export function kingdom(teak, mahogany) {
  if (teak <= 0 && mahogany <= 0) return null;
  const o = MISC.options;
  const teakDays = teak > 0 ? Math.ceil(teak / o.teak.teak) : 0;
  const mahoDays = mahogany > 0 ? Math.ceil(mahogany / o.mahogany.mahogany) : 0;
  // One type at a time, or the "both" setting if it finishes sooner.
  const split = teakDays + mahoDays;
  const both = teak > 0 && mahogany > 0 ? Math.ceil(Math.max(teak / o.both.teak, mahogany / o.both.mahogany)) : Infinity;
  const useBoth = both < split;
  const d = useBoth ? both : split;
  return {
    days: d, coffer: d * MISC.dailyWage, useBoth,
    teakDays: useBoth ? 0 : teakDays, mahoDays: useBoth ? 0 : mahoDays
  };
}
