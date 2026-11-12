import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";

export const subtitle = "Seeds and bank herbs into paste, potions and resin";
export const reqs = ["<b>60</b> Herblore for Mixology"];
export const html = `<div id="view-mixology" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ xp: "herblore" });
}
