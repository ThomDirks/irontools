import { RUNES, LANTERNS, REQS, runeAt, hourly, multiplier, simulate } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, duration } from "../../lib/format.js";
import { landing, stat, tiles, section, table, note, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Dense essence into blood and soul runes north of Arceuus";
export const reqs = ["<b>77</b> Runecraft", `<b>${REQS.mining}</b> Mining`, `<b>${REQS.crafting}</b> Crafting`];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Runecraft</h2>
      ${levelXpFields("r", 77, xpForLevel(77))}
    </div>
    <div class="group">
      <h2>Goal</h2>
      ${seg("goal", [["level", "Level"], ["xp", "XP"], ["runes", "Runes"]], "level")}
      <label class="field"><span data-goal-label>Target level</span><input name="target" type="number" min="1" value="90" inputmode="numeric"></label>
    </div>
    <div class="group">
      <h2>Runes</h2>
      <label class="field"><select name="choice">
        <option value="auto">Blood, then soul at 90</option>
        <option value="blood">Blood only</option>
        <option value="soul">Soul only</option>
      </select></label>
    </div>
    <div class="group">
      <h2>Extra runes</h2>
      <label class="field"><span>Raiments of the Eye</span><select name="outfit">
        <option value="0">None</option><option value="1">1 piece (+10%)</option><option value="2">2 pieces (+20%)</option>
        <option value="3">3 pieces (+30%)</option><option value="4" selected>Full set (+60%)</option>
      </select></label>
      <label class="field"><span>Abyssal lantern</span><select name="lantern">
        ${LANTERNS.map(l => `<option value="${l.id}">${l.name}${l.bonus ? ` (+${Math.round(l.bonus * 100)}%${l.bloodOnly ? " blood" : ""})` : ""}</option>`).join("")}
      </select></label>
      <label class="toggle"><input type="checkbox" name="elite"><span>Elite Kourend &amp; Kebos diary<small>+10% blood runes</small></span></label>
      <label class="toggle"><input type="checkbox" name="essence"><span>Blood essence<small>+50% blood runes, a bit slower</small></span></label>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "rLvl", "rXp");
  const f = bindForm(form, "arceuus", paint);
  lx.setXp(f.values().rXp);
  onStats(s => { if (s.skills.runecrafting !== undefined) lx.setXp(s.skills.runecrafting); });

  function paint(v) {
    form.querySelector("[data-goal-label]").textContent = v.goal === "xp" ? "Target experience" : v.goal === "runes" ? "Runes to make" : "Target level";
    const startXp = v.rXp, level = levelFromXp(startXp);
    const o = { choice: v.choice, outfit: +v.outfit, lantern: v.lantern, elite: !!v.elite, essence: !!v.essence };
    const now = runeAt(level, v.choice);
    if (!now) {
      const need = v.choice === "soul" ? 90 : 77;
      out.innerHTML = note(`${v.choice === "soul" ? "Soul" : "Blood"} runes need ${need} Runecraft. You're ${level}.`, "ember");
      return;
    }
    if (v.goal === "level" && v.target <= level) { out.innerHTML = note(`You're already ${level}. Pick a higher level, or a number of runes.`); return; }
    if (v.goal === "runes" && !(v.target > 0)) { out.innerHTML = note("How many runes do you want to make?"); return; }

    const r = simulate({ ...o, startXp, goal: { type: v.goal, value: v.target } });
    let html = landing({ fromXp: startXp, toXp: r.endXp, skill: "Runecraft" });
    const runeTiles = r.rows.map(b => stat(fmt(Math.round(b.runes)), b.rune.name.toLowerCase() + "s", "gold"));
    html += tiles([
      ...runeTiles,
      stat(duration(r.hours), "running to the altar"),
      stat(fmt(Math.ceil(r.rows.reduce((s, b) => s + b.fragments, 0) / 4)), "dense essence blocks")
    ]);
    if (r.essences > 0) html += note(`Uses about ${fmt(Math.ceil(r.essences))} blood essence${Math.ceil(r.essences) === 1 ? "" : "s"}.`);

    if (r.rows.length > 1) html += section("By rune", table(["Rune", "Levels", "Hours", "Runes"],
      r.rows.map(b => ({ cells: [b.rune.name, `${b.fromLv} to ${b.toLv}`, duration(b.hours), fmt(Math.round(b.runes))] }))));

    html += section("An hour", table(["Rune", "Level", "XP", "Runes", "Per fragment"], RUNES.map(rn => {
      const h = hourly(rn, o);
      return { cls: level < rn.level ? "off" : (now.id === rn.id ? "on" : ""), cells: [rn.name, rn.level, fmt(h.xp), fmt(Math.round(h.runes)), "×" + multiplier(rn, o).toFixed(2).replace(/0$/, "")] };
    })));

    html += tiles([stat(fmt(Math.round(r.crafting)), "Crafting xp"), stat(fmt(Math.round(r.mining)), "Mining xp")]);

    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Xp an hour is the wiki's: 36,000 for blood (34,500 with blood essence), 44,000 for soul, with the medium Kourend &amp; Kebos diary.</li>
      <li>A fragment gives 23.8 xp as a blood rune or 29.7 as a soul rune, plus 2.5 xp per block at the Dark Altar. One fragment makes one rune before bonuses.</li>
      <li>Bonuses add up on the base rune: outfit, lantern, elite diary, blood essence. Blisterwood only helps blood runes.</li>
      <li>One blood essence lasts 1,000 extra runes.</li>
      <li>Source: OSRS Wiki, Pay-to-play Runecraft training, Blood Altar (Kourend), Soul Altar (Kourend), Abyssal lantern.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}
