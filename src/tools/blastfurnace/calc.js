import data from "../../data/blastfurnace.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const BARS = data.bars;
export const ORES = data.ores;
export const ORE_IDS = Object.keys(data.ores);

const PACE = { low: 0, mid: 0.5, high: 1 };
const mid = (r, pace) => r[0] + (r[1] - r[0]) * PACE[pace];

export function barXp(bar, o) {
  return bar.id === "gold" && o.gauntlets ? bar.xpGauntlets : bar.xp;
}
export function barsPerHour(bar, o) {
  if (bar.id === "gold" && o.gauntlets) return mid(bar.perHourGauntlets, o.pace);
  if (o.coalBag && bar.perHourBag) return mid(bar.perHourBag, o.pace);
  return mid(bar.perHour, o.pace);
}

/** How many of a bar the ores (and coal) on hand cover. */
function canMake(bar, stock) {
  let n = Infinity;
  for (const [ore, q] of Object.entries(bar.ores)) n = Math.min(n, Math.floor((stock[ore] || 0) / q));
  if (bar.coal) n = Math.min(n, Math.floor((stock.coal || 0) / bar.coal));
  return n;
}

/**
 * Smelt the bank. The highest bar you can make goes first, so iron ore with
 * coal becomes steel, not iron bars. If a better bar shares ores but is still
 * locked, only enough of the lower bar is smelted to unlock it.
 */
export function smeltBank(startXp, bank, o) {
  const stock = { ...bank };
  let xp = Math.min(MAX_XP, startXp), hours = 0;
  const made = new Map();
  for (let guard = 0; guard < 200; guard++) {
    const level = levelFromXp(xp);
    const ready = BARS.filter(b => canMake(b, stock) > 0);
    const unlocked = ready.filter(b => level >= b.level).sort((a, b) => b.level - a.level);
    if (!unlocked.length) break;
    const lockedRivals = ready.filter(b => level < b.level);
    let bar = unlocked[0], n = canMake(bar, stock);
    const shares = (x, y) => Object.keys(x.ores).some(k => k in y.ores) || (x.coal && y.coal);
    const rival = lockedRivals.filter(r => shares(r, bar)).sort((x, y) => x.level - y.level)[0];
    if (rival) n = Math.min(n, Math.max(1, Math.ceil((xpForLevel(rival.level) - xp) / barXp(bar, o))));
    for (const [ore, q] of Object.entries(bar.ores)) stock[ore] -= n * q;
    if (bar.coal) stock.coal -= n * bar.coal;
    const gained = n * barXp(bar, o);
    const m = made.get(bar.id) || { bar, n: 0, xp: 0, coal: 0, fromLv: level };
    m.n += n; m.xp += gained; m.coal += n * bar.coal;
    xp = Math.min(MAX_XP, xp + gained);
    m.toLv = levelFromXp(xp);
    made.set(bar.id, m);
    hours += n / barsPerHour(bar, o);
  }
  const level = levelFromXp(xp);
  const locked = BARS.filter(b => canMake(b, stock) > 0 && level < b.level).map(b => ({ bar: b, n: canMake(b, stock) }));
  const rows = [...made.values()].sort((a, b) => a.fromLv - b.fromLv);
  return { rows, locked, leftover: stock, startXp, endXp: xp, gained: xp - startXp, hours };
}

/**
 * Bars to a level. "auto" smelts the best xp-an-hour bar your level allows
 * from the ones you picked, switching as better ones unlock.
 */
export function planToTarget(startXp, target, o) {
  let xp = Math.min(MAX_XP, startXp);
  const goal = xpForLevel(target);
  const segs = [];
  while (xp < goal) {
    const level = levelFromXp(xp);
    const pool = BARS.filter(b => level >= b.level && (o.bar === "auto" ? o.allowed.includes(b.id) : b.id === o.bar));
    if (!pool.length) return { segs, startXp, endXp: xp, blocked: level };
    const best = pool.reduce((a, b) => (barXp(b, o) * barsPerHour(b, o) > barXp(a, o) * barsPerHour(a, o) ? b : a));
    const end = level >= 99 ? goal : Math.min(goal, xpForLevel(level + 1));
    const n = Math.ceil((end - xp) / barXp(best, o));
    const last = segs[segs.length - 1];
    if (last && last.bar.id === best.id) { last.n += n; last.toLv = levelFromXp(xp + n * barXp(best, o)); }
    else segs.push({ bar: best, n, fromLv: level, toLv: levelFromXp(xp + n * barXp(best, o)) });
    xp += n * barXp(best, o);
  }
  for (const s of segs) s.hours = s.n / barsPerHour(s.bar, o);
  return { segs, startXp, endXp: xp };
}

/** Ores and coal for a list of {bar, n}. */
export function materials(list) {
  const need = {};
  for (const { bar, n } of list) {
    for (const [ore, q] of Object.entries(bar.ores)) need[ore] = (need[ore] || 0) + n * q;
    if (bar.coal) need.coal = (need.coal || 0) + n * bar.coal;
  }
  return need;
}

/** Coffer and foreman fee for the time spent. */
export function fees(hours, level) {
  const foreman = level < data.foremanFreeLevel ? hours * data.foremanPerHour : 0;
  return { coffer: hours * data.cofferPerHour, foreman };
}
