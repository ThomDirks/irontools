// OSRS experience table. XP[L] is the experience needed to reach level L.
// Goes past 99 to 126 so virtual levels work where a tool wants them.
export const MAX_XP = 200_000_000;

export const XP = (() => {
  const t = [0, 0];
  let points = 0;
  for (let l = 1; l < 126; l++) {
    points += Math.floor(l + 300 * Math.pow(2, l / 7));
    t[l + 1] = Math.floor(points / 4);
  }
  return t;
})();

export function xpForLevel(level, cap = 99) {
  const l = Math.max(1, Math.min(cap, Math.round(level)));
  return XP[l];
}

export function levelFromXp(xp, cap = 99) {
  for (let l = cap; l >= 1; l--) if (xp >= XP[l]) return l;
  return 1;
}

/** Progress through the current level, 0..1. */
export function levelProgress(xp, cap = 99) {
  const l = levelFromXp(xp, cap);
  if (l >= cap) return 1;
  return (xp - XP[l]) / (XP[l + 1] - XP[l]);
}
