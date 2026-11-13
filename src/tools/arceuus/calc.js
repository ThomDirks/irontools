import data from "../../data/arceuus.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const RUNES = data.runes;
export const LANTERNS = data.lantern;
export const REQS = data.reqs;
const BLOOD = RUNES.find(r => r.id === "blood");
const SOUL = RUNES.find(r => r.id === "soul");

/** Runecraft xp per fragment, counting the Dark Altar's share of the block. */
export const xpPerFragment = rune => rune.xp + data.blockXp / data.fragmentsPerBlock;

/** Which rune you'd craft at a level: "auto" moves to souls at 90. */
export function runeAt(level, choice) {
  if (choice === "soul") return level >= SOUL.level ? SOUL : null;
  if (choice === "blood") return level >= BLOOD.level ? BLOOD : null;
  if (level >= SOUL.level) return SOUL;
  return level >= BLOOD.level ? BLOOD : null;
}

/**
 * Runes per fragment. Every bonus works on the base rune and they add up:
 * outfit pieces, lantern, elite diary (blood), blood essence (blood).
 */
export function multiplier(rune, o) {
  let m = 1 + (data.outfit.pieces[Math.max(0, Math.min(4, o.outfit | 0))] || 0);
  const l = LANTERNS.find(x => x.id === o.lantern);
  if (l && (!l.bloodOnly || rune.id === "blood")) m += l.bonus;
  if (rune.id === "blood") {
    if (o.elite) m += data.eliteDiaryBlood;
    if (o.essence) m += data.bloodEssence.chance;
  }
  return m;
}

export function hourly(rune, o) {
  const ess = rune.id === "blood" && o.essence;
  const xp = ess ? rune.xpHrEssence : rune.xpHr;
  const fragments = xp / xpPerFragment(rune);
  return {
    xp, fragments, blocks: fragments / data.fragmentsPerBlock,
    runes: fragments * multiplier(rune, o),
    crafting: ess ? rune.craftingHrEssence : rune.craftingHr,
    mining: ess ? rune.miningHrEssence : rune.miningHr
  };
}

/** Level by level to the goal, switching to souls at 90 on "auto". */
export function simulate(o) {
  if (o.goal.type === "runes") return forRunes(o);
  let xp = Math.min(MAX_XP, o.startXp), hours = 0;
  const goalXp = o.goal.type === "level" ? xpForLevel(Math.min(99, o.goal.value)) : Math.min(MAX_XP, o.goal.value);
  const by = new Map();
  let blocked = null, crafting = 0, mining = 0, essences = 0;
  for (let guard = 0; guard < 200 && xp < goalXp; guard++) {
    const level = levelFromXp(xp);
    const rune = runeAt(level, o.choice);
    if (!rune) { blocked = o.choice === "soul" ? SOUL : BLOOD; break; }
    const h = hourly(rune, o);
    const stop = rune === BLOOD && o.choice === "auto" ? Math.min(goalXp, xpForLevel(SOUL.level)) : goalXp;
    const t = (stop - xp) / h.xp;
    const b = by.get(rune.id) || { rune, hours: 0, fragments: 0, runes: 0, xp: 0, fromLv: level };
    b.hours += t; b.fragments += t * h.fragments; b.runes += t * h.runes; b.xp += stop - xp;
    if (rune.id === "blood" && o.essence) essences += t * h.fragments * data.bloodEssence.chance / data.bloodEssence.charges;
    crafting += t * h.crafting; mining += t * h.mining;
    hours += t; xp = stop;
    b.toLv = levelFromXp(xp);
    by.set(rune.id, b);
  }
  return { startXp: o.startXp, endXp: xp, hours, rows: [...by.values()], blocked, crafting, mining, essences };
}

/** A set number of runes of the kind you craft now. */
function forRunes(o) {
  const level = levelFromXp(o.startXp);
  const rune = runeAt(level, o.choice);
  if (!rune) return { startXp: o.startXp, endXp: o.startXp, hours: 0, rows: [], blocked: o.choice === "soul" ? SOUL : BLOOD, crafting: 0, mining: 0, essences: 0 };
  const h = hourly(rune, o);
  const t = Math.max(0, o.goal.value) / h.runes;
  const endXp = Math.min(MAX_XP, o.startXp + t * h.xp);
  const essences = rune.id === "blood" && o.essence ? t * h.fragments * data.bloodEssence.chance / data.bloodEssence.charges : 0;
  return {
    startXp: o.startXp, endXp, hours: t, blocked: null, crafting: t * h.crafting, mining: t * h.mining, essences,
    rows: [{ rune, hours: t, fragments: t * h.fragments, runes: t * h.runes, xp: endXp - o.startXp, fromLv: level, toLv: levelFromXp(endXp) }]
  };
}
