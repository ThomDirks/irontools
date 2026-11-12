import { HERBS, PATCHES, COMPOST, simulate, patchList, patchResult, bestHerb, deathChance } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, plural, esc, days as fmtDays } from "../../lib/format.js";
import { landing, stat, tiles, section, table, note, timeline, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Herbs and xp from your patches, run by run";
export const reqs = ["<b>9</b> Farming", "80 minutes a run"];

// names as the Mixology calculator lists them
const MIXOLOGY_NAME = { guam: "Guam leaf", marrentill: "Marrentill", tarromin: "Tarromin", harralander: "Harralander",
  ranarr: "Ranarr weed", toadflax: "Toadflax", irit: "Irit leaf", avantoe: "Avantoe", kwuarm: "Kwuarm", huasca: "Huasca",
  snapdragon: "Snapdragon", cadantine: "Cadantine", lantadyme: "Lantadyme", dwarfweed: "Dwarf weed", torstol: "Torstol" };

const DEFAULT_PATCHES = ["falador", "phasmatys", "catherby", "ardougne", "hosidius"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Farming</h2>
      ${levelXpFields("h", 32, xpForLevel(32))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${seg("mode", [["seeds", "Plant my seeds"], ["level", "Reach a level"], ["runs", "Number of runs"]], "seeds")}
      <label class="field" data-show="mode:level"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field" data-show="mode:runs"><span>Runs</span><input name="runs" type="number" min="1" value="10" inputmode="numeric"></label>
      <label class="field" data-show="mode:level,runs"><span>Herb</span><select name="herb">
        <option value="auto">Best for my level</option>
        ${HERBS.map(h => `<option value="${h.id}">${h.name} (${h.level})</option>`).join("")}
      </select></label>
      <label class="field"><span>Runs a day</span><input name="perDay" type="number" min="1" max="18" value="4" inputmode="numeric"></label>
    </div>
    <div class="group" data-show="mode:seeds">
      <h2>Seeds in the bank</h2>
      <div class="qtys">${HERBS.map(h => `<label class="qty" data-herb="${h.id}"><span>${esc(h.name)}<span class="lv">${h.level}</span></span><input name="seed-${h.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Patches</h2>
      <div class="fishpick">${PATCHES.map(p => `<label title="${esc(p.note || "")}"><input type="checkbox" name="p-${p.id}"${DEFAULT_PATCHES.includes(p.id) ? " checked" : ""}><span>${esc(p.name)}${p.level ? ` <i>${p.level}</i>` : ""}</span></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Boosts</h2>
      <label class="field"><span>Compost</span><select name="compost">
        ${Object.entries(COMPOST).map(([k, c]) => `<option value="${k}"${k === "ultra" ? " selected" : ""}>${c.name}</option>`).join("")}
      </select></label>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="secateurs" checked><span>Magic secateurs<small>+10% chance to save a life</small></span></label>
        <label class="toggle"><input type="checkbox" name="cape"><span>Farming cape<small>+5%</small></span></label>
        <label class="toggle"><input type="checkbox" name="outfit"><span>Farmer's outfit<small>+2.5% xp</small></span></label>
      </div>
      <label class="field"><span>Anima patch</span><select name="anima">
        <option value="none">Nothing planted</option><option value="attas">Attas (+5% yield)</option><option value="iasor">Iasor (less disease)</option>
      </select></label>
    </div>
    <div class="group">
      <h2>Diaries and unlocks</h2>
      <label class="field"><span>Kandarin diary (Catherby)</span><select name="kandarin">
        <option value="none">Not done</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="elite">Elite</option>
      </select></label>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="kourendEasy"><span>Kourend easy<small>Hosidius disease-free</small></span></label>
        <label class="toggle"><input type="checkbox" name="kourendHard"><span>Kourend hard<small>Hosidius and Farming Guild yield</small></span></label>
        <label class="toggle"><input type="checkbox" name="faladorMedium"><span>Falador medium<small>+10% xp at Falador</small></span></label>
        <label class="toggle"><input type="checkbox" name="fortisChampion"><span>Colosseum Champion<small>Civitas illa Fortis disease-free</small></span></label>
      </div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

function opts(v) {
  return {
    compost: v.compost, secateurs: !!v.secateurs, cape: !!v.cape, outfit: !!v.outfit, anima: v.anima,
    kandarin: v.kandarin, kourendEasy: !!v.kourendEasy, kourendHard: !!v.kourendHard,
    faladorMedium: !!v.faladorMedium, fortisChampion: !!v.fortisChampion,
    patches: PATCHES.filter(p => v["p-" + p.id]).map(p => p.id)
  };
}

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "hLvl", "hXp");
  const f = bindForm(form, "herbs", paint);
  lx.setXp(f.values().hXp);
  onStats(s => { if (s.skills.farming !== undefined) lx.setXp(s.skills.farming); });
  let lastHerbs = null;

  out.addEventListener("click", e => {
    if (!e.target.closest("[data-send]") || !lastHerbs) return;
    const rows = [...document.querySelectorAll("#herb-rows tr")];
    let total = 0;
    for (const [id, n] of Object.entries(lastHerbs)) {
      const name = MIXOLOGY_NAME[id];
      const tr = rows.find(r => r.querySelector(".herbname")?.textContent.startsWith(name));
      const input = tr?.querySelectorAll("input")[1];
      if (!input) continue;
      const add = Math.floor(n);
      input.value = (parseInt(input.value, 10) || 0) + add;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      total += add;
    }
    e.target.closest("[data-send]").textContent = `Added ${fmt(total)} herbs to Mixology`;
    setTimeout(() => { location.hash = "/mixology"; }, 700);
  });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    const startXp = v.hXp, level = levelFromXp(startXp);
    form.querySelectorAll(".qty[data-herb]").forEach(el => el.classList.toggle("locked", level < HERBS.find(h => h.id === el.dataset.herb).level));
    const o = opts(v);
    const seeds = Object.fromEntries(HERBS.map(h => [h.id, Math.max(0, Math.floor(v["seed-" + h.id] || 0))]));
    const perDay = Math.max(1, v.perDay || 4);

    if (level < HERBS[0].level) { out.innerHTML = note(`Herbs start at ${HERBS[0].level} Farming. You're ${level}.`, "ember"); return; }
    if (!o.patches.length) { out.innerHTML = note("Pick the patches you use."); return; }
    if (v.mode === "seeds" && !Object.values(seeds).some(Boolean)) {
      out.innerHTML = note("Enter the herb seeds you have. Each run plants your best seeds first, in your best patches.") + perPatchTable(level, o);
      return;
    }
    const r = simulate({ ...o, mode: v.mode, startXp, target: v.target, runs: v.runs, herb: v.herb, seeds });
    if (r.blocked) { out.innerHTML = note(`${r.blocked.name} needs ${r.blocked.level} Farming. You're ${level}.`, "ember"); return; }

    const herbTotal = Object.values(r.herbsOut).reduce((a, b) => a + b, 0);
    const seedTotal = Object.values(r.seedsUsed).reduce((a, b) => a + b, 0);
    let html = landing({ fromXp: startXp, toXp: r.endXp, skill: "Farming" });
    html += tiles([
      stat(fmt(herbTotal), "herbs expected", "gold"),
      stat(fmt(r.runs), plural(r.runs, "run")),
      stat(fmtDays(Math.ceil(r.runs / perDay)), `at ${perDay} a day`),
      stat(fmt(r.deadPatches, r.deadPatches < 10 ? 1 : 0), "patches lost to disease", r.deadPatches >= 1 ? "ember" : "")
    ]);

    const rows = HERBS.filter(h => r.seedsUsed[h.id]).reverse().map(h => ({
      cells: [h.name, fmt(r.seedsUsed[h.id]), `<b>${fmt(r.herbsOut[h.id])}</b>`, fmt(r.herbsOut[h.id] / r.seedsUsed[h.id], 2)]
    }));
    lastHerbs = r.herbsOut;
    html += section("Herbs", table(["Herb", "Seeds", "Herbs", "Per seed"], rows) +
      `<div class="actions"><button type="button" class="btn-gold" data-send>Add these herbs to Mixology</button></div>`);
    if (v.mode === "seeds" && r.leftover && Object.values(r.leftover).some(Boolean)) {
      const left = HERBS.filter(h => r.leftover[h.id] > 0).map(h => `${fmt(r.leftover[h.id])} ${h.name.toLowerCase()}`);
      html += note(`Not planted yet: ${left.join(", ")}. Those need a higher level.`);
    }
    if (v.herb === "auto" && v.mode !== "seeds") {
      const items = [];
      if (r.startHerb) items.push({ when: "Run 1", what: r.startHerb.name, sub: `${fmt(seedTotal)} seeds over the whole plan`, tone: "moss" });
      for (const e of r.events) items.push({ when: "Run " + fmt(e.run), what: "Switch to " + e.what, sub: `Level ${e.level}, day ${fmt(Math.ceil(e.run / perDay))}`, tone: "moss" });
      html += section("Along the way", timeline(items));
    }
    html += perPatchTable(level, o);
    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Each patch starts with 3 harvest lives, plus 1, 2 or 3 for compost, super or ultra. Every herb picked may use a life; the chance it doesn't depends on your level, the herb and your boosts.</li>
      <li>Expected herbs per patch = lives ÷ (1 − chance to save), times the chance the patch survives disease. Protected patches never die.</li>
      <li>Planting xp comes when you pick the last herb, or when you clear a dead patch.</li>
      <li>Source: OSRS Wiki, Farming (variable crop yield), Herb patch, and the wiki's herb farming calculator.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}

function perPatchTable(level, o) {
  const herb = bestHerb(level) || HERBS[0];
  const list = patchList({ ...o, level });
  if (!list.length) return "";
  return section(`Your patches with ${herb.name.toLowerCase()}`, table(["Patch", "Disease risk", "Herbs", "XP"],
    list.map(p => {
      const r = patchResult(herb, level, o, p);
      return { cells: [p.name + (p.diary ? " (diary)" : ""), p.prot ? "None" : (deathChance(o, false) * 100).toFixed(1) + "%", fmt(r.herbs, 2), fmt(r.xp)] };
    })), "");
}
