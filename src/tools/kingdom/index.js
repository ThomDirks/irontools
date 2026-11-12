import "./style.css";
import { CATEGORIES, MAX_PER, MAX_POINTS, rules, simulateDays, kingdomYield, categoryYield, daysFor, favourToPct } from "./calc.js";
import { bindForm } from "../../lib/form.js";
import { fmt, esc, short } from "../../lib/format.js";

export const subtitle = "Set your workers like you would in game and see what the kingdom brings in";
export const reqs = ["Throne of Miscellania", "Royal Trouble for hardwood and seeds"];

const ICON = {
  wood: '<path d="M4 15l9-9 5 5-9 9z"/><circle cx="16" cy="8" r="2.5"/><path d="M6.5 12.5l5 5"/>',
  herbs: '<path d="M12 21V11"/><path d="M12 11c-5 0-7-3-7-7 4 0 7 2 7 7z"/><path d="M12 14c4 0 7-2 7-6-4 0-7 2-7 6z"/>',
  mining: '<path d="M5 19l9-9"/><path d="M11 5c3-1 6 0 8 2-2-1-5-1-7 1"/><circle cx="17" cy="17" r="3"/>',
  fishing: '<path d="M3 12c3-4 9-5 14-1l4-3v8l-4-3c-5 4-11 3-14-1z"/><circle cx="8" cy="11" r="1"/>',
  hardwood: '<rect x="4" y="7" width="16" height="5" rx="1"/><rect x="4" y="13" width="16" height="5" rx="1"/><path d="M8 7v5M14 13v5"/>',
  farm: '<path d="M12 20c-4 0-6-3-6-6 0-4 3-8 6-10 3 2 6 6 6 10 0 3-2 6-6 6z"/><path d="M12 20V9"/>'
};

const DEFAULTS = { wood: 0, herbs: 5, mining: 0, fishing: 0, hardwood: 10, farm: 0 };

export const html = `<div class="kd">
  <form class="kd-settings setup" onsubmit="return false">
    ${CATEGORIES.map(c => `<input type="hidden" name="w-${c.id}" value="${DEFAULTS[c.id]}">`).join("")}
    <div class="group">
      <h2>Your kingdom</h2>
      <div class="toggles"><label class="toggle"><input type="checkbox" name="rt" checked><span>Royal Trouble done<small>15 workers, 75k a day, hardwood and seeds</small></span></label></div>
      <div class="pair">
        <label class="field"><span>Coffer</span><input name="coffer" type="number" min="0" step="100000" value="7500000" inputmode="numeric"></label>
        <label class="field"><span>Approval %</span><input name="approval" type="number" min="25" max="100" value="100" inputmode="numeric"></label>
      </div>
      <label class="field"><span>Top approval back up</span><select name="topUp">
        <option value="1">Every day</option><option value="3">Every 3 days</option><option value="7">Every week</option><option value="14">Every 2 weeks</option><option value="0">Never</option>
      </select></label>
    </div>
    <div class="group">
      <h2>Collect after</h2>
      <div class="kd-days"><input name="days" type="range" min="1" max="230" value="30" aria-label="Days"><output></output></div>
    </div>
    <div class="group">
      <h2>How long until</h2>
      <div class="pair">
        <label class="field"><span>Amount</span><input name="goalQty" type="number" min="0" value="3000" inputmode="numeric"></label>
        <label class="field"><span>Of</span><select name="goalCat">${CATEGORIES.map(c => `<option value="${c.id}"${c.id === "hardwood" ? " selected" : ""}>${c.name}</option>`).join("")}</select></label>
      </div>
      <p class="kd-goal hint"></p>
    </div>
  </form>

  <div class="kd-main">
    <section class="rs-panel" aria-label="Manage kingdom">
      <header class="rs-title">Managing Miscellania<span class="rs-x" aria-hidden="true">×</span></header>
      <div class="rs-top">
        <div class="rs-stat"><span>Coffers</span><b class="rs-coffer"></b></div>
        <div class="rs-stat rs-appr"><span>Approval</span><div class="rs-bar"><i></i></div><b class="rs-apprv"></b></div>
      </div>
      <div class="rs-box">
        ${CATEGORIES.map(c => `<div class="rs-row" data-cat="${c.id}">
          <span class="rs-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[c.id]}</svg></span>
          <span class="rs-name">${c.name}${c.options.length > 1
            ? `<select name="o-${c.id}" class="rs-select">${c.options.map(o => `<option value="${o.id}">${esc(o.name)}</option>`).join("")}</select>`
            : `<small>${esc(c.options[0].name)}</small>`}</span>
          <button type="button" class="rs-btn" data-step="-1" aria-label="One fewer worker on ${c.name}">−</button>
          <span class="rs-pips" role="slider" tabindex="0" aria-label="Workers on ${c.name}" aria-valuemin="0" aria-valuemax="${MAX_PER}">${Array.from({ length: MAX_PER }, (_, i) => `<i data-n="${i + 1}"></i>`).join("")}</span>
          <button type="button" class="rs-btn" data-step="1" aria-label="One more worker on ${c.name}">+</button>
          <span class="rs-count"></span>
          <span class="rs-day"></span>
        </div>`).join("")}
      </div>
      <div class="rs-idle"><span>Idle</span><span class="rs-idlepips"></span><b></b></div>
    </section>

    <section class="rs-panel rs-collect" aria-label="Resources collected">
      <header class="rs-title">Resources collected<span class="rs-sub"></span></header>
      <div class="rs-slots"></div>
      <div class="rs-foot"></div>
    </section>

    <section class="kd-chart" aria-label="Approval and coffer over time"></section>
  </div>
</div>`;

