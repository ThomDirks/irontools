import { FISH, cookBank, planToTarget, successChance, stopBurnLevel, targetXpOf } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, plural, esc } from "../../lib/format.js";
import { fillButton, bindFill } from "../../lib/groupbank.js";
import { landing, stat, tiles, section, table, note, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Raw fish into levels, with burns taken off at every level";
export const reqs = ["Burn rates from the OSRS Wiki"];

const SPOTS = [
  ["fire", "Fire"],
  ["range", "Range"],
  ["lumbridge", "Lumbridge Castle range"],
  ["hos5", "Hosidius kitchen (+5%)"],
  ["hos10", "Hosidius kitchen, elite diary (+10%)"]
];
const DEFAULT_PICK = ["karambwan", "lobster", "swordfish", "monkfish", "shark", "anglerfish"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Cooking</h2>
      ${levelXpFields("k", 30, xpForLevel(30))}
    </div>
    <div class="group">
      <h2>Where</h2>
      <label class="field"><select name="spot">${SPOTS.map(([v, l]) => `<option value="${v}"${v === "hos5" ? " selected" : ""}>${l}</option>`).join("")}</select></label>
      <label class="toggle"><input type="checkbox" name="gauntlets"><span>Cooking gauntlets<small>Lobster, swordfish, monkfish, shark, anglerfish</small></span></label>
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${seg("mode", [["bank", "Cook my bank"], ["target", "Reach a level"]], "bank")}
    </div>
    <div class="group" data-show="mode:target">
      <label class="field"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <div class="field"><span>Fish you'll cook</span></div>
      <div class="fishpick">${FISH.map(f => `<label><input type="checkbox" name="use-${f.id}"${DEFAULT_PICK.includes(f.id) ? " checked" : ""}><span>${esc(f.name)} <i>${f.level}</i></span></label>`).join("")}</div>
      <div class="linkbtns"><button type="button" class="linkbtn" data-pick="all">All</button><button type="button" class="linkbtn" data-pick="none">None</button></div>
    </div>
    <div class="group" data-show="mode:bank">
      ${fillButton()}
      <div class="qty bank-head"><span></span><span>Raw in bank</span></div>
      <div class="qtys">${FISH.map(f => `<label class="qty" data-fish="${f.id}"><span>${esc(f.name)}<span class="lv">${f.level}</span></span><input name="raw-${f.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

const pct = p => (p * 100).toFixed(p >= .995 && p < 1 ? 1 : 0) + "%";

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "kLvl", "kXp");
  const f = bindForm(form, "cooking", paint);
  lx.setXp(f.values().kXp);
  bindFill(root, count => {
    let total = 0;
    for (const x of FISH) { const n = count(x.raw); total += n; f.set("raw-" + x.id, n); }
    return total;
  });
  onStats(s => { if (s.skills.cooking !== undefined) lx.setXp(s.skills.cooking); });
  form.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => {
    form.querySelectorAll('.fishpick input').forEach(i => { i.checked = b.dataset.pick === "all"; });
    f.refresh();
  }));

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    const startXp = v.kXp, level = levelFromXp(startXp);
    const spot = v.spot, g = !!v.gauntlets;
    form.querySelectorAll(".qty[data-fish]").forEach(el => {
      el.classList.toggle("locked", level < FISH.find(x => x.id === el.dataset.fish).level);
    });

    let html = "";
    if (v.mode === "bank") {
      const bank = Object.fromEntries(FISH.map(x => [x.id, Math.max(0, Math.floor(v["raw-" + x.id] || 0))]));
      const r = cookBank(startXp, bank, spot, g);
      if (!r.rows.length) { out.innerHTML = note("Enter the raw fish in your bank. They're cooked lowest level first, so the ones that burn most get cooked once you're higher.") + burnTable(level, spot, g, null); return; }
      const cooked = r.rows.reduce((s, x) => s + x.cooked, 0), burnt = r.rows.reduce((s, x) => s + x.burnt, 0);
      const locked = r.rows.filter(x => x.locked);
      html += landing({ fromXp: startXp, toXp: r.endXp, skill: "Cooking" });
      html += tiles([
        stat(fmt(cooked), "cooked", "gold"),
        stat(fmt(burnt), "expected burns", burnt >= 1 ? "ember" : ""),
        stat(fmt(cooked + burnt), "raw fish"),
        stat(fmt(cooked + burnt ? burnt / (cooked + burnt) * 100 : 0, 1) + "%", "burnt overall")
      ]);
      if (locked.length) html += note(`Still locked at the end: ${locked.map(x => `${fmt(x.locked)} ${x.fish.name.toLowerCase()} (${x.fish.level})`).join(", ")}.`, "ember");
      html += section("In cooking order", table(["Fish", "Raw", "Cooked", "Burnt", "Levels", "XP"],
        r.rows.map(x => ({ cls: x.locked ? "off" : "", cells: [x.fish.name, fmt(x.raw), fmt(x.cooked), fmt(x.burnt), x.fromLv === x.toLv ? String(x.toLv) : `${x.fromLv} → ${x.toLv}`, fmt(x.gained)] }))));
      html += burnTable(level, spot, g, r.rows.map(x => x.fish.id));
    } else {
      const allowed = FISH.filter(x => v["use-" + x.id]).map(x => x.id);
      if (!allowed.length) { out.innerHTML = note("Pick the fish you'll cook and the plan uses the best of them at every level."); return; }
      const targetXp = targetXpOf({ type: "level", value: v.target });
      if (targetXp <= startXp) { out.innerHTML = note(`You're already level ${level}.`, "moss"); return; }
      const p = planToTarget(startXp, targetXp, allowed, spot, g);
      const raw = p.segs.reduce((s, x) => s + x.raw, 0), burnt = p.segs.reduce((s, x) => s + x.burnt, 0);
      html += landing({ fromXp: startXp, toXp: p.endXp, skill: "Cooking" });
      html += tiles([
        stat(fmt(raw), "raw fish", "gold"),
        stat(fmt(burnt), "expected burns", burnt >= 1 ? "ember" : ""),
        stat(fmt(raw - burnt), "cooked"),
        stat(String(p.segs.length), p.segs.length === 1 ? "kind of fish" : "kinds of fish")
      ]);
      if (p.blocked) {
        const lowest = Math.min(...FISH.filter(x => allowed.includes(x.id)).map(x => x.level));
        html += note(`None of your fish can be cooked at level ${p.blocked}. The lowest you picked needs ${lowest}.`, "ember");
      }
      html += section("The plan", table(["Fish", "Levels", "Raw", "Burnt", "Success"],
        p.segs.map(s => ({
          cells: [s.fish.name, `${s.fromLv} → ${s.toLv}`, `<b>${fmt(s.raw)}</b>`, fmt(s.burnt),
            `${pct(successChance(s.fish, s.fromLv, spot, g))} → ${pct(successChance(s.fish, Math.max(s.fromLv, s.toLv - 1), spot, g))}`]
        })), { foot: "Each level uses whichever of your fish gives the most xp per raw fish, burns included." }));
      html += burnTable(level, spot, g, allowed);
    }
    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Success chance at each level uses the wiki's low and high values for that fish and cooking spot, with its formula: (1 + floor(low×(99−L)/98 + high×(L−1)/98 + 0.5)) / 256.</li>
      <li>Burnt fish give no xp. The chance is recalculated every level, so later fish burn less than the first ones.</li>
      <li>Gauntlets only change lobster, swordfish, monkfish, shark and anglerfish. At Hosidius they stack for those that have a wiki value for it; swordfish gets no extra.</li>
      <li>Karambwan needs Tai Bwo Wannai Trio to cook. Source: OSRS Wiki cooked food pages.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}

function burnTable(level, spot, g, ids) {
  const list = ids && ids.length ? FISH.filter(f => ids.includes(f.id)) : FISH.filter(f => f.level <= Math.max(level, 1) + 15);
  return section("Burn rates here", table(["Fish", "Level", "XP", "Success now", "Stops burning"],
    list.map(f => {
      const p = successChance(f, level, spot, g), stop = stopBurnLevel(f, spot, g);
      return { cls: level < f.level ? "off" : "", cells: [f.name, f.level, fmt(f.xp, f.xp % 1 ? 1 : 0), level < f.level ? "locked" : pct(p), stop ? String(stop) : "never"] };
    })));
}
