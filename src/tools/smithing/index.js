import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";

export const subtitle = "Alloys, moulds and shop-bought metal";
export const reqs = ["<b>15</b> Smithing", "Sleeping Giants", "<b>28</b> bars a sword"];
export const html = `<div id="view-smithing" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ "sm-xp": "smithing" });
}
