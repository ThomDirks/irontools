import { SEEDS, REWARDS, sackXp, sackPoints, simulate } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, duration, plural } from "../../lib/format.js";
import { landing, stat, tiles, section, timeline, table, note, rewardPicker, readRewards, bindRewardOrder, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Sacks to your goal, with seeds and rewards switching in as they unlock";
export const reqs = ["<b>34</b> Farming", "<b>100</b> fruit a sack"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Farming</h2>
      ${levelXpFields("f", 34, xpForLevel(34))}
    </div>
    <div class="group">
      <h2>Goal</h2>
      ${seg("goal", [["level", "Level"], ["xp", "XP"], ["rewards", "Rewards"]], "level")}
      <label class="field" data-show="goal:level,xp"><span data-goal-label>Target level</span><input name="target" type="number" min="1" value="99" inputmode="numeric"></label>
    </div>
    <div class="group">
      <h2>Seeds</h2>
      <label class="field"><select name="seed">
        <option value="auto">Best for my level</option>
        ${SEEDS.map(s => `<option value="${s.id}">${s.name} only (${s.level})</option>`).join("")}
      </select></label>
    </div>
    <div class="group">
      <h2>Rewards</h2>
      <div class="trio">
        <label class="field"><span>Points now</span><input name="points" type="number" min="0" max="16000" value="0" inputmode="numeric"></label>
        <label class="field" style="grid-column:span 2"><span>Minutes a sack</span><input name="pace" type="number" min="5" max="60" step="0.5" value="19" inputmode="decimal"></label>
      </div>
      <p class="rw-note">Drag to set the order. Wanted rewards are bought top to bottom.</p>
      ${rewardPicker(REWARDS, { hat: "want", top: "want", legs: "want", boots: "want", can: "want" })}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "fLvl", "fXp");
  const f = bindForm(form, "tithe", paint);
  lx.setXp(f.values().fXp);
  bindRewardOrder(form);
  onStats(s => { if (s.skills.farming !== undefined) lx.setXp(s.skills.farming); });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    form.querySelector("[data-goal-label]").textContent = v.goal === "xp" ? "Target experience" : "Target level";

    const startXp = v.fXp;
    const level = levelFromXp(startXp);
    const { owned, wishlist } = readRewards(REWARDS, v);
    const goal = { type: v.goal, value: v.target };
    const r = simulate({ startXp, goal, seed: v.seed, owned, wishlist, startPoints: v.points, minutesPer100: v.pace || 19 });

    let html = "";
    if (level < SEEDS[0].level) {
      out.innerHTML = note(`Tithe Farm needs ${SEEDS[0].level} Farming. You're ${level}.`, "ember");
      return;
    }
    if (r.blocked && !r.runs) {
      out.innerHTML = note(`${r.blocked.name} needs ${r.blocked.level} Farming. You're ${level}.`, "ember");
      return;
    }
    if (v.goal === "rewards" && !wishlist.length) {
      out.innerHTML = note("Mark the rewards you want and this works out the sacks to get them.");
      return;
    }
    html += landing({ fromXp: startXp, toXp: r.endXp, skill: "Farming" });
    html += tiles([
      stat(fmt(r.runs), r.lastFruit < 100 ? `${plural(r.runs, "sack")}, the last one ${r.lastFruit} fruit` : plural(r.runs, "sack") + " of 100", "gold"),
      stat(fmt(r.fruit), "fruit"),
      stat(duration(r.hours), "at " + fmt(v.pace || 19, 1).replace(/\.0$/, "") + " min a sack"),
      stat(fmt(r.earned), "points earned")
    ]);
    if (r.blocked) html += note(`Stops at level ${levelFromXp(r.endXp)}: ${r.blocked.name} needs ${r.blocked.level}.`, "ember");
    if (r.unbought.length && v.goal !== "rewards")
      html += note(`Still short for ${r.unbought.map(id => REWARDS.find(x => x.id === id).name).join(", ")} when you get there.`);

    const start = r.startSeed;
    const items = [];
    if (start) items.push({ when: "Start", what: start.name + " seeds", sub: fmt(sackXp(start)) + " xp a sack", tone: "moss" });
    const outfit = REWARDS.filter(x => x.outfit).map(x => x.id);
    const have = new Set(owned);
    for (const e of r.events) {
      if (e.kind === "seed") {
        items.push({ when: duration(e.hours) || "0h", what: "Switch to " + e.what, sub: `Sack ${fmt(e.run + 1)}, level ${e.level}`, tone: "moss" });
        continue;
      }
      have.add(e.reward.id);
      const boost = e.reward.xpBoost ? `, +${(e.reward.xpBoost * 100).toFixed(1)}% xp from here` : "";
      items.push({ when: duration(e.hours), what: e.what, sub: `Sack ${fmt(e.run)}, level ${e.level}${boost}`, tone: "gold" });
      if (e.reward.outfit && outfit.every(id => have.has(id)))
        items.push({ when: "", what: "Full outfit", sub: "+2.5% xp in total", tone: "gold" });
    }
    html += section("Along the way", timeline(items));

    if (r.bySeed.length > 1) {
      html += section("By seed", table(["Seed", "Sacks", "Fruit", "Experience"],
        r.bySeed.map(b => ({ cells: [b.seed.name, fmt(b.runs), fmt(b.runs * 100), fmt(b.xp)] }))));
    }

    const perHour = 60 / (v.pace || 19);
    html += section("Every seed", table(["Seed", "Level", "XP a sack", "XP an hour", "Points an hour"],
      SEEDS.map(s => ({
        cls: level < s.level ? "off" : (r.startSeed?.id === s.id ? "on" : ""),
        cells: [s.name, s.level, fmt(sackXp(s)), fmt(sackXp(s) * perHour), fmt(sackPoints() * perHour)]
      }))), );

    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>A sack is 100 fruit. Each fruit gives harvest xp, then deposit xp (doubled from the 75th), plus a bonus of 250× the harvest xp on the 75th.</li>
      <li>Points: 1 for every 3 fruit, plus 2 on the 100th. 35 a sack, capped at 16,000 held.</li>
      <li>Outfit pieces count from the sack after you buy them. The full set adds 0.5% on top of the pieces.</li>
      <li>19 minutes a sack is the wiki's figure for the 25x4 method. Source: OSRS Wiki, Tithe Farm.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}