export function mount(root) {
  const form = root.querySelector(".kd-settings");
  const main = root.querySelector(".kd-main");
  const f = bindForm(form, "kingdom", paint);
  queueMicrotask(() => f.refresh());
  // the in-game panel's controls live outside the settings form
  main.querySelectorAll("select[name^='o-']").forEach(sel => {
    form.appendChild(Object.assign(document.createElement("input"), { type: "hidden", name: sel.name, value: sel.value }));
    const saved = form.querySelector(`input[name="${sel.name}"]`);
    try { const s = JSON.parse(localStorage.getItem("ironTools.v2.kingdom") || "{}"); if (s[sel.name]) { sel.value = s[sel.name]; saved.value = s[sel.name]; } } catch { /* ignore */ }
    sel.addEventListener("change", () => { saved.value = sel.value; saved.dispatchEvent(new Event("input", { bubbles: true })); });
  });

  const get = id => +(form.querySelector(`[name="w-${id}"]`).value || 0);
  const set = (id, n) => {
    const v = f.values(), total = CATEGORIES.reduce((s, c) => s + (c.id === id ? 0 : get(c.id)), 0);
    const cap = rules(!!v.rt).workers;
    const cat = CATEGORIES.find(c => c.id === id);
    if (cat.rt && !v.rt) n = 0;
    n = Math.max(0, Math.min(MAX_PER, n, cap - total));
    const el = form.querySelector(`[name="w-${id}"]`);
    if (+el.value === n) { main.querySelector(".rs-idle").classList.add("rs-shake"); setTimeout(() => main.querySelector(".rs-idle").classList.remove("rs-shake"), 400); return; }
    el.value = n;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  main.addEventListener("click", e => {
    const row = e.target.closest(".rs-row");
    if (!row) return;
    const id = row.dataset.cat;
    const step = e.target.closest("[data-step]");
    if (step) set(id, get(id) + +step.dataset.step);
    const pip = e.target.closest(".rs-pips i");
    if (pip) set(id, +pip.dataset.n === get(id) ? +pip.dataset.n - 1 : +pip.dataset.n);
  });
  main.addEventListener("keydown", e => {
    const p = e.target.closest(".rs-pips");
    if (!p) return;
    const id = p.closest(".rs-row").dataset.cat;
    if (["ArrowRight", "ArrowUp"].includes(e.key)) { set(id, get(id) + 1); e.preventDefault(); }
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) { set(id, get(id) - 1); e.preventDefault(); }
  });

  function paint(v) {
    const rt = !!v.rt, r = rules(rt);
    const settings = { rt, coffer: Math.max(0, Math.min(r.cofferMax, v.coffer || 0)), approval: v.approval || 100, topUpEvery: +v.topUp };
    // drop workers that no longer fit (Royal Trouble switched off)
    let total = 0;
    for (const c of CATEGORIES) {
      const el = form.querySelector(`[name="w-${c.id}"]`);
      let n = +el.value || 0;
      if (c.rt && !rt) n = 0;
      n = Math.min(n, r.workers - total);
      el.value = n; total += n;
    }
    const days = Math.max(1, Math.min(230, v.days || 30));
    form.querySelector(".kd-days output").textContent = days === 1 ? "1 day" : days + " days";

    const sim = simulateDays({ ...settings, days });
    const one = simulateDays({ ...settings, days: 1 });
    const alloc = Object.fromEntries(CATEGORIES.map(c => [c.id, { workers: get(c.id), option: main.querySelector(`select[name="o-${c.id}"]`)?.value || c.options[0].id }]));

    // the interface
    main.querySelector(".rs-coffer").textContent = fmt(settings.coffer);
    const appr = favourToPct(Math.round(settings.approval * 127 / 100));
    main.querySelector(".rs-bar i").style.width = appr + "%";
    main.querySelector(".rs-apprv").textContent = Math.round(appr) + "%";
    for (const c of CATEGORIES) {
      const row = main.querySelector(`.rs-row[data-cat="${c.id}"]`);
      const n = alloc[c.id].workers;
      row.classList.toggle("rs-locked", !!c.rt && !rt);
      row.querySelectorAll(".rs-pips i").forEach((pip, i) => pip.classList.toggle("on", i < n));
      row.querySelector(".rs-pips").setAttribute("aria-valuenow", n);
      row.querySelector(".rs-count").textContent = n;
      const opt = c.options.find(o => o.id === alloc[c.id].option) || c.options[0];
      let daily = n ? categoryYield(opt, n, one.points).items.filter(i => i.main) : [];
      // tables of many items (herbs, farm seeds) read better as one total
      if (opt.mainTable && daily.length) daily = [{ name: opt.mainTable === "Herbs" ? "grimy herbs" : "seeds", qty: daily.reduce((s, i) => s + i.qty, 0) }];
      row.querySelector(".rs-day").innerHTML = c.rt && !rt ? "Needs Royal Trouble"
        : daily.length ? daily.map(i => `${fmt(i.qty)} <small>${esc(i.name.toLowerCase())}</small>`).join("<br>") + "<em> a day</em>" : "";
    }
    const idle = r.workers - total;
    main.querySelector(".rs-idlepips").innerHTML = Array.from({ length: r.workers }, (_, i) => `<i class="${i < idle ? "on" : ""}"></i>`).join("");
    main.querySelector(".rs-idle b").textContent = idle ? `${idle} idle` : "All working";

    // what gets collected
    const yields = kingdomYield(alloc, sim.points);
    const merged = new Map();
    for (const y of yields) for (const it of y.items) {
      if (it.qty < 0.005) continue;
      const m = merged.get(it.name) || { name: it.name, qty: 0, main: it.main };
      m.qty += it.qty; m.main = m.main || it.main; merged.set(it.name, m);
    }
    const items = [...merged.values()].sort((a, b) => (b.main - a.main) || (b.qty - a.qty));
    main.querySelector(".rs-sub").textContent = `after ${days === 1 ? "1 day" : days + " days"}`;
    main.querySelector(".rs-slots").innerHTML = items.length
      ? items.map(i => `<div class="rs-slot${i.main ? " main" : ""}" title="${esc(i.name)}"><b>${qtyText(i)}</b><span>${esc(i.name)}</span></div>`).join("")
      : `<p class="rs-empty">Put some workers to work.</p>`;
    const foot = [`Coffer spent: <b>${fmt(sim.paid)}</b>`, `Left: <b>${short(sim.coffer)}</b>`, `Approval at the end: <b>${Math.round(favourToPct(sim.endFavour))}%</b>`];
    if (sim.capped) foot.push(`<span class="rs-red">Storage is full at ${fmt(MAX_POINTS)} resource points. Collect sooner.</span>`);
    if (days > 30) foot.push(`<span class="rs-yel">Visit Miscellania or Etceteria at least every 30 days or collection pauses.</span>`);
    main.querySelector(".rs-foot").innerHTML = foot.join("<span class='rs-dot'></span>");

    chart(main.querySelector(".kd-chart"), sim.log, r.cofferMax);

    // how long until
    const cat = CATEGORIES.find(c => c.id === v.goalCat);
    const opt = cat.options.find(o => o.id === alloc[cat.id].option) || cat.options[0];
    const d = daysFor(v.goalQty, opt, alloc[cat.id].workers, settings);
    form.querySelector(".kd-goal").innerHTML = !alloc[cat.id].workers ? `No workers on ${cat.name.toLowerCase()} yet.`
      : d ? `<b>${fmt(d)} ${d === 1 ? "day" : "days"}</b> for ${fmt(v.goalQty)} ${esc(opt.name.toLowerCase())} with ${alloc[cat.id].workers} workers.`
      : "More than 400 days with these settings.";
  }
}

