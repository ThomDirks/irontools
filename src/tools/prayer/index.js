import { BONES, METHODS, perBone, fromBank, toTarget } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, esc, duration } from "../../lib/format.js";
import { landing, stat, tiles, section, table, note, row, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Your bones through the Chaos altar, the Ectofuntus or the libation bowl";
export const reqs = ["Libation bowl: <b>30</b> Prayer"];

const METHOD_OPTS = [["chaos", "Chaos altar"], ["ecto", "Ectofuntus"], ["libation", "Libation bowl"]];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Prayer</h2>
      ${levelXpFields("p", 43, xpForLevel(43))}
    </div>
    <div class="group">
      <h2>Where</h2>
      ${seg("method", METHOD_OPTS, "chaos")}
      <label class="field" data-show="method:libation"><span>Wine</span><select name="wine">
        <option value="sunfire">Blessed sunfire wine (6 xp a shard)</option>
        <option value="blessed">Blessed wine (5 xp a shard)</option>
      </select></label>
      <label class="field"><span>Zealot's robes pieces</span><select name="zealot">
        ${[0, 1, 2, 3, 4].map(n => `<option value="${n}">${n === 0 ? "None" : n === 4 ? "Full set (5% save)" : n + " (" + (n * 1.25) + "% save)"}</option>`).join("")}
      </select></label>
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${seg("mode", [["bank", "Use my bones"], ["target", "Reach a level"]], "bank")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="70" inputmode="numeric"></label>
      <label class="field" data-show="mode:target"><span>Bones</span><select name="bone">
        ${BONES.map(b => `<option value="${b.id}"${b.id === "dragon" ? " selected" : ""}>${esc(b.name)}</option>`).join("")}
      </select></label>
    </div>
    <div class="group" data-show="mode:bank">
      <h2>Bones in the bank</h2>
      <div class="qtys">${BONES.map(b => `<label class="qty" data-bone="${b.id}"><span>${esc(b.name)}<span class="lv">${b.shardsOnly ? b.shards + " shards" : b.xp}</span></span><input name="b-${b.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

let api = null;
/** Called when you open Prayer from one of its map markers. */
export function preset({ method }) { api?.set("method", method); }

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "pLvl", "pXp");
  const f = bindForm(form, "prayer", paint);
  api = f;
  lx.setXp(f.values().pXp);
  onStats(s => { if (s.skills.prayer !== undefined) lx.setXp(s.skills.prayer); });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    const startXp = v.pXp, level = levelFromXp(startXp);
    const method = v.method, o = { zealot: +v.zealot || 0, wine: v.wine };
    form.querySelectorAll(".qty[data-bone]").forEach(el => {
      const b = BONES.find(x => x.id === el.dataset.bone);
      el.classList.toggle("locked", !perBone(b, method, o));
    });

    let html = "";
    if (method === "libation" && level < METHODS.libation.level) html += note(`The libation bowl needs ${METHODS.libation.level} Prayer. You're ${level}.`, "ember");

    if (v.mode === "bank") {
      const bank = Object.fromEntries(BONES.map(b => [b.id, Math.max(0, Math.floor(v["b-" + b.id] || 0))]));
      const r = fromBank(startXp, bank, method, o);
      if (!r.rows.length && !r.skipped.length) {
        out.innerHTML = html + note("Enter the bones in your bank.") + compare(level, o, "dragon");
        return;
      }
      html += landing({ fromXp: startXp, toXp: r.endXp, skill: "Prayer" });
      html += tiles(methodTiles(method, r, r.rows.reduce((s, x) => s + x.n, 0)));
      if (r.skipped.length) html += note(`${r.skipped.map(b => b.name).join(", ")} can't be used here.`, "ember");
      html += section("Bones", table(["Bones", "Amount", "XP each", "XP"],
        r.rows.map(x => ({ cells: [x.bone.name, fmt(x.n), fmt(x.each, 1), fmt(x.xp)] }))));
      html += compare(level, o, r.rows[r.rows.length - 1]?.bone.id || "dragon");
    } else {
      const r = toTarget(startXp, { type: "level", value: v.target }, v.bone, method, o);
      if (r.impossible) { out.innerHTML = html + note(`${r.bone.name} can't be used at the ${METHODS[method].name.toLowerCase()}.`, "ember"); return; }
      if (!r.bones) { out.innerHTML = html + note(`You're already level ${level}.`, "moss"); return; }
      html += landing({ fromXp: startXp, toXp: r.endXp, skill: "Prayer" });
      html += tiles([stat(fmt(r.bones), r.bone.name.toLowerCase(), "gold"), ...methodTiles(method, r, r.bones).slice(1)]);
      html += compare(level, o, r.bone.id, v.target, startXp);
    }
    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Chaos altar: 3.5× the bone's xp, and a 50% chance the bone isn't used. With zealot's robes, a failed roll gets a second roll for the robes, so a full set saves 52.5% of bones.</li>
      <li>Ectofuntus: 4× the bone's xp, with one bucket of slime per bone. Robes save the bonemeal and slime.</li>
      <li>Libation bowl: bless bones at the exposed altar, chisel them into shards, and offer 5 xp a shard with blessed wine or 6 with blessed sunfire wine. One jug covers 400 shards. Robes save shards but not the wine.</li>
      <li>Source: OSRS Wiki, Chaos Temple, Ectofuntus, Libation bowl, Blessed bone shards and Zealot's robes.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}

function methodTiles(method, r, bones) {
  const t = [stat(fmt(bones), "bones", "gold")];
  if (method === "chaos") t.push(stat(fmt(r.offerings || bones), "offerings on average"));
  if (method === "ecto") {
    t.push(stat(fmt(r.slime || bones), "buckets of slime"));
    t.push(stat(fmt(r.tokens), "ecto-tokens"));
    t.push(stat(duration((r.offerings || bones) / METHODS.ecto.perHour), "at 180 an hour"));
  }
  if (method === "libation") {
    t.push(stat(fmt(r.shards), "blessed bone shards"));
    t.push(stat(fmt(Math.ceil(r.jugs)), "jugs of wine"));
  }
  return t;
}

function compare(level, o, boneId, target, startXp) {
  const bone = BONES.find(b => b.id === boneId);
  const need = target ? Math.max(0, xpForLevel(target) - startXp) : 0;
  const head = ["Where", "XP a bone"].concat(need ? ["Bones to " + target] : []);
  return section(`Every method with ${bone.name.toLowerCase()}`, table(head,
    [["chaos", "Chaos altar"], ["ecto", "Ectofuntus"], ["libation", "Libation bowl (sunfire)"], ["libationB", "Libation bowl (blessed wine)"]].map(([m, name]) => {
      const p = perBone(bone, m.startsWith("libation") ? "libation" : m, { ...o, wine: m === "libationB" ? "blessed" : "sunfire" });
      return { cells: [name, p ? fmt(p.xp, 1) : "–"].concat(need ? [p ? fmt(Math.ceil(need / p.xp)) : "–"] : []) };
    })));
}
