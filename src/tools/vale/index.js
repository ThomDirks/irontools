import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";

export const subtitle = "Logs into rounds, offerings and research points";
export const reqs = ["<b>20</b> Fletching", "Vale Totems", "<b>5</b> logs a totem"];
export const html = `<div id="view-vale" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ "vt-xp": "fletching" });
}
