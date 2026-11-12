import data from "../../data/kingdom.json" with { type: "json" };

export const CATEGORIES = data.categories;
export const RATES = data.rates;
export const MAX_POINTS = data.maxPoints;
export const MAX_PER = data.maxPerCategory;

export function rules(rt) { return rt ? data.rt : data.noRt; }

/** Favour is 0..127 in game, shown as a percentage. */
export const pctToFavour = p => Math.round(Math.max(25, Math.min(100, p)) * 127 / 100);
export const favourToPct = f => f / 127 * 100;

/**
 * Day by day, as the wiki's calculator models it: 10% of the coffer (capped
 * at the daily wage) is paid out, that payment and your favour make resource
 * points, then favour slips unless you top it up.
 */
export function simulateDays({ days, rt, coffer, approval, topUpEvery }) {
  const r = rules(rt);
  let favour = pctToFavour(approval), points = 0, paid = 0;
  const log = [];
  for (let d = 1; d <= days; d++) {
    if (topUpEvery && d > 1 && (d - 1) % topUpEvery === 0) favour = 127;
    const pay = Math.min(5 + Math.floor(coffer / 10), r.wage, coffer);
    coffer -= pay; paid += pay;
    const effectiveness = Math.floor(pay * 100 / 8333);
    points += Math.floor(effectiveness * favour / 100);
    log.push({ day: d, favour, coffer, points: Math.min(points, MAX_POINTS) });
    if (favour > 32) favour = Math.max(32, favour - Math.ceil((r.decay - favour) / 15));
  }
  const capped = points > MAX_POINTS;
  return { points: Math.min(points, MAX_POINTS), capped, coffer, paid, endFavour: favour, log };
}

function expected(n, p, max) {
  if (max === undefined) return n * p;
  // chance-capped items (ranarr seeds, tree seeds) as the wiki calculator does
  let ev = 0, mass = 0, c = 1;
  for (let k = 0; k < max; k++) {
    if (k > 0) c = c * (n - k + 1) / k;
    const pk = c * Math.pow(p, k) * Math.pow(1 - p, n - k);
    mass += pk; ev += k * pk;
  }
  return ev + (1 - mass) * max;
}

/** What one category gives for a number of workers and resource points. */
export function categoryYield(option, workers, points) {
  const base = Math.floor(workers * option.cost * points / 2048);
  const items = [];
  for (const [name, share] of option.main || []) items.push({ name, qty: Math.floor(share * base), main: true });
  if (option.mainTable) for (const r of RATES[option.mainTable]) items.push({ name: r.i, qty: expected(base, r.r[0] / r.r[1], r.max), main: true });
  for (const e of option.extra || []) {
    const rolls = base / e.per;
    for (const r of RATES[e.table]) {
      const n = Math.floor(rolls);
      const q = r.max !== undefined ? expected(n, r.r[0] / r.r[1], r.max) : rolls * r.r[0] / r.r[1];
      items.push({ name: r.i, qty: q });
    }
  }
  return { base, items };
}

/** The whole kingdom: workers per category, the option chosen in each. */
export function kingdomYield(alloc, points) {
  const out = [];
  for (const c of CATEGORIES) {
    const a = alloc[c.id];
    if (!a || !a.workers) continue;
    const option = c.options.find(o => o.id === a.option) || c.options[0];
    out.push({ category: c, option, workers: a.workers, ...categoryYield(option, a.workers, points) });
  }
  return out;
}

/** Days until a category has produced a target amount of its main item. */
export function daysFor(target, option, workers, settings) {
  if (!workers || target <= 0) return null;
  let lo = 1, hi = 400;
  const get = d => categoryYield(option, workers, simulateDays({ ...settings, days: d }).points).items.filter(i => i.main).reduce((s, i) => s + i.qty, 0);
  if (get(hi) < target) return null;
  while (lo < hi) { const m = (lo + hi) >> 1; if (get(m) >= target) hi = m; else lo = m + 1; }
  return lo;
}
