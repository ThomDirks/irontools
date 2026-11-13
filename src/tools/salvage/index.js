import { WRECKS, ALCHABLE, MAGIC_LEVEL, CASTS_PER_HOUR, CREW, deckOf, slug, defaultAlch, bestWreck, hour } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp, MAX_XP } from "../../lib/xp.js";
import { fmt, esc, duration } from "../../lib/format.js";
import { landing, stat, tiles, section, table, note, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Alch or drop each find, and see what every shipwreck makes an hour";
export const reqs = ["<b>15</b> Sailing", `High alch: <b>${MAGIC_LEVEL}</b> Magic`];

const crewOptions = pick => CREW.map(c => `<option value="${c.id}"${c.id === pick ? " selected" : ""}>${esc(c.name)} (${c.d}, ${c.d * 10}% xp)</option>`).join("");
const inWreck = name => WRECKS.filter(w => w.rows.some(r => r.n === name)).map(w => w.id).join(" ");

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Sailing</h2>
      ${levelXpFields("s", 53, xpForLevel(53))}
      <label class="field"><span>Target level</span><input name="target" type="number" min="1" max="99" value="" inputmode="numeric" placeholder="None"></label>
    </div>
    <div class="group">
      <h2>Shipwreck</h2>
      <label class="field"><select name="wreck">
        <option value="auto">Best for my level</option>
        ${WRECKS.map(w => `<option value="${w.id}">${esc(w.name)} (${w.level})</option>`).join("")}
      </select></label>
      <label class="field"><span>Salvage an hour</span><input name="kph" type="number" min="0" max="2000" value="" inputmode="numeric" placeholder="Wiki figure"></label>
      <label class="field"><span>Who hooks</span><select name="mode">
        <option value="me">Me and deckhand 1</option>
        <option value="solo">Just me</option>
        <option value="afk">Both deckhands (AFK)</option>
      </select></label>
      <label class="field" data-show="mode:me,afk"><span>Deckhand 1</span><select name="d1">${crewOptions("jenkins")}</select></label>
      <label class="field" data-show="mode:afk"><span>Deckhand 2</span><select name="d2">${crewOptions("joblessjim")}</select></label>
    </div>
    <div class="group">
      <h2>Alch or drop</h2>
      <p class="rw-note">Ticked items get high alched. The rest are dropped or kept.</p>
      <div class="alch-list">${ALCHABLE.map(i => `<label class="toggle slim" data-in="${inWreck(i.name)}"><input type="checkbox" name="${i.key}"${defaultAlch(i) ? " checked" : ""}><span>${esc(i.name)}<small>${fmt(i.ha)} gp</small></span></label>`).join("")}</div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "sLvl", "sXp");
  const f = bindForm(form, "salvage", paint);
  lx.setXp(f.values().sXp);
  let magic = null;
  onStats(s => {
    magic = s.skills.magic !== undefined ? levelFromXp(s.skills.magic) : null;
    if (s.skills.sailing !== undefined) lx.setXp(s.skills.sailing); else f.refresh();
  });

  function settings(v, w, ownKph) {
    return {
      kph: ownKph && v.kph > 0 ? v.kph : 0,
      mode: v.mode || "me",
      d1: deckOf(v.d1), d2: deckOf(v.d2),
      alch: name => !!v["alch-" + slug(name)]
    };
  }

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    const startXp = v.sXp, level = levelFromXp(startXp);
    const w = v.wreck === "auto" ? bestWreck(level) : WRECKS.find(x => x.id === v.wreck);
    form.querySelectorAll(".alch-list [data-in]").forEach(el => { el.hidden = !w || !el.dataset.in.split(" ").includes(w.id); });
    const kphIn = form.querySelector('[name="kph"]');
    if (w) kphIn.placeholder = fmt(Math.round(hour(w, { ...settings(v, w, false), alch: () => false }).kph)) + (v.mode === "afk" ? " (estimate)" : " (wiki)");
    if (!w) { out.innerHTML = note(`Salvaging starts at ${WRECKS[0].level} Sailing. You're ${level}.`, "ember"); return; }
    if (level < w.level) { out.innerHTML = note(`${w.name}s need ${w.level} Sailing. You're ${level}.`, "ember"); return; }

    const h = hour(w, settings(v, w, true));
    let html = "";
    const target = v.target | 0;
    if (target > level) {
      // level by level, moving to better wrecks on "auto"
      let xp = startXp, hours = 0, gp = 0, casts = 0;
      const goal = xpForLevel(Math.min(99, target));
      const legs = [];
      while (xp < goal) {
        const lv = levelFromXp(xp);
        const cw = v.wreck === "auto" ? bestWreck(lv) : w;
        const next = WRECKS.find(x => x.level > lv);
        const stop = v.wreck === "auto" && next ? Math.min(goal, xpForLevel(next.level)) : goal;
        const ch = hour(cw, settings(v, cw, cw === w));
        const t = (stop - xp) / ch.sailing;
        hours += t; gp += t * ch.gp; casts += t * ch.casts;
        const last = legs[legs.length - 1];
        if (last && last.w === cw) last.t += t; else legs.push({ w: cw, t, from: lv });
        xp = Math.min(MAX_XP, stop);
      }
      html += landing({ fromXp: startXp, toXp: xp, skill: "Sailing" });
      html += tiles([
        stat(duration(hours), "salvaging", "gold"),
        stat(fmt(Math.round(gp)), "gp from alchs and coins"),
        stat(fmt(Math.round(casts)), "alchs"),
        stat(fmt(Math.round(casts * 65)), "Magic xp")
      ]);
      if (legs.length > 1) html += section("Wrecks along the way", table(["Shipwreck", "From level", "Hours"],
        legs.map(l => ({ cells: [l.w.name, l.from, duration(l.t)] }))));
    }

    html += section(`${w.name}, an hour`, tiles([
      stat(fmt(Math.round(h.sailing)), "Sailing xp", target > level ? "" : "gold"),
      stat(fmt(Math.round(h.gp)), "gp"),
      stat(fmt(Math.round(h.magic)), "Magic xp"),
      stat(fmt(Math.ceil(h.natures)), "nature runes")
    ]));
    if (magic !== null && magic < MAGIC_LEVEL && h.casts > 0) html += note(`High alch needs ${MAGIC_LEVEL} Magic. You're ${magic}.`, "ember");
    if (h.casts > CASTS_PER_HOUR) html += note("That's more alchs than fit in an hour.", "ember");

    const rare = h.rows.filter(r => r.perHour < 0.05);
    const rows = h.rows.filter(r => r.perHour >= 0.05).sort((a, b) => (b.ha || b.cash || 0) * b.perHour - (a.ha || a.cash || 0) * a.perHour);
    html += section("What you sort", table(["Item", "An hour", "High alch", "Choice", "gp an hour"], rows.map(r => ({
      cls: r.alch || r.cash ? "on" : "",
      cells: [esc(r.n), r.perHour >= 10 ? fmt(Math.round(r.perHour)) : r.perHour.toFixed(1), r.ha ? fmt(r.ha) : "", r.cash ? "Coins" : r.alch ? "Alch" : r.ha ? "Drop" : "", r.value ? fmt(Math.round(r.value)) : ""]
    })), { foot: rare.length ? "Rarer finds: " + rare.map(r => `${esc(r.n)} (1 in ${fmt(Math.round(1 / r.p))})`).join(", ") + "." : "" }));

    html += section("Every shipwreck", table(["Shipwreck", "Level", "Salvage", "Sailing xp", "gp"], WRECKS.map(x => {
      const xh = hour(x, settings(v, x, x === w));
      return { cls: level < x.level ? "off" : x === w ? "on" : "", cells: [x.name, x.level, fmt(xh.kph), fmt(Math.round(xh.sailing)), fmt(Math.round(xh.gp))] };
    })), " <small>an hour</small>");

    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Salvage an hour starts from the wiki's money making guide for each wreck. Type your own if you're faster or slower.</li>
      <li>A deckhand rolls every 5 ticks to your 4, at their deckhandiness × 10% of your chance. So a deckhandiness 4 crewmate brings in 32% of what you would on the same hook.</li>
      <li>Crew-hooked salvage gives 10% xp per point of deckhandiness. Sorting xp is the same whoever hooked it.</li>
      <li>AFK rates are worked out from those two rules, not measured. Treat them as an estimate.</li>
      <li>Each sorted salvage rolls once on its main table, plus the rare rolls (bottles, collectibles, clues) on top.</li>
      <li>Coins and platinum tokens always count. Alching is 65 Magic xp and a nature rune a cast.</li>
      <li>Source: OSRS Wiki, Shipwreck salvaging and each salvage's loot table.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}
