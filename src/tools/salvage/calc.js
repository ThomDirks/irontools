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

// Crewmates who can hook, with their deckhandiness (wiki: Shipwreck salvaging).
export const CREW = [
  { id: "jenkins", name: "Cabin Boy Jenkins", d: 4 },
  { id: "jollyjim", name: "Jolly Jim", d: 4 },
  { id: "joblessjim", name: "Jobless Jim", d: 3 },
  { id: "siad", name: "Ex-Captain Siad", d: 3 },
  { id: "olga", name: "Oarswoman Olga", d: 2 },
  { id: "zarah", name: "Bosun Zarah", d: 2 },
  { id: "virginia", name: "Spotter Virginia", d: 2 },
  { id: "ada", name: "Adventurer Ada", d: 1 },
  { id: "jittery", name: "Jittery Jim", d: 1 },
  { id: "jakob", name: "Sailor Jakob", d: 1 }
];
export const deckOf = id => (CREW.find(c => c.id === id) || { d: 0 }).d;

// A crewmate rolls every 5 ticks to your 4, at D x 10% of your chance:
// on the same hook they bring in 0.8 x D x 10% of what you would.
export const crewRate = d => 0.8 * d * 0.1;
// The wiki guides for crewed wrecks have you on one hook and a
// deckhandiness 4 crewmate on the other.
const GUIDE_D = 4;

/** Salvage an hour you'd get on one hook yourself, from the wiki guide. */
export const playerRate = wreck => wreck.kph / (wreck.crew ? 1 + crewRate(GUIDE_D) : 1);

/**
 * An hour at one wreck. Modes:
 *  "me"   you on one hook, deckhand 1 on the other
 *  "solo" just you
 *  "afk"  both deckhands, you only sort
 * Crew-hooked salvage gives D x 10% of the hook xp; sorting xp is the same.
 * A typed salvage-an-hour replaces the total and keeps the same split.
 */
export function hour(wreck, o) {
  const p = playerRate(wreck);
  const d1 = o.mode === "solo" ? 0 : (o.d1 || 0), d2 = o.mode === "afk" ? (o.d2 || 0) : 0;
  const me = o.mode === "afk" ? 0 : p;
  const crew = [d1, d2].filter(Boolean).map(d => ({ d, n: p * crewRate(d) }));
  let total = me + crew.reduce((s, c) => s + c.n, 0);
  const scale = o.kph > 0 && total > 0 ? o.kph / total : 1;
  total *= scale;
  const kph = total;
  const hookXp = wreck.xp * (me * scale) + crew.reduce((s, c) => s + wreck.xp * c.d * 0.1 * c.n * scale, 0);
  const sailing = hookXp + kph * wreck.sortXp;
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
  return { wreck, kph, crewShare: kph ? 1 - me * scale / kph : 0, sailing, gp, casts, magic: casts * ALCH_XP, natures: casts, rows };
}
