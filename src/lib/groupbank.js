// Group Ironmen Tracker (groupiron.men) items.
//
// groupiron.men's live API doesn't allow other websites to read it, so the
// data comes over by hand: a bookmarklet, run on groupiron.men where you're
// already logged in, copies just the item lists (no token) to the
// clipboard, and you paste them here. Everything stays in this module's
// variables: nothing is written to storage, and reloading forgets it.

import ids from "../data/items.json" with { type: "json" };

// where an item can sit; equipment, rune pouch and potion storage don't
// matter for these calculators
const SOURCES = ["bank", "inventory", "seed_vault"];
const SHARED = "@SHARED";
const PREFIX = "IRONTOOLS:";

/** Runs on groupiron.men. Reads that site's own login, copies only items. */
export const BOOKMARKLET = "javascript:" + encodeURIComponent(`(async()=>{
const n=localStorage.getItem("groupName"),t=localStorage.getItem("groupToken");
if(location.hostname!=="groupiron.men"||!n||!t){alert("Open groupiron.men, log in to your group, then click this again.");return}
let d;try{const r=await fetch("/api/group/"+encodeURIComponent(n)+"/get-group-data?from_time=1970-01-01T00:00:00.000Z",{headers:{Authorization:t}});if(!r.ok)throw r.status;d=await r.json()}catch(e){alert("groupiron.men didn't answer ("+e+"). Try again in a moment.");return}
const k=["bank","inventory","seed_vault"];
const s="${PREFIX}"+JSON.stringify({v:1,group:n,at:new Date().toISOString(),members:d.map(m=>{const o={name:m.name};k.forEach(x=>o[x]=m[x]||[]);return o})});
try{await navigator.clipboard.writeText(s);alert("Copied the items of "+d.length+" members. Paste them into Iron Tools.");return}catch(e){}
const w=document.createElement("div");w.style.cssText="position:fixed;inset:20% 20%;z-index:99999;background:#1a2227;color:#ece5d3;padding:16px;border:2px solid #e9c46a;border-radius:10px;font:14px sans-serif;display:flex;flex-direction:column;gap:8px";
w.innerHTML="<b>Copy this and paste it into Iron Tools</b>";const a=document.createElement("textarea");a.value=s;a.style.cssText="flex:1;width:100%";const b=document.createElement("button");b.textContent="Copy and close";
b.onclick=async()=>{a.select();try{await navigator.clipboard.writeText(s)}catch(e){document.execCommand("copy")}w.remove()};w.append(a,b);document.body.append(w);a.select();
})()`);

let members = [];          // [{ name, items: Map(id -> qty) }]
let selected = new Set();  // member names counted
let loadedAt = null;
let groupName = "";
const listeners = new Set();

export function onGroupBank(fn) { listeners.add(fn); fn(state()); return () => listeners.delete(fn); }
const emit = () => listeners.forEach(fn => fn(state()));

export function state() {
  return { loaded: members.length > 0, group: groupName, members: members.map(m => ({ name: m.name, label: label(m.name), on: selected.has(m.name), count: m.items.size })), loadedAt };
}

export const label = name => (name === SHARED ? "Shared bank" : name);

export function toggleMember(name, on) {
  if (on) selected.add(name); else selected.delete(name);
  emit();
}

export function forget() {
  members = []; selected = new Set(); loadedAt = null; groupName = "";
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

function ingest(list, group) {
  members = list.map(m => {
    const items = new Map();
    for (const src of SOURCES) for (const [id, q] of parse(m[src])) items.set(id, (items.get(id) || 0) + q);
    return { name: String(m.name), items };
  }).sort((a, b) => (a.name === SHARED) - (b.name === SHARED) || a.name.localeCompare(b.name));
  selected = new Set(members.map(m => m.name));
  loadedAt = new Date();
  groupName = group || "";
  emit();
  return state();
}

/** Text copied by the bookmarklet (or the raw get-group-data JSON). */
export function fromPaste(text) {
  text = String(text || "").trim();
  if (!text) throw new Error("empty");
  if (text.startsWith(PREFIX)) text = text.slice(PREFIX.length);
  let data;
  try { data = JSON.parse(text); } catch { throw new Error("format"); }
  const list = Array.isArray(data) ? data : data?.members;
  if (!Array.isArray(list) || !list.length || !list.every(m => m && typeof m.name === "string")) throw new Error("format");
  return ingest(list, data.group);
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

/** Every item the ticked members hold together, id -> amount. */
export function items() {
  const all = new Map();
  for (const m of members) if (selected.has(m.name)) for (const [id, q] of m.items) all.set(id, (all.get(id) || 0) + q);
  return all;
}

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
