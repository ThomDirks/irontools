// Small form binder for the calculators. Every input with a `name` becomes a
// value; checkboxes are booleans, number inputs are numbers. Values persist
// per tool in localStorage so a calculator reopens the way you left it.

import { xpForLevel, levelFromXp, MAX_XP } from "./xp.js";

function readEl(el) {
  if (el.type === "checkbox") return el.checked;
  if (el.type === "radio") return el.checked ? el.value : undefined;
  if (el.type === "number" || el.inputMode === "numeric") {
    const n = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ""));
    return isFinite(n) ? n : 0;
  }
  return el.value;
}

function writeEl(el, v) {
  if (el.type === "checkbox") el.checked = !!v;
  else if (el.type === "radio") el.checked = el.value === String(v);
  else el.value = v;
}

export function bindForm(root, toolId, onChange) {
  const key = "ironTools.v2." + toolId;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch { /* ignore */ }

  const els = () => [...root.querySelectorAll("[name]")];
  for (const el of els()) {
    if (el.name in saved && !el.hasAttribute("data-nosave")) writeEl(el, saved[el.name]);
  }

  function values() {
    const v = {};
    for (const el of els()) {
      const r = readEl(el);
      if (r !== undefined) v[el.name] = r;
      else if (!(el.name in v)) v[el.name] = undefined;
    }
    return v;
  }

  let queued = false;
  function changed() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const v = values();
      const store = {};
      for (const el of els()) if (!el.hasAttribute("data-nosave")) store[el.name] = v[el.name];
      try { localStorage.setItem(key, JSON.stringify(store)); } catch { /* ignore */ }
      onChange(v);
    });
  }

  root.addEventListener("input", changed);
  root.addEventListener("change", changed);

  return {
    values,
    refresh: changed,
    set(name, val) {
      root.querySelectorAll(`[name="${name}"]`).forEach(el => writeEl(el, val));
      changed();
    }
  };
}

/** Keep a level box and an xp box in step. XP is the source of truth. */
export function syncLevelXp(root, levelName, xpName) {
  const lvl = root.querySelector(`[name="${levelName}"]`);
  const xp = root.querySelector(`[name="${xpName}"]`);
  lvl.addEventListener("input", () => {
    const l = parseInt(lvl.value, 10);
    if (!isNaN(l)) xp.value = xpForLevel(Math.max(1, Math.min(99, l)));
  });
  xp.addEventListener("input", () => {
    const x = Math.max(0, Math.min(MAX_XP, parseInt(xp.value, 10) || 0));
    lvl.value = levelFromXp(x);
  });
  return {
    setXp(x) {
      xp.value = Math.round(x);
      lvl.value = levelFromXp(x);
      xp.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };
}
