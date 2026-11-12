import data from "../../data/prayer.json" with { type: "json" };
import { xpForLevel, MAX_XP } from "../../lib/xp.js";

export const BONES = data.bones;
export const METHODS = data.methods;

export function zealotSave(pieces) {
  return Math.max(0, Math.min(4, pieces)) * data.zealotPerPiece;
}

/**
 * Experience from one bone, and what each offering uses.
 * Chaos altar: the Dark Lord spares 50%; if that fails, the robes roll too.
 */
export function perBone(bone, method, o) {
  const z = zealotSave(o.zealot || 0);
  if (method === "libation") {
    if (!bone.shards) return null;
    const perShard = METHODS.libation.xpPerShard[o.wine === "blessed" ? "blessed" : "sunfire"];
    const offered = bone.shards / (1 - z);         // shards saved get offered again
    return { xp: offered * perShard, shards: bone.shards, jugs: offered / METHODS.libation.shardsPerJug, offerings: offered };
  }
  if (bone.shardsOnly) return null;
  if (method === "chaos") {
    const save = 1 - (1 - METHODS.chaos.saveChance) * (1 - z);
    const offerings = 1 / (1 - save);
    return { xp: bone.xp * METHODS.chaos.mult * offerings, offerings };
  }
  if (method === "ecto") {
    const offerings = 1 / (1 - z);
    return { xp: bone.xp * METHODS.ecto.mult * offerings, offerings, slime: 1, tokens: offerings * METHODS.ecto.tokens };
  }
  return null;
}

/** All the bones in the bank through one method. */
export function fromBank(startXp, bank, method, o) {
  let gained = 0, jugs = 0, slime = 0, tokens = 0, shards = 0, offerings = 0;
  const rows = [], skipped = [];
  for (const b of BONES) {
    const n = bank[b.id] || 0;
    if (!n) continue;
    const p = perBone(b, method, o);
    if (!p) { skipped.push(b); continue; }
    gained += n * p.xp;
    offerings += n * (p.offerings || 1);
    if (p.jugs) jugs += n * p.jugs;
    if (p.shards) shards += n * p.shards;
    if (p.slime) slime += n * p.slime;
    if (p.tokens) tokens += n * p.tokens;
    rows.push({ bone: b, n, xp: n * p.xp, each: p.xp });
  }
  const endXp = Math.min(MAX_XP, startXp + gained);
  return { rows, skipped, startXp, endXp, gained: endXp - startXp, jugs, slime, tokens, shards, offerings };
}

/** Bones of one kind needed for a goal. */
export function toTarget(startXp, goal, boneId, method, o) {
  const target = goal.type === "level" ? xpForLevel(goal.value) : Math.min(MAX_XP, goal.value);
  const need = Math.max(0, target - startXp);
  const bone = BONES.find(b => b.id === boneId);
  const p = perBone(bone, method, o);
  if (!p) return { bone, impossible: true };
  const bones = Math.ceil(need / p.xp);
  return {
    bone, bones, startXp, endXp: startXp + bones * p.xp, per: p,
    jugs: p.jugs ? Math.ceil(bones * p.jugs) : 0, shards: p.shards ? bones * p.shards : 0,
    slime: p.slime ? bones : 0, tokens: p.tokens ? bones * p.tokens : 0
  };
}
