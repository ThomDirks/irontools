// Hiscores lookup and a tiny store for the player's skill XP.
//
// Jagex's own hiscores send no CORS headers, so a browser on a static host
// cannot read them. Wise Old Man is a public, CORS-open API that reads those
// same official hiscores. No custom headers on purpose: they would trigger a
// CORS preflight that some hosts refuse.

const WOM = "https://api.wiseoldman.net/v2/players/";
const KEY = "ironTools.rsn";

const listeners = new Set();
let current = { name: null, skills: {} };

export function onStats(fn) {
  listeners.add(fn);
  if (current.name) fn(current);
  return () => listeners.delete(fn);
}

export function skillXp(skill) {
  return current.skills[skill];
}

export function savedName() {
  try { return localStorage.getItem(KEY) || ""; } catch { return ""; }
}

function apply(data, fallbackName) {
  const skills = data?.latestSnapshot?.data?.skills;
  if (!skills) throw new Error("nosnapshot");
  const out = {};
  for (const [k, v] of Object.entries(skills)) {
    out[k] = typeof v.experience === "number" && v.experience > 0 ? v.experience : 0;
  }
  current = { name: data.displayName || fallbackName, skills: out };
  try { localStorage.setItem(KEY, current.name); } catch { /* private mode */ }
  listeners.forEach(fn => fn(current));
  return current;
}

/**
 * Load a player's stats. fresh=true asks Wise Old Man to re-read the
 * hiscores first; it refuses if the player was updated seconds ago, so we
 * fall back to the stored snapshot instead of failing.
 */
export async function lookup(name, fresh = false) {
  name = (name || "").trim();
  if (!name) throw new Error("empty");
  const url = WOM + encodeURIComponent(name);
  if (fresh) {
    try {
      const r = await fetch(url, { method: "POST" });
      if (r.ok) return apply(await r.json(), name);
    } catch { /* fall through to the cached read */ }
  }
  const r = await fetch(url);
  if (r.status === 404) throw new Error("notfound");
  if (!r.ok) throw new Error("http");
  return apply(await r.json(), name);
}
