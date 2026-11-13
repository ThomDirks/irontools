import data from "../../data/gotr.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const REWARDS = data.rewards;
export const RUNES = data.runes;
export const RARE = data.rare;
export const LEVEL = data.level;

export function rateAt(level) {
  let r = data.rates[0];
  for (const x of data.rates) if (level >= x.from) r = x;
  return r;
}

const den = pouches => (pouches ? data.denominator.pouches : data.denominator.missing);

export function pearlsPerSearch(pouches) {
  return data.pearls.weight / den(pouches) * data.pearls.avg;
}

/** Average stack of a rune from one roll, cut down below its level. */
export function runeStack(rune, level) {
  const base = (rune.min + rune.max) / 2;
  if (level >= rune.level) return base;
  return Math.max(base / 10, base * Math.pow(level / rune.level, 4));
}

/** Expected runes of each kind from one search at a level. */
export function runesPerSearch(level, pouches) {
  const d = den(pouches);
  return RUNES.map(r => ({ rune: r, n: r.weight / d * runeStack(r, level) }));
}

/**
 * Game by game until the goal. Pearls buy the wanted rewards top to bottom
 * the moment there are enough. Goals: a level, an xp total, or the rewards.
 */
export function simulate(o) {
  const perHour = Math.max(0.1, o.gamesPerHour) * Math.max(0, Math.min(data.maxSearchesYew, o.searchesPerGame));
  const pps = pearlsPerSearch(o.pouches);
  let xp = Math.min(MAX_XP, o.startXp), hours = 0, searches = 0, pearls = o.startPearls || 0, earned = 0;
  const queue = o.wishlist.filter(id => !o.owned.includes(id)).map(id => REWARDS.find(r => r.id === id));
  const events = [];
  const runes = new Map(RUNES.map(r => [r.name, 0]));
  const xpBy = { crafting: 0, mining: 0 };
  const goalXp = o.goal.type === "level" ? xpForLevel(Math.min(99, o.goal.value))
    : o.goal.type === "xp" ? Math.min(MAX_XP, o.goal.value) : Infinity;
  const buy = level => {
    while (queue.length && pearls >= queue[0].cost) {
      const r = queue.shift();
      pearls -= r.cost;
      events.push({ reward: r, hours, searches, level });
    }
  };
  buy(levelFromXp(xp));

  for (let guard = 0; guard < 5000; guard++) {
    if (o.goal.type === "rewards" ? !queue.length : xp >= goalXp) break;
    if (perHour <= 0) break;
    const level = levelFromXp(xp);
    const rate = rateAt(level);
    // run until the next level, the goal, or the next reward, whichever is first
    const nextXp = Math.min(goalXp, level >= 99 ? MAX_XP : xpForLevel(level + 1));
    let h = xp >= MAX_XP ? Infinity : (nextXp - xp) / rate.rc;
    if (queue.length) h = Math.min(h, Math.max(0, queue[0].cost - pearls) / pps / perHour);
    if (!isFinite(h)) {
      if (o.goal.type !== "rewards" || !queue.length) break;
      h = Math.max(0, queue[0].cost - pearls) / pps / perHour;
    }
    h = Math.max(h, 1e-9);
    const s = h * perHour;
    for (const r of runesPerSearch(level, o.pouches)) runes.set(r.rune.name, runes.get(r.rune.name) + r.n * s);
    xp = Math.min(MAX_XP, xp + h * rate.rc);
    xpBy.crafting += h * rate.crafting;
    xpBy.mining += h * rate.mining;
    hours += h; searches += s; pearls += s * pps; earned += s * pps;
    // guard against float dust leaving a reward a hair short
    if (queue.length && queue[0].cost - pearls < 1e-6) pearls = Math.max(pearls, queue[0].cost);
    buy(levelFromXp(xp));
  }

  const rare = RARE.map(r => ({ ...r, expected: searches / r.rate, chance: 1 - Math.pow(1 - 1 / r.rate, searches) }));
  return {
    startXp: o.startXp, endXp: xp, hours, searches, games: hours * Math.max(0.1, o.gamesPerHour),
    pearlsEarned: earned, pearlsLeft: pearls, events, unbought: queue.map(r => r.id),
    runes: [...runes].map(([name, n]) => ({ name, n })), xpBy, rare, perHour, pps
  };
}
