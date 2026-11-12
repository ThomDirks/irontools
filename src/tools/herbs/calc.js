import data from "../../data/herbs.json" with { type: "json" };
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";

export const HERBS = data.herbs;
export const PATCHES = data.patches;
export const COMPOST = data.compost;
export const KANDARIN = data.kandarinBonus;

// The herb calculator module truncates each term separately (RuneScript
// rounds every division down), so this one follows it rather than the
// round-once version used for cooking.
function interpTrunc(low, high, level) {
  const L = Math.min(99, Math.max(1, level));
  const v = Math.trunc(low * (99 - L) / 98) + Math.trunc(high * (L - 1) / 98) + 1;
  return Math.min(Math.max(v / 256, 0), 1);
}

export function chanceToSave(herb, level, o, diaryBonus = 0) {
  const item = (o.secateurs ? 0.1 : 0) + (o.cape ? 0.05 : 0);
  const attas = o.anima === "attas" ? 0.05 : 0;
  const boost = cts => Math.floor((Math.floor(cts * (1 + item)) + diaryBonus) * (1 + attas));
  return interpTrunc(boost(herb.ctsLow), boost(herb.ctsHigh), level);
}

/** Expected herbs from a patch that survives to harvest. */
export function yieldPerPatch(herb, level, o, diaryBonus = 0) {
  const lives = 3 + COMPOST[o.compost].lives;
  return lives / (1 - chanceToSave(herb, level, o, diaryBonus));
}

export function deathChance(o, isProtected) {
  if (isProtected) return 0;
  const anima = o.anima === "iasor" ? 0.2 : 1;
  const perStage = (Math.floor(Math.floor(27 / COMPOST[o.compost].reduction) * anima) + 1) / 128;
  return 1 - Math.pow(1 - perStage, 3);
}

/** The patches you use, each with its own disease chance, yield bonus and xp bonus. */
export function patchList(o) {
  const level = o.level || 1;
  return PATCHES.filter(p => o.patches.includes(p.id) && (!p.level || level >= p.level)).map(p => {
    let prot = !!p.protected, diary = 0, xpMult = 1;
    if (p.id === "hosidius") { prot = !!o.kourendEasy; diary = o.kourendHard ? data.kourendHardBonus : 0; }
    if (p.id === "guild") diary = o.kourendHard ? data.kourendHardBonus : 0;
    if (p.id === "catherby") diary = KANDARIN[o.kandarin] || 0;
    if (p.id === "falador" && o.faladorMedium) xpMult += data.faladorXpBonus;
    if (p.id === "fortis") prot = !!o.fortisChampion;
    return { ...p, prot, diary, xpMult };
  });
}

/** Expected result of one patch of one herb at a level. */
export function patchResult(herb, level, o, patch) {
  const live = 1 - deathChance(o, patch.prot);
  const herbs = live * yieldPerPatch(herb, level, o, patch.diary);
  // plant xp comes when the last herb is picked (or the dead patch is cleared)
  const xp = (herb.plantXp + herbs * herb.harvestXp) * patch.xpMult * (1 + (o.outfit ? 0.025 : 0));
  return { herbs, xp, live };
}

export function bestHerb(level, allowed) {
  let best = null;
  for (const h of HERBS) if (level >= h.level && (!allowed || allowed.includes(h.id))) best = h;
  return best;
}

/**
 * Run by run. "seeds" mode plants what's in the bank, best seed first; the
 * other modes plant the best herb your level allows (or a fixed one) until a
 * level or a number of runs.
 */
export function simulate(o) {
  let xp = Math.min(MAX_XP, o.startXp);
  const goalXp = o.mode === "level" ? xpForLevel(o.target) : Infinity;
  const maxRuns = o.mode === "runs" ? Math.max(0, Math.round(o.runs)) : 5000;
  const stock = o.mode === "seeds" ? { ...o.seeds } : null;
  const herbsOut = {}, seedsUsed = {};
  const events = [];
  let runs = 0, current = null, deadPatches = 0;

  while (runs < maxRuns && xp < goalXp) {
    const level = levelFromXp(xp);
    const patches = patchList({ ...o, level });
    if (!patches.length) break;
    // best patches first, so the best seeds land where they yield most
    patches.sort((a, b) => (b.prot - a.prot) || (b.diary - a.diary) || (b.xpMult - a.xpMult));
    let planted = 0, runXp = 0;
    for (const p of patches) {
      let herb;
      if (stock) {
        herb = [...HERBS].reverse().find(h => level >= h.level && stock[h.id] > 0);
        if (!herb) break;
        stock[herb.id]--;
      } else {
        herb = o.herb === "auto" ? bestHerb(level) : HERBS.find(h => h.id === o.herb);
        if (!herb || level < herb.level) break;
      }
      const r = patchResult(herb, level, o, p);
      herbsOut[herb.id] = (herbsOut[herb.id] || 0) + r.herbs;
      seedsUsed[herb.id] = (seedsUsed[herb.id] || 0) + 1;
      deadPatches += 1 - r.live;
      runXp += r.xp;
      planted++;
      if (!stock && o.herb === "auto" && (!current || current.id !== herb.id)) {
        if (current) events.push({ run: runs + 1, level, what: herb.name });
        current = herb;
      }
    }
    if (!planted) break;
    xp = Math.min(MAX_XP, xp + runXp);
    runs++;
  }
  const level = levelFromXp(o.startXp);
  return {
    runs, startXp: o.startXp, endXp: xp, gained: xp - o.startXp, herbsOut, seedsUsed, events,
    deadPatches, leftover: stock, startHerb: o.herb === "auto" ? bestHerb(level) : HERBS.find(h => h.id === o.herb),
    blocked: o.herb !== "auto" && o.mode !== "seeds" && HERBS.find(h => h.id === o.herb)?.level > level ? HERBS.find(h => h.id === o.herb) : null
  };
}
