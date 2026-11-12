// Map camera, routing, sidebar, hiscores box and the arrival sequence.
import { TOOLS, icon } from "../tools/registry.js";
import { lookup, onStats, savedName } from "../lib/stats.js";
import { levelFromXp } from "../lib/xp.js";
import { esc } from "../lib/format.js";

const SVGNS = "http://www.w3.org/2000/svg";
const MAP_W = 3000, MAP_H = 2125;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = id => document.getElementById(id);
const body = document.body;
const cam = $("cam"), mapEl = $("map"), pins = $("pins");

let current = null;
const views = {};

function mk(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

/* ---------------- markers ---------------- */
function drawMarkers() {
  const g = $("markers");
  for (const t of TOOLS) {
    const m = mk("g", { class: "marker", "data-tool": t.id, role: "link", "aria-label": t.title });
    m.appendChild(mk("circle", { class: "pulse", cx: t.x, cy: t.y, r: 26 }));
    m.appendChild(mk("circle", { class: "halo", cx: t.x, cy: t.y, r: 38 }));
    m.appendChild(mk("circle", { class: "pin", cx: t.x, cy: t.y, r: 13 }));
    const lbl = mk("text", { class: "lbl", x: t.x, y: t.y - 82, "text-anchor": "middle" });
    lbl.textContent = t.title;
    const sk = mk("text", { class: "lbl-skill", x: t.x, y: t.y - 50, "text-anchor": "middle" });
    sk.textContent = t.place;
    m.append(lbl, sk);
    m.addEventListener("click", () => { location.hash = "/" + t.id; });
    g.appendChild(m);
  }
}

/* ---------------- sidebar ---------------- */
function drawNav() {
  $("nav").innerHTML = TOOLS.map(t => `
    <a class="nav-item" href="#/${t.id}" data-tool="${t.id}">
      <span class="nav-ico">${icon(t.skill)}</span>
      <span class="nav-name"><span>${esc(t.title)}${t.isNew ? '<i class="badge">new</i>' : ""}</span>${t.skillName !== t.title ? `<small>${esc(t.skillName)}</small>` : ""}</span>
      <span class="nav-lv" data-skill="${t.skill}"></span>
    </a>`).join("");
  $("nav").querySelectorAll(".nav-item").forEach(a => {
    const m = () => document.querySelector(`.marker[data-tool="${a.dataset.tool}"]`);
    a.addEventListener("mouseenter", () => m()?.classList.add("hot"));
    a.addEventListener("mouseleave", () => m()?.classList.remove("hot"));
    a.addEventListener("click", () => closeMenu());
  });
  const menu = $("menu");
  menu.addEventListener("click", () => {
    const open = $("side").classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
}
function closeMenu() {
  $("side").classList.remove("open");
  $("menu").setAttribute("aria-expanded", "false");
}

/* ---------------- camera ---------------- */
// The map is cover-fitted, so work out where a map pixel lands on screen,
// then translate+scale so it ends up in the middle of the stage.
function camSet(t, k) {
  const W = cam.clientWidth, H = cam.clientHeight;
  const s = Math.max(W / MAP_W, H / MAP_H);
  const dw = MAP_W * s, dh = MAP_H * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
  let px = W / 2, py = H / 2;
  if (t) { px = ox + (t.x / MAP_W) * dw; py = oy + (t.y / MAP_H) * dh; }
  let dx = W / 2 - px * k, dy = H / 2 - py * k;
  // keep the map covering the screen
  const loX = W - (ox + dw) * k, hiX = -ox * k, loY = H - (oy + dh) * k, hiY = -oy * k;
  dx = loX > hiX ? (loX + hiX) / 2 : Math.min(hiX, Math.max(loX, dx));
  dy = loY > hiY ? (loY + hiY) / 2 : Math.min(hiY, Math.max(loY, dy));
  cam.style.transform = `translate(${dx}px,${dy}px) scale(${k})`;
}
function camTo(t) {
  if (t) { camSet(t, window.innerWidth < 760 ? 2.2 : 2.8); cam.style.filter = "brightness(.7)"; }
  else { camSet(null, 1.06); cam.style.filter = "none"; }
}
let raf;
window.addEventListener("resize", () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const prev = cam.style.transition;
    cam.style.transition = "none";
    camTo(TOOLS.find(x => x.id === current) || null);
    requestAnimationFrame(() => { cam.style.transition = prev; });
  });
});

