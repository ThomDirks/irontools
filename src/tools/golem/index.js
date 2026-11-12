import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";

export const subtitle = "Furs and sunstone into golems";
export const reqs = ["<b>60</b> Crafting", "<b>50</b> Mining", "<b>5</b> sunstones a golem"];
export const html = `<div id="view-golem" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ craftXp: "crafting", huntXp: "hunter", mineXp: "mining" });
}
