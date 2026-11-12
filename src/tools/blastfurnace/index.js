import { BARS, ORES, ORE_IDS, smeltBank, planToTarget, materials, fees, barXp, barsPerHour } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, esc, duration, short } from "../../lib/format.js";
import { landing, stat, tiles, section, table, note, row, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Your ore into bars and levels, with coal, coffer and time";
export const reqs = ["Keldagrim", "<b>72k</b> coffer an hour"];

const DEFAULT_BARS = ["iron", "steel", "gold", "mithril", "adamant", "rune"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Smithing</h2>
      ${levelXpFields("s", 30, xpForLevel(30))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${seg("mode", [["bank", "Smelt my ore"], ["target", "Reach a level"]], "bank")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field" data-show="mode:target"><span>Bars</span><select name="bar">
        <option value="auto">Best of the ones I pick</option>
        ${BARS.map(b => `<option value="${b.id}">${b.name} only (${b.level})</option>`).join("")}
      </select></label>
      <div data-show="mode:target"><div class="fishpick" data-show-bar>${BARS.map(b => `<label><input type="checkbox" name="use-${b.id}"${DEFAULT_BARS.includes(b.id) ? " checked" : ""}><span>${esc(b.name.replace(" bar", ""))} <i>${b.level}</i></span></label>`).join("")}</div></div>
    </div>
    <div class="group" data-show="mode:bank">
      <h2>Ore in the bank</h2>
      <div class="qtys">${ORE_IDS.map(id => `<label class="qty"><span>${esc(ORES[id].name)}</span><input name="ore-${id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Kit</h2>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="coalBag" checked><span>Coal bag<small>Faster steel, mithril, adamant and rune</small></span></label>
        <label class="toggle"><input type="checkbox" name="gauntlets"><span>Goldsmith gauntlets<small>56.2 xp a gold bar</small></span></label>
      </div>
      <label class="field"><span>Pace</span></label>
      ${seg("pace", [["low", "Relaxed"], ["mid", "Typical"], ["high", "Fast"]], "mid")}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "sLvl", "sXp");
  const f = bindForm(form, "blastfurnace", paint);
  lx.setXp(f.values().sXp);
  onStats(s => { if (s.skills.smithing !== undefined) lx.setXp(s.skills.smithing); });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    form.querySelector("[data-show-bar]").hidden = v.bar !== "auto";
    const startXp = v.sXp, level = levelFromXp(startXp);
    const o = { coalBag: !!v.coalBag, gauntlets: !!v.gauntlets, pace: v.pace };
    let html = "", list = [], hours = 0, endXp = startXp, bank = null;

    if (v.mode === "bank") {
      bank = Object.fromEntries(ORE_IDS.map(id => [id, Math.max(0, Math.floor(v["ore-" + id] || 0))]));
      const r = smeltBank(startXp, bank, o);
      if (!r.rows.length) {
        out.innerHTML = note(Object.values(bank).some(Boolean)
          ? "Nothing you can smelt yet with that ore. Check the level column below."
          : "Enter the ore and coal in your bank. The best bar goes first, so iron ore with coal becomes steel.") + barTable(level, o);
        return;
      }
      list = r.rows; hours = r.hours; endXp = r.endXp;
      html += landing({ fromXp: startXp, toXp: endXp, skill: "Smithing" });
      html += tiles([
        stat(fmt(list.reduce((s, x) => s + x.n, 0)), "bars", "gold"),
        stat(duration(hours), "at the furnace"),
        stat(short(fees(hours, level).coffer), "gp in the coffer"),
        stat(fmt(list.reduce((s, x) => s + x.coal, 0)), "coal used")
      ]);
      html += section("Bars", table(["Bar", "Bars", "Levels", "XP"],
        list.map(x => ({ cells: [x.bar.name, fmt(x.n), x.fromLv === x.toLv ? String(x.toLv) : `${x.fromLv} → ${x.toLv}`, fmt(x.xp)] }))));
      if (r.locked.length) html += note(`Waiting on a level: ${r.locked.map(x => `${fmt(x.n)} ${x.bar.name.toLowerCase()}s (${x.bar.level})`).join(", ")}.`, "ember");
      const left = Object.entries(r.leftover).filter(([, n]) => n > 0).map(([id, n]) => `${fmt(n)} ${ORES[id].name.toLowerCase()}`);
      if (left.length) html += `<p class="fine">Left over: ${left.join(", ")}.</p>`;
    } else {
      const allowed = BARS.filter(b => v["use-" + b.id]).map(b => b.id);
      if (v.bar === "auto" && !allowed.length) { out.innerHTML = note("Pick the bars you can supply ore for."); return; }
      if (xpForLevel(v.target) <= startXp) { out.innerHTML = note(`You're already level ${level}.`, "moss"); return; }
      const r = planToTarget(startXp, v.target, { ...o, bar: v.bar, allowed });
      if (!r.segs.length) { out.innerHTML = note(`None of those bars can be smelted at level ${level}.`, "ember") + barTable(level, o); return; }
      list = r.segs; hours = r.segs.reduce((s, x) => s + x.hours, 0); endXp = r.endXp;
      const need = materials(list);
      html += landing({ fromXp: startXp, toXp: endXp, skill: "Smithing" });
      html += tiles([
        stat(fmt(list.reduce((s, x) => s + x.n, 0)), "bars", "gold"),
        stat(duration(hours), "at the furnace"),
        stat(short(fees(hours, level).coffer), "gp in the coffer"),
        stat(fmt(need.coal || 0), "coal")
      ]);
      if (r.blocked) html += note(`Stops at ${r.blocked}: no picked bar is unlocked there.`, "ember");
      html += section("The plan", table(["Bar", "Levels", "Bars", "Time"],
        list.map(x => ({ cells: [x.bar.name, `${x.fromLv} → ${x.toLv}`, `<b>${fmt(x.n)}</b>`, duration(x.hours)] }))));
      html += section("Ore to bring", table(["Ore", "Amount", "From Ordan"],
        Object.entries(need).map(([id, n]) => ({ cells: [ORES[id].name, fmt(n), ORES[id].ordan ? short(n * ORES[id].ordan) + " gp" : "Not sold"] }))),
        "") + `<p class="fine">Ordan at the Blast Furnace stocks 100 of each and restocks every 2 minutes. He doesn't sell adamantite, runite, lead or nickel.</p>`;
    }
    const fee = fees(hours, level);
    if (fee.foreman) html += note(`Below 60 Smithing the foreman charges 2,500 gp per 10 minutes: about ${short(fee.foreman)} gp here.`);
    html += barTable(level, o);
    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Coal is halved at the Blast Furnace: steel 1, mithril 2, adamantite 3, runite 4 per bar.</li>
      <li>Bars an hour are the wiki's ranges per bar, with and without the coal bag: Relaxed is the low end, Fast the high end.</li>
      <li>The coffer pays the dwarves 72,000 gp an hour while you're there.</li>
      <li>Hybrid methods (gold alongside mithril, adamant or rune) aren't modelled. Source: OSRS Wiki, Blast Furnace.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}

function barTable(level, o) {
  return section("Every bar here", table(["Bar", "Level", "XP", "Bars an hour", "XP an hour"],
    BARS.map(b => ({ cls: level < b.level ? "off" : "", cells: [b.name, b.level, fmt(barXp(b, o), 1), fmt(barsPerHour(b, o)), fmt(barXp(b, o) * barsPerHour(b, o))] }))));
}
