// Item names and high alch values for every tradeable item, from the OSRS
// Wiki's item mapping (the same list the wiki's price pages use). Fetched
// once when a bank tool first needs it, then kept for the browser session.

const URL = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const KEY = "ironTools.itemdb";

let pending = null;

/** Map of item id -> { name, ha, members }. Rejects if the wiki can't be reached. */
export function loadItems() {
  if (pending) return pending;
  pending = (async () => {
    let list = null;
    try { list = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { /* private mode */ }
    if (!Array.isArray(list)) {
      const r = await fetch(URL);
      if (!r.ok) throw new Error("http");
      const raw = await r.json();
      list = raw.map(i => [i.id, i.name, i.highalch || 0]);
      try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch { /* too big or private: fine */ }
    }
    return new Map(list.map(([id, name, ha]) => [id, { name, ha }]));
  })();
  pending.catch(() => { pending = null; });
  return pending;
}