// whole numbers for the main haul; expected extras get one decimal, and
// anything under one reads as a chance rather than "0.90"
function qtyText(i) {
  if (i.main || i.qty >= 10) return fmt(i.qty);
  if (i.qty >= 1) return i.qty.toFixed(1).replace(/\.0$/, "");
  return "~" + Math.max(1, Math.round(i.qty * 100)) + "%";
}

function chart(el, log, cofferMax) {
  const W = 600, H = 120, n = log.length;
  if (n < 2) { el.innerHTML = ""; return; }
  const x = i => 30 + (i / (n - 1)) * (W - 40);
  const ya = f => 10 + (1 - (f / 127)) * (H - 30);
  const yc = c => 10 + (1 - c / cofferMax) * (H - 30);
  const path = (fn, key) => log.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${fn(p[key]).toFixed(1)}`).join("");
  el.innerHTML = `<h3>Approval and coffer over ${n} days</h3>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Approval and coffer by day">
    <line x1="30" x2="${W - 10}" y1="${H - 20}" y2="${H - 20}" class="ax"/>
    <path d="${path(ya, "favour")}" class="ap"/>
    <path d="${path(yc, "coffer")}" class="cf"/>
    <text x="30" y="${H - 6}" class="tk">Day 1</text><text x="${W - 10}" y="${H - 6}" class="tk" text-anchor="end">Day ${n}</text>
  </svg>
  <p class="kd-legend"><span class="ap"></span>Approval <span class="cf"></span>Coffer</p>`;
}
