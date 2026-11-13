import data from "../../data/salvage.json" with { type: "json" };

export const WRECKS = data.wrecks;
export const ALCH_XP = 65;
export const MAGIC_LEVEL = 55;
export const CASTS_PER_HOUR = 1200;   // 5 ticks a cast

export const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Every item that can be alched, across all wrecks, in first-seen order. */
export const ALCHABLE = (() => {
  const seen = new Map();
  for (const w of WRECKS) for (const r of w.rows) if (r.ha && !seen.has(r.n)) seen.set(r.n, r.ha);
  return [...seen].map(([name, ha]) => ({ name, ha, key: "alch-" + slug(name) }));
})();

const KEEP_BY_DEFAULT = /cannonball|repair kit|plank|nails|seed|frag|logs|ore|bar$|rune$/i;
/** Worth a cast and not something you'd rather keep. */
export const defaultAlch = item => item.ha >= 500 && !KEEP_BY_DEFAULT.test(item.name);

export function bestWreck(level) {
  let best = null;
  for (const w of WRECKS) if (level >= w.level) best = w;
  return best;
}

/**
 * An hour at one wreck. `share` of the salvage is hooked by crew, who give
 * `deck` × 10% of the hook xp. Sorting xp is the same whoever hooked it.
 */
export function hour(wreck, o) {
  const kph = Math.max(0, o.kph ?? wreck.kph);
  const share = Math.max(0, Math.min(1, o.share ?? wreck.crew));
  const deck = Math.max(1, Math.min(4, o.deck || 4));
  const hookXp = wreck.xp * ((1 - share) + share * deck * 0.1);
  const sailing = kph * (hookXp + wreck.sortXp);
  let gp = 0, casts = 0;
  const rows = wreck.rows.map(r => {
    const perHour = kph * r.p * r.q;
    const alch = !!(r.ha && o.alch(r.n));
    let value = 0;
    if (r.cash) value = perHour * r.cash;
    else if (alch) { value = perHour * r.ha; casts += perHour; }
    gp += value;
    return { ...r, perHour, alch, value };
  });
  return { wreck, kph, sailing, gp, casts, magic: casts * ALCH_XP, natures: casts, rows };
}
