import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";
import { fillButton, bindFill } from "../../lib/groupbank.js";
import golemData from "../../data/golem.json" with { type: "json" };

export const subtitle = "Furs and sunstone into golems";
export const reqs = ["<b>60</b> Crafting", "<b>50</b> Mining", "<b>5</b> sunstones a golem"];
export const html = `<div id="view-golem" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ craftXp: "crafting", huntXp: "hunter", mineXp: "mining" });
  const root = document.getElementById("view-golem");
  document.getElementById("clearBtn").insertAdjacentHTML("beforebegin", fillButton());
  bindFill(root, count => {
    let total = 0;
    root.querySelectorAll("#furRows input.qty").forEach(inp => {
      const n = count(golemData.FURS[+inp.dataset.i].name);
      inp.value = n; inp.dispatchEvent(new Event("input", { bubbles: true })); total += n;
    });
    return total;
  });
}
