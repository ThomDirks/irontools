import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp, MAX_XP } from "../../lib/xp.js";
import { fmt, esc, duration } from "../../lib/format.js";
import { onGroupBank, items as bankItems } from "../../lib/groupbank.js";
import { loadItems } from "../../lib/itemdb.js";
import { landing, stat, tiles, section, note, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Everything in the group bank worth a cast, and what it adds up to";
export const reqs = ["<b>55</b> Magic", "Group bank loaded"];

const NATURE = 561, COINS = 995;
const XP = 65, PER_HOUR = 1200;      // 5 ticks a cast
const PICKS = "ironTools.v2.alch.picks";

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Magic</h2>
      ${levelXpFields("m", 55, xpForLevel(55))}
    </div>
    <div class="group">
      <h2>What to alch</h2>
      <label class="field"><span>Tick items worth at least</span><input name="min" type="number" min="0" value="1000" inputmode="numeric"></label>
      <label class="field"><span>Find an item</span><input name="q" type="search" placeholder="Name" data-nosave></label>
      <label class="toggle"><input type="checkbox" name="staff" checked><span>Fire staff<small>Otherwise 5 fire runes a cast</small></span></label>
      <p class="rw-note">Untick anything you'd rather keep. Your picks stay for next time.</p>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "mLvl", "mXp");
  let db = null, failed = false, bank = null;
  let picks = {};
  try { picks = JSON.parse(localStorage.getItem(PICKS) || "{}"); } catch { /* ignore */ }
  const f = bindForm(form, "alch", paint);
  lx.setXp(f.values().mXp);
  onStats(s => { if (s.skills.magic !== undefined) lx.setXp(s.skills.magic); });
  onGroupBank(s => {
    bank = s.loaded ? bankItems() : null;
    if (bank && !db && !failed) loadItems().then(m => { db = m; f.refresh(); }, () => { failed = true; f.refresh(); });
    f.refresh();
  });

  out.addEventListener("change", e => {
    const box = e.target.closest("[data-pick]");
    if (!box) return;
    picks[box.dataset.pick] = box.checked;
    try { localStorage.setItem(PICKS, JSON.stringify(picks)); } catch { /* ignore */ }
    f.refresh();
  });
  out.addEventListener("click", e => {
    if (!e.target.closest("[data-reset]")) return;
    picks = {};
    try { localStorage.removeItem(PICKS); } catch { /* ignore */ }
    f.refresh();
  });

  function paint(v) {
    if (!bank) { out.innerHTML = note("Load your group bank in the sidebar (Group bank, under your stats) and every alchable item shows up here."); return; }
    if (failed) { out.innerHTML = note("Couldn't reach the OSRS Wiki for item values. Check your connection and reload.", "ember"); return; }
    if (!db) { out.innerHTML = note("Reading item values from the OSRS Wiki…"); return; }

    const list = [];
    for (const [id, qty] of bank) {
      const it = db.get(id);
      if (!it || !it.ha || id === COINS || id === NATURE) continue;
      const on = id in picks ? picks[id] : it.ha >= (v.min || 0);
      list.push({ id, qty, name: it.name, ha: it.ha, on });
    }
    list.sort((a, b) => b.ha * b.qty - a.ha * a.qty);
    const chosen = list.filter(i => i.on);
    const casts = chosen.reduce((s, i) => s + i.qty, 0);
    const gp = chosen.reduce((s, i) => s + i.qty * i.ha, 0);
    const startXp = v.mXp, level = levelFromXp(startXp);
    const natures = bank.get(NATURE) || 0;

    let html = "";
    if (level < 55) html += note(`High Level Alchemy needs 55 Magic. You're ${level}.`, "ember");
    html += landing({ fromXp: startXp, toXp: Math.min(MAX_XP, startXp + casts * XP), skill: "Magic" });
    html += tiles([
      stat(fmt(gp), "gp", "gold"),
      stat(fmt(casts), "casts"),
      stat(duration(casts / PER_HOUR), "of alching"),
      stat(fmt(casts) + (v.staff ? "" : " + " + fmt(casts * 5)), v.staff ? "nature runes" : "nature + fire runes")
    ]);
    if (casts > natures) html += note(`You have ${fmt(natures)} nature runes, ${fmt(casts - natures)} short.`, "ember");

    const q = String(v.q || "").trim().toLowerCase();
    const shown = q ? list.filter(i => i.name.toLowerCase().includes(q)) : list;
    const rows = shown.map(i => `<tr class="${i.on ? "on" : ""}">
      <td><label class="pick"><input type="checkbox" data-pick="${i.id}"${i.on ? " checked" : ""} aria-label="Alch ${esc(i.name)}"><span>${esc(i.name)}</span></label></td>
      <td class="n">${fmt(i.qty)}</td><td class="n">${fmt(i.ha)}</td><td class="n">${fmt(i.qty * i.ha)}</td></tr>`).join("");
    html += section(`${fmt(list.length)} alchable items`, `<div class="tablewrap"><table class="grid-table">
      <thead><tr><th>Item</th><th class="n">Amount</th><th class="n">High alch</th><th class="n">Total</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="4">Nothing matches “${esc(q)}”.</td></tr>`}</tbody></table></div>
      <p class="fine">Only tradeable items have a value here. <button type="button" class="linkish" data-reset>Clear my picks</button></p>`);
    out.innerHTML = html;
  }
}
