// Render helpers shared by the calculators. They return HTML strings so each
// tool can paint its results panel in one go.

import { esc, fmt } from "./format.js";
import { levelFromXp, levelProgress } from "./xp.js";

/** The headline: the level you land on, drawn like an in-game level-up. */
export function landing({ fromXp, toXp, skill, cap = 99 }) {
  const from = levelFromXp(fromXp, cap), to = levelFromXp(toXp, cap);
  const pct = Math.round(levelProgress(toXp, cap) * 100);
  return `<div class="landing">
    <div class="landing-lv">
      <span class="landing-from">${from}</span>
      <svg class="landing-arrow" viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5"/></svg>
      <span class="landing-to">${to}</span>
    </div>
    <div class="landing-meta">
      <span>${esc(skill)}</span>
      <b>+${fmt(toXp - fromXp)} xp</b>
    </div>
    <div class="landing-bar" title="${pct}% through level ${to}"><i style="width:${to >= cap ? 100 : pct}%"></i></div>
  </div>`;
}

export function stat(value, label, tone = "") {
  return `<div class="tile ${tone}"><b>${value}</b><span>${esc(label)}</span></div>`;
}

export function tiles(list) {
  return `<div class="tiles">${list.join("")}</div>`;
}

export function row(label, value, tone = "") {
  return `<div class="row ${tone}"><span>${label}</span><b>${value}</b></div>`;
}

export function note(text, tone = "") {
  return `<p class="note ${tone}">${text}</p>`;
}

/** Ordered milestones: unlocks and switches along the way. */
export function timeline(items) {
  if (!items.length) return "";
  return `<ol class="timeline">${items.map(i =>
    `<li class="${i.tone || ""}"><span class="tl-when">${i.when}</span><span class="tl-what">${i.what}</span>${i.sub ? `<span class="tl-sub">${i.sub}</span>` : ""}</li>`
  ).join("")}</ol>`;
}

export function section(title, body, extra = "") {
  return `<section class="out-sec">${title ? `<h3>${esc(title)}${extra}</h3>` : ""}${body}</section>`;
}

export function table(head, rows, opts = {}) {
  return `<div class="tablewrap"><table class="grid-table">
    <thead><tr>${head.map((h, i) => `<th class="${i ? "n" : ""}">${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr class="${r.cls || ""}">${r.cells.map((c, i) => `<td class="${i ? "n" : ""}">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>${opts.foot ? `<p class="fine">${opts.foot}</p>` : ""}`;
}

/**
 * Reward picker: each reward is skipped, wanted or already owned. Wanted
 * rewards are bought top to bottom as soon as the points are there, and the
 * list can be dragged (or moved with the arrow buttons) into any order.
 */
export function rewardPicker(rewards, defaults = {}) {
  return `<div class="rewards" data-rewards>
    <input type="hidden" name="rw-order" value="${rewards.map(r => r.id).join(",")}">
    ${rewards.map(r => {
      const d = defaults[r.id] || "skip";
      const opt = v => `<label><input type="radio" name="rw-${r.id}" value="${v}"${d === v ? " checked" : ""}><span>${v === "skip" ? "Skip" : v === "want" ? "Want" : "Have"}</span></label>`;
      const sub = r.xpBoost ? `+${(r.xpBoost * 100).toFixed(1)}% xp` : (r.effect || "");
      return `<div class="rw" data-id="${r.id}">
        <span class="rw-grip" draggable="true" title="Drag to reorder" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="rw-name">${esc(r.name)}<small>${esc(sub)}</small></span>
        <span class="rw-cost">${fmt(r.cost)}</span>
        <span class="rw-state" role="radiogroup" aria-label="${esc(r.name)}">${opt("skip")}${opt("want")}${opt("have")}</span>
        <span class="rw-move"><button type="button" data-move="-1" aria-label="Move ${esc(r.name)} up">▲</button><button type="button" data-move="1" aria-label="Move ${esc(r.name)} down">▼</button></span>
      </div>`;
    }).join("")}
  </div>`;
}

/** Wire drag-and-drop and the arrow buttons; keeps the hidden order input in sync. */
export function bindRewardOrder(root) {
  const list = root.querySelector("[data-rewards]");
  if (!list) return;
  const order = list.querySelector('[name="rw-order"]');
  const rows = () => [...list.querySelectorAll(".rw")];
  const commit = () => {
    order.value = rows().map(r => r.dataset.id).join(",");
    order.dispatchEvent(new Event("input", { bubbles: true }));
  };
  // restore a saved order
  const saved = order.value.split(",").filter(Boolean);
  for (const id of saved) {
    const row = list.querySelector(`.rw[data-id="${id}"]`);
    if (row) list.appendChild(row);
  }
  commit();

  list.addEventListener("click", e => {
    const b = e.target.closest("[data-move]");
    if (!b) return;
    const row = b.closest(".rw"), dir = +b.dataset.move;
    const sib = dir < 0 ? row.previousElementSibling : row.nextElementSibling;
    if (!sib || !sib.classList.contains("rw")) return;
    if (dir < 0) list.insertBefore(row, sib); else list.insertBefore(sib, row);
    row.classList.add("moved"); setTimeout(() => row.classList.remove("moved"), 400);
    b.focus();
    commit();
  });

  let dragging = null;
  list.addEventListener("dragstart", e => {
    const row = e.target.closest(".rw");
    if (!row) return;
    dragging = row;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", row.dataset.id);
    e.dataTransfer.setDragImage(row, 20, 20);
  });
  list.addEventListener("dragover", e => {
    if (!dragging) return;
    e.preventDefault();
    const over = e.target.closest(".rw");
    if (!over || over === dragging) return;
    const r = over.getBoundingClientRect();
    list.insertBefore(dragging, e.clientY < r.top + r.height / 2 ? over : over.nextSibling);
  });
  list.addEventListener("drop", e => e.preventDefault());
  list.addEventListener("dragend", () => {
    if (!dragging) return;
    dragging.classList.remove("dragging");
    dragging = null;
    commit();
  });
}

export function readRewards(rewards, v) {
  const order = String(v["rw-order"] || "").split(",").filter(Boolean);
  const sorted = [...rewards].sort((a, b) => {
    const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
  const owned = [], wishlist = [];
  for (const r of sorted) {
    const s = v["rw-" + r.id];
    if (s === "have") owned.push(r.id);
    else if (s === "want") wishlist.push(r.id);
  }
  return { owned, wishlist };
}

export function seg(name, options, checked) {
  return `<div class="seg" role="radiogroup">${options.map(([v, label]) =>
    `<label><input type="radio" name="${name}" value="${v}"${v === checked ? " checked" : ""}><span>${esc(label)}</span></label>`).join("")}</div>`;
}

export function levelXpFields(prefix, level, xp) {
  return `<div class="pair">
    <label class="field"><span>Level</span><input name="${prefix}Lvl" type="number" min="1" max="99" value="${level}" inputmode="numeric" data-nosave></label>
    <label class="field"><span>Experience</span><input name="${prefix}Xp" type="number" min="0" max="200000000" value="${xp}" inputmode="numeric"></label>
  </div>`;
}
