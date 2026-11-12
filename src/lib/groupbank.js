// Group Ironmen Tracker (groupiron.men) bank lookup.
//
// The group name and token only ever live in this module's variables: they
// are never written to localStorage, cookies or the URL, and reloading the
// page forgets them. The request goes straight from the browser to
// groupiron.men, whose API allows calls from any site.

import ids from "../data/items.json" with { type: "json" };

const API = "https://groupiron.men/api/group/";
// where an item can sit; equipment, rune pouch and potion storage don't
// matter for these calculators
const SOURCES = ["bank", "inventory", "seed_vault"];
const SHARED = "@SHARED";

let members = [];          // [{ name, items: Map(id -> qty) }]
let selected = new Set();  // member names counted
let loadedAt = null;
const listeners = new Set();

export function onGroupBank(fn) { listeners.add(fn); fn(state()); return () => listeners.delete(fn); }
const emit = () => listeners.forEach(fn => fn(state()));

export function state() {
  return { loaded: members.length > 0, members: members.map(m => ({ name: m.name, label: label(m.name), on: selected.has(m.name), count: m.items.size })), loadedAt };
}

export const label = name => (name === SHARED ? "Shared bank" : name);

export function toggleMember(name, on) {
  if (on) selected.add(name); else selected.delete(name);
  emit();
}

export function forget() {
  members = []; selected = new Set(); loadedAt = null;
  emit();
}

function parse(arr) {
  const out = new Map();
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i + 1 < arr.length; i += 2) {
    const id = arr[i], q = arr[i + 1];
    if (id > 0 && q > 0) out.set(id, (out.get(id) || 0) + q);
  }
  return out;
}

export async function load(groupName, token) {
  groupName = (groupName || "").trim(); token = (token || "").trim();
  if (!groupName || !token) throw new Error("missing");
  const url = API + encodeURIComponent(groupName) + "/get-group-data?from_time=" + encodeURIComponent(new Date(0).toISOString());
  let r;
  try { r = await fetch(url, { headers: { Authorization: token }, cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" }); }
  catch { throw new Error("network"); }
  if (r.status === 401 || r.status === 403) throw new Error("auth");
  if (r.status === 404) throw new Error("notfound");
  if (!r.ok) throw new Error("http");
  const data = await r.json();
  members = data.map(m => {
    const items = new Map();
    for (const s of SOURCES) for (const [id, q] of parse(m[s])) items.set(id, (items.get(id) || 0) + q);
    return { name: m.name, items };
  }).sort((a, b) => (a.name === SHARED) - (b.name === SHARED) || a.name.localeCompare(b.name));
  selected = new Set(members.map(m => m.name));
  loadedAt = new Date();
  emit();
  return state();
}

/** How many of an item (by its name) the ticked members hold together. */
export function count(name) {
  const list = ids[name];
  if (!list) return 0;
  let n = 0;
  for (const m of members) if (selected.has(m.name)) for (const id of list) n += m.items.get(id) || 0;
  return n;
}

export const isLoaded = () => members.length > 0;

/** Markup for the fill button; hidden until a group bank is loaded. */
export const fillButton = (label = "Fill from group bank") =>
  `<button type="button" class="gb-fill" data-gbfill hidden>${label}</button>`;

/**
 * Show the fill buttons inside `root` once a bank is loaded, and run
 * `fill(count)` on click. Filling replaces what's typed.
 */
export function bindFill(root, fill) {
  const buttons = () => [...root.querySelectorAll("[data-gbfill]")];
  onGroupBank(s => buttons().forEach(b => {
    b.hidden = !s.loaded;
    b.classList.remove("done");
    b.textContent = "Fill from group bank";
  }));
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-gbfill]");
    if (!b || !isLoaded()) return;
    const total = fill(count);
    b.classList.add("done");
    b.textContent = total ? `Filled ${total.toLocaleString("en-GB")} items` : "None in the bank";
  });
}