/* ---------------- routing ---------------- */
function go(id) {
  const t = TOOLS.find(x => x.id === id) || null;
  if (current && views[current]) views[current].classList.remove("on");
  current = t ? t.id : null;
  document.querySelectorAll(".nav-item").forEach(a => a.toggleAttribute("aria-current", a.dataset.tool === current));
  document.querySelectorAll(".nav-item[aria-current]").forEach(a => a.setAttribute("aria-current", "page"));
  if (t) {
    body.classList.add("deep");
    views[t.id].classList.add("on");
    document.title = `${t.title} · Iron Tools`;
    document.dispatchEvent(new CustomEvent("irontools:view", { detail: t.id }));
    camTo(t);
    window.scrollTo(0, 0);
    setTimeout(() => views[t.id].querySelector("h1")?.focus({ preventScroll: true }), 350);
  } else {
    body.classList.remove("deep");
    document.title = "Iron Tools · Old School RuneScape calculators";
    camTo(null);
  }
}
function route() {
  const id = location.hash.replace(/^#\/?/, "");
  if (id === "calibrate") return;
  const found = TOOLS.some(t => t.id === id) ? id : null;
  if (found !== current) go(found);
}
window.addEventListener("hashchange", route);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && current && !e.target.closest("input,select")) location.hash = "/";
});

/* ---------------- views ---------------- */
async function buildViews() {
  const host = $("views");
  const mods = await Promise.all(TOOLS.map(t => t.load()));
  TOOLS.forEach((t, i) => {
    const mod = mods[i];
    const sec = document.createElement("section");
    sec.className = "view";
    sec.dataset.view = t.id;
    const reqs = (mod.reqs || []).map(r => `<span class="req-chip">${r}</span>`).join("");
    sec.innerHTML = `<div class="view-frame">
      <header class="view-head">
        <span class="nav-ico">${icon(t.skill)}</span>
        <div><h1 tabindex="-1">${esc(t.title)}</h1><p>${esc(mod.subtitle || t.skillName)}</p></div>
        <div class="reqs">${reqs}</div>
      </header>
      <div class="view-body">${mod.html}</div>
    </div>`;
    host.appendChild(sec);
    views[t.id] = sec;
    try { mod.mount(sec.querySelector(".view-body")); }
    catch (err) { console.error(`[${t.id}]`, err); }
  });
}

/* ---------------- hiscores ---------------- */
function bindStats() {
  const form = $("rsn"), name = $("rsn-name"), btn = $("rsn-go"), note = $("rsn-note");
  let timer;
  const say = (msg, kind = "") => {
    clearTimeout(timer);
    note.textContent = msg; note.className = kind;
    if (kind === "good") timer = setTimeout(() => { note.textContent = ""; }, 6000);
  };
  async function run(n, fresh) {
    btn.disabled = true;
    say("Reading the hiscores…");
    try {
      const s = await lookup(n, fresh);
      say(`Loaded ${s.name}.`, "good");
    } catch (e) {
      const m = e.message;
      say(m === "notfound" ? `No player called “${n}” on the hiscores.`
        : m === "nosnapshot" ? `Found ${n}, but no stats are recorded yet.`
        : m === "empty" ? "" : "Couldn't reach the hiscores. Enter levels by hand for now.", "bad");
    } finally { btn.disabled = false; }
  }
  form.addEventListener("submit", e => { e.preventDefault(); run(name.value, true); });
  onStats(s => {
    name.value = s.name;
    document.querySelectorAll(".nav-lv").forEach(el => {
      const xp = s.skills[el.dataset.skill];
      el.textContent = xp !== undefined ? levelFromXp(xp) : "";
    });
  });
  const saved = savedName();
  if (saved) { name.value = saved; setTimeout(() => run(saved, false), reduce || location.hash ? 200 : 2300); }
}

