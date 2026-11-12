import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";
import { fillButton, bindFill } from "../../lib/groupbank.js";

const LOGS = { oak: "Oak logs", willow: "Willow logs", maple: "Maple logs", yew: "Yew logs", magic: "Magic logs", redwood: "Redwood logs" };

export const subtitle = "Logs into rounds, offerings and research points";
export const reqs = ["<b>20</b> Fletching", "Vale Totems", "<b>5</b> logs a totem"];
export const html = `<div id="view-vale" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ "vt-xp": "fletching" });
  const root = document.getElementById("view-vale");
  document.getElementById("vt-haveh").insertAdjacentHTML("afterend", fillButton());
  bindFill(root, count => {
    const n = count(LOGS[document.getElementById("vt-log").value]);
    const el = document.getElementById("vt-have");
    el.value = n; el.dispatchEvent(new Event("input", { bubbles: true }));
    return n;
  });
}
