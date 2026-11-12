import view from "./view.html?raw";
import "./style.css";
import { mountLegacy } from "./legacy.js";
import { fillFromStats } from "../../lib/legacy.js";
import { fillButton, bindFill } from "../../lib/groupbank.js";
import herbData from "../../data/herbs.json" with { type: "json" };

// fill the herb table: seeds into "Seeds", grimy plus clean herbs into "In bank"
function setInput(el, n) { el.value = n || ""; el.dispatchEvent(new Event("input", { bubbles: true })); }

export const subtitle = "Seeds and bank herbs into paste, potions and resin";
export const reqs = ["<b>60</b> Herblore for Mixology"];
export const html = `<div id="view-mixology" class="legacy">${view}</div>`;

export function mount() {
  mountLegacy();
  fillFromStats({ xp: "herblore" });
  const root = document.getElementById("view-mixology");
  document.getElementById("b-clear").insertAdjacentHTML("beforebegin", fillButton());
  bindFill(root, count => {
    let total = 0;
    for (const tr of root.querySelectorAll("#herb-rows tr")) {
      const name = tr.querySelector(".herbname").textContent;
      const herb = herbData.herbs.find(h => name.startsWith(h.name));
      if (!herb) continue;
      const [seeds, stock] = tr.querySelectorAll("input");
      const s = count(herb.seed), h = count(herb.name) + count("Grimy " + herb.name.toLowerCase());
      setInput(seeds, s); setInput(stock, h); total += s + h;
    }
    return total;
  });
}