/* ---------------- #calibrate ---------------- */
function calibrate() {
  if (!location.hash.includes("calibrate")) return;
  const read = document.createElement("div");
  read.style.cssText = "position:fixed;z-index:90;right:12px;bottom:12px;padding:10px 14px;background:rgba(8,13,16,.92);border:1px solid #e9c46a;border-radius:10px;color:#ece5d3;font:12px/1.5 ui-monospace,monospace;white-space:pre";
  read.textContent = "calibrate: click the map";
  document.body.appendChild(read);
  document.addEventListener("click", e => {
    if (e.target.closest("button,a,input,select,label,aside")) return;
    const pt = pins.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = pins.getScreenCTM(); if (!m) return;
    const q = pt.matrixTransform(m.inverse());
    const line = `x: ${Math.round(q.x)}, y: ${Math.round(q.y)}`;
    read.textContent = line + "\n(copied)";
    navigator.clipboard?.writeText(line).catch(() => {});
  });
}

/* ---------------- arrival ---------------- */
let seed = 20260824;
function rnd() {
  seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function intro() {
  const el = $("intro");
  let done = false;
  const timers = [];
  const settle = () => { if (!mapEl.querySelector(".bnd")) return; mapEl.innerHTML = ""; body.classList.remove("booting"); };
  const land = () => {
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    body.classList.remove("hot");
    settle(); camTo(null);
    el.classList.add("out");
    setTimeout(() => el.remove(), 550);
    setTimeout(() => body.classList.add("ready"), 150);
  };
  if (reduce || (location.hash && location.hash !== "#/")) {
    el.remove(); body.classList.remove("booting"); body.classList.add("ready");
    cam.style.transition = "none"; route(); if (!current) camTo(null);
    requestAnimationFrame(() => { cam.style.transition = ""; });
    return;
  }
  body.classList.add("hot");
  // the map assembles in bands as you arrive
  const BANDS = 9, order = [...Array(BANDS).keys()];
  for (let m = order.length - 1; m > 0; m--) { const j = Math.floor(rnd() * (m + 1)); [order[m], order[j]] = [order[j], order[m]]; }
  for (let i = 0; i < BANDS; i++) {
    const d = document.createElement("div");
    d.className = "bnd";
    d.style.clipPath = `inset(${(i / BANDS) * 100}% 0 ${100 - ((i + 1) / BANDS) * 100}% 0)`;
    let dx = (rnd() < .5 ? -1 : 1) * (55 + rnd() * 130);
    if (i === 2 || i === 6) dx *= 1.8;
    d.style.setProperty("--dx", dx.toFixed(0) + "px");
    d.style.setProperty("--d", (0.88 + order[i] * 0.035).toFixed(3) + "s");
    mapEl.appendChild(d);
  }
  const tele = $("tele");
  for (let i = 0; i < 16; i++) {
    const mo = document.createElement("span");
    mo.className = "mote"; tele.appendChild(mo);
    const a = rnd() * Math.PI * 2, far = 180 + rnd() * 260;
    mo.animate?.([
      { transform: `translate(${Math.cos(a) * far}px,${Math.sin(a) * far}px) scale(.4)`, opacity: 0 },
      { opacity: 1, offset: .25 },
      { transform: "translate(0,0) scale(1.1)", opacity: 0 }
    ], { duration: 620 + rnd() * 280, delay: rnd() * 300, easing: "cubic-bezier(.4,0,.7,.6)", fill: "forwards" });
  }
  cam.style.transition = "none";
  camSet(null, 1.62);
  requestAnimationFrame(() => { cam.style.transition = "transform 1350ms cubic-bezier(.2,.72,.24,1)"; });
  el.addEventListener("click", land);
  document.addEventListener("keydown", land, { once: true });
  timers.push(setTimeout(() => body.classList.remove("hot"), 1250));
  timers.push(setTimeout(() => camSet(null, 1.06), 1220));
  timers.push(setTimeout(settle, 1720));
  timers.push(setTimeout(() => { land(); }, 2080));
  timers.push(setTimeout(() => { cam.style.transition = ""; }, 2300));
}

export async function start() {
  drawMarkers();
  drawNav();
  await buildViews();
  bindStats();
  calibrate();
  intro();
  route();
}
