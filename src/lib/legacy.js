// Glue for the calculators carried over from the single-page site: they read
// their inputs by id, so hiscores data is written into those inputs.
import { onStats } from "./stats.js";

export function fillFromStats(map) {
  onStats(s => {
    for (const [id, skill] of Object.entries(map)) {
      const el = document.getElementById(id);
      const xp = s.skills[skill];
      if (!el || xp === undefined) continue;
      el.value = xp;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}
