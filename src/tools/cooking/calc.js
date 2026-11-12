import data from "../../data/cooking.json" with { type: "json" };
import { levelFromXp, xpForLevel, XP, MAX_XP } from "../../lib/xp.js";

export const FISH = data.fish;

/** The wiki's skilling success formula (Module:Skilling success chart). */
export function interp(low, high, level) {
  const L = Math.min(99, Math.max(1, level));
  const v = Math.floor(low * (99 - L) / 98 + high * (L - 1) / 98 + 0.5) + 1;
  return Math.min(Math.max(v / 256, 0), 1);
}

/** Which of the wiki's curves applies for this cooking spot and gear. */
export function curveFor(fish, method, gauntlets) {
  const c = fish.curves;
  if (method === "hos5") return (gauntlets && c.hos5g) || c.hos5;
  if (method === "hos10") return (gauntlets && c.hos10g) || c.hos10;
  if (gauntlets && c.gauntlets) return c.gauntlets;
  if (method === "lumbridge") return c.lumbridge || c.range;
  return c[method] || c.range;
}

export function successChance(fish, level, method, gauntlets) {
  if (level < fish.level) return 0;
  const [lo, hi] = curveFor(fish, method, gauntlets);
  return interp(lo, hi, level);
}

/** First level at which this fish never burns, or null if it always can. */
export function stopBurnLevel(fish, method, gauntlets) {
  for (let l = fish.level; l <= 99; l++) if (successChance(fish, l, method, gauntlets) >= 1) return l;
  return null;
}

/**
 * Cook what is in the bank, lowest level first, so the fish that burn most
 * get cooked once you are higher. Expected values, level checked per fish.
 */
export function cookBank(startXp, bank, method, gauntlets) {
  let xp = Math.min(MAX_XP, startXp);
  const order = FISH.filter(f => bank[f.id] > 0).sort((a, b) => a.level - b.level || a.xp - b.xp);
  const rows = [];
  for (const f of order) {
    let n = bank[f.id], cooked = 0, burnt = 0, gained = 0, locked = 0;
    const startLv = levelFromXp(xp);
    // Step through in level-sized chunks: the chance only changes on level-up.
    while (n > 0) {
      const lv = levelFromXp(xp);
      if (lv < f.level) { locked = n; break; }
      const p = successChance(f, lv, method, gauntlets);
      if (p <= 0) { locked = n; break; }
      const toNext = lv >= 99 ? Infinity : XP[lv + 1] - xp;
      const rawToNext = Math.max(1, Math.ceil(toNext / (p * f.xp)));
      const take = Math.min(n, rawToNext);
      cooked += take * p; burnt += take * (1 - p);
      gained += take * p * f.xp;
      xp = Math.min(MAX_XP, xp + take * p * f.xp);
      n -= take;
    }
    rows.push({ fish: f, raw: bank[f.id], cooked, burnt, gained, locked, fromLv: startLv, toLv: levelFromXp(xp) });
  }
  return { rows, startXp, endXp: xp, gained: xp - startXp };
}

/** Expected xp per raw fish at a level. */
export function xpPerRaw(fish, level, method, gauntlets) {
  return successChance(fish, level, method, gauntlets) * fish.xp;
}

/**
 * Raw fish to reach a target. At every level the plan uses whichever of the
 * allowed fish gives the most xp per raw fish (or the one you fixed), so it
 * moves up as better fish unlock and as burn rates drop.
 */
export function planToTarget(startXp, targetXp, allowed, method, gauntlets, fixed = null) {
  let xp = Math.min(MAX_XP, startXp);
  targetXp = Math.min(MAX_XP, targetXp);
  const pool = FISH.filter(f => allowed.includes(f.id));
  const segs = [];
  let blocked = null;
  while (xp < targetXp) {
    const lv = levelFromXp(xp);
    let best = null, bestV = 0;
    for (const f of (fixed ? FISH.filter(f => f.id === fixed) : pool)) {
      const v = xpPerRaw(f, lv, method, gauntlets);
      if (v > bestV + 1e-9) { best = f; bestV = v; }
    }
    if (!best) { blocked = lv; break; }
    const end = Math.min(targetXp, lv >= 99 ? targetXp : XP[lv + 1]);
    const p = successChance(best, lv, method, gauntlets);
    const raw = (end - xp) / bestV;
    const last = segs[segs.length - 1];
    if (last && last.fish.id === best.id) {
      last.raw += raw; last.burnt += raw * (1 - p); last.toLv = levelFromXp(end); last.xp += end - xp;
    } else {
      segs.push({ fish: best, fromLv: lv, toLv: levelFromXp(end), raw, burnt: raw * (1 - p), xp: end - xp });
    }
    xp = end;
  }
  for (const s of segs) { s.raw = Math.ceil(s.raw - 1e-9); s.burnt = Math.round(s.burnt); }
  return { segs, startXp, endXp: xp, blocked };
}

export function targetXpOf(goal) {
  return goal.type === "level" ? xpForLevel(goal.value) : goal.value;
}
