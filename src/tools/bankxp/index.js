// Xp waiting in the group bank, skill by skill, worked out with each
// calculator's own maths so the numbers match what that calculator says.

import { BONES, fromBank as prayerBank } from "../prayer/calc.js";
import { FISH, cookBank } from "../cooking/calc.js";
import { ORES, ORE_IDS, smeltBank } from "../blastfurnace/calc.js";
import { TIERS, PLANKS, TYPES } from "../mahogany/calc.js";
import { HERBS, patchResult } from "../herbs/calc.js";
import { bindForm } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { levelFromXp, xpForLevel, MAX_XP } from "../../lib/xp.js";
import { fmt, esc, duration } from "../../lib/format.js";
import { onGroupBank, count } from "../../lib/groupbank.js";
import { note, seg } from "../../lib/ui.js";

export const subtitle = "The xp sitting in your bank, skill by skill";
export const reqs = ["Group bank loaded"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Prayer</h2>
      ${seg("prayer", [["chaos", "Chaos altar"], ["ecto", "Ectofuntus"]], "chaos")}
    </div>
    <div class="group">
      <h2>Cooking</h2>
      ${seg("cook", [["hos5", "Hosidius"], ["hos10", "With elite diary"]], "hos5")}
      <label class="toggle"><input type="checkbox" name="gauntlets"><span>Cooking gauntlets</span></label>
    </div>
    <div class="group">
      <h2>Smithing</h2>
      <label class="toggle"><input type="checkbox" name="coalBag" checked><span>Coal bag at the Blast Furnace</span></label>
    </div>
    <div class="group">
      <h2>Farming</h2>
      <label class="field"><span>Compost on herbs</span><select name="compost">
        <option value="ultra">Ultracompost</option><option value="super">Supercompost</option><option value="compost">Compost</option><option value="none">None</option>
      </select></label>
      <label class="toggle"><input type="checkbox" name="secateurs"><span>Magic secateurs</span></label>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  let stats = null, loaded = false;
  const f = bindForm(form, "bankxp", paint);
  onStats(s => { stats = s.skills; f.refresh(); });
  onGroupBank(s => { loaded = s.loaded; f.refresh(); });

  // without stats, work it out as if everything is unlocked and nothing burns
  const xpOf = skill => (stats && stats[skill] !== undefined ? stats[skill] : xpForLevel(99));

  function paint(v) {
    if (!loaded) { out.innerHTML = note("Load your group bank in the sidebar (Group bank, under your stats) and this adds up the xp in it."); return; }
    const cards = [];

    // Prayer
    {
      const bank = {}; for (const b of BONES) bank[b.id] = count(b.name);
      const start = xpOf("prayer");
      const r = prayerBank(start, bank, v.prayer, { zealot: 0 });
      if (r.rows.length) cards.push(card("Prayer", "prayer", start, r.gained, r.rows.map(x => [x.bone.name, x.n]),
        v.prayer === "chaos" ? "Chaos altar, half the bones saved" : "Ectofuntus"));
    }
    // Cooking
    {
      const bank = {}; for (const fi of FISH) bank[fi.id] = count(fi.raw);
      const start = xpOf("cooking");
      const r = cookBank(start, bank, v.cook, !!v.gauntlets);
      const locked = r.rows.filter(x => x.locked).map(x => x.fish.name);
      if (r.rows.length) cards.push(card("Cooking", "cooking", start, r.gained, r.rows.map(x => [x.fish.raw, x.raw]),
        "Hosidius kitchen, after burns" + (locked.length ? `. Still locked: ${locked.join(", ")}` : "")));
    }
    // Smithing
    {
      const bank = {}; for (const id of ORE_IDS) bank[id] = count(ORES[id].name);
      const start = xpOf("smithing");
      const r = smeltBank(start, bank, { coalBag: !!v.coalBag, gauntlets: false, pace: "mid" });
      if (r.rows.length) cards.push(card("Smithing", "blastfurnace", start, r.gained, r.rows.map(x => [x.bar.name + "s", Math.round(x.n)]),
        `Blast Furnace, about ${duration(r.hours)}`));
    }
    // Construction
    {
      const start = xpOf("construction"), level = levelFromXp(start);
      let gained = 0; const used = [], locked = [];
      for (const type of TYPES) {
        const n = count(PLANKS[type].name);
        if (!n) continue;
        const tier = TIERS.find(t => t.plank === type);
        if (level < tier.level) { locked.push(`${PLANKS[type].name} (${tier.level})`); continue; }
        gained += n * tier.xp / tier.planks;
        used.push([PLANKS[type].name, n]);
      }
      if (used.length || locked.length) cards.push(card("Construction", "mahogany", start, Math.min(MAX_XP - start, gained), used,
        "Mahogany Homes contracts" + (locked.length ? `. Still locked: ${locked.join(", ")}` : "")));
    }
    // Farming
    {
      const start = xpOf("farming"), level = levelFromXp(start);
      const o = { compost: v.compost || "ultra", secateurs: !!v.secateurs, cape: false, anima: "none", outfit: false };
      const patch = { prot: false, diary: 0, xpMult: 1 };
      let gained = 0; const used = [], locked = [];
      for (const h of HERBS) {
        const n = count(h.seed);
        if (!n) continue;
        if (level < h.level) { locked.push(`${h.seed}s (${h.level})`); continue; }
        gained += n * patchResult(h, level, o, patch).xp;
        used.push([h.seed, n]);
      }
      if (used.length || locked.length) cards.push(card("Farming", "herbs", start, Math.min(MAX_XP - start, gained), used,
        "Herb seeds, planted and picked" + (locked.length ? `. Still locked: ${locked.join(", ")}` : "")));
    }

    if (!cards.length) { out.innerHTML = note("Nothing in the bank that these calculators use yet: bones, raw fish, ores, planks or herb seeds."); return; }
    const total = cards.reduce((s, c) => s + c.gained, 0);
    out.innerHTML = `<div class="bx-total"><b>${fmt(Math.round(total))}</b><span>xp waiting in the bank</span></div>
      ${stats ? "" : note("Load your stats at the top of the sidebar for your levels, burn rates and what's still locked. Until then this counts everything as unlocked.")}
      <div class="bx">${cards.sort((a, b) => b.gained - a.gained).map(c => c.html).join("")}</div>`;
  }

  function card(skill, tool, start, gained, used, how) {
    const from = levelFromXp(start), to = levelFromXp(Math.min(MAX_XP, start + gained));
    const lv = stats ? `<span class="bx-lv">${from}<svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5"/></svg>${to}</span>` : "";
    const list = used.slice(0, 6).map(([n, q]) => `${fmt(q)} ${esc(n.toLowerCase())}`).join(", ") + (used.length > 6 ? `, and ${used.length - 6} more` : "");
    return {
      gained,
      html: `<a class="bx-card" href="#/${tool}">
        <span class="bx-head"><b>${skill}</b>${lv}</span>
        <span class="bx-xp">+${fmt(Math.round(gained))} xp</span>
        <span class="bx-what">${list || "Nothing usable yet"}</span>
        <span class="bx-how">${esc(how)}</span>
      </a>`
    };
  }
}
