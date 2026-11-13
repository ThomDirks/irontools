import { REWARDS, LEVEL, rateAt, simulate, pearlsPerSearch } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, duration, plural } from "../../lib/format.js";
import { landing, stat, tiles, section, timeline, table, note, rewardPicker, readRewards, bindRewardOrder, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Games to your goal, and when each pearl reward lands";
export const reqs = ["<b>27</b> Runecraft", "Temple of the Eye"];

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Runecraft</h2>
      ${levelXpFields("r", 50, xpForLevel(50))}
    </div>
    <div class="group">
      <h2>Goal</h2>
      ${seg("goal", [["level", "Level"], ["xp", "XP"], ["rewards", "Rewards"]], "level")}
      <label class="field" data-show="goal:level,xp"><span data-goal-label>Target level</span><input name="target" type="number" min="1" value="77" inputmode="numeric"></label>
    </div>
    <div class="group">
      <h2>Games</h2>
      <div class="pair">
        <label class="field"><span>Games an hour</span><input name="gph" type="number" min="1" max="12" step="0.5" value="5" inputmode="decimal"></label>
        <label class="field"><span>Searches a game</span><input name="spg" type="number" min="1" max="6.6" step="0.1" value="6" inputmode="decimal"></label>
      </div>
      <label class="toggle"><input type="checkbox" name="pouches" checked><span>I own every essence pouch<small>Or the colossal pouch. More pearls a search.</small></span></label>
    </div>
    <div class="group">
      <h2>Rewards</h2>
      <label class="field"><span>Pearls now</span><input name="pearls" type="number" min="0" value="0" inputmode="numeric"></label>
      <p class="rw-note">Drag to set the order. Wanted rewards are bought top to bottom.</p>
      ${rewardPicker(REWARDS, { hat: "want", top: "want", bottoms: "want", boots: "want", needle: "want" })}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

const KEEP = ["Cosmic rune", "Chaos rune", "Nature rune", "Law rune", "Death rune", "Blood rune"];

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "rLvl", "rXp");
  const f = bindForm(form, "gotr", paint);
  lx.setXp(f.values().rXp);
  bindRewardOrder(form);
  onStats(s => { if (s.skills.runecrafting !== undefined) lx.setXp(s.skills.runecrafting); });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    form.querySelector("[data-goal-label]").textContent = v.goal === "xp" ? "Target experience" : "Target level";

    const startXp = v.rXp, level = levelFromXp(startXp);
    if (level < LEVEL) { out.innerHTML = note(`Guardians of the Rift needs ${LEVEL} Runecraft. You're ${level}.`, "ember"); return; }
    const { owned, wishlist } = readRewards(REWARDS, v);
    if (v.goal === "rewards" && !wishlist.filter(id => !owned.includes(id)).length) {
      out.innerHTML = note("Mark the rewards you want and this works out the games to get them.");
      return;
    }
    const goal = { type: v.goal, value: v.target };
    if (v.goal === "level" && v.target <= level) { out.innerHTML = note(`You're already ${level}. Pick a higher level, or plan for rewards.`); return; }
    const r = simulate({ startXp, goal, gamesPerHour: v.gph || 5, searchesPerGame: v.spg || 6, pouches: !!v.pouches, startPearls: v.pearls, owned, wishlist });

    let html = landing({ fromXp: startXp, toXp: r.endXp, skill: "Runecraft" });
    html += tiles([
      stat(fmt(Math.ceil(r.games)), plural(Math.ceil(r.games), "game"), "gold"),
      stat(duration(r.hours), "at " + fmt(v.gph || 5, 1).replace(/\.0$/, "") + " games an hour"),
      stat(fmt(Math.round(r.searches)), "searches"),
      stat(fmt(Math.round(r.pearlsEarned)), "pearls earned")
    ]);
    if (r.unbought.length && v.goal !== "rewards")
      html += note(`Still short for ${r.unbought.map(id => REWARDS.find(x => x.id === id).name).join(", ")} when you get there.`);

    const items = [{ when: "Start", what: `${fmt(rateAt(level).rc)} xp an hour`, sub: `${pearlsPerSearch(!!v.pouches).toFixed(2)} pearls a search`, tone: "moss" }];
    const outfit = REWARDS.filter(x => x.outfit).map(x => x.id);
    const have = new Set(owned);
    for (const e of r.events) {
      have.add(e.reward.id);
      items.push({ when: duration(e.hours) || "0h", what: e.reward.name, sub: `Game ${fmt(Math.max(1, Math.ceil(e.hours * (v.gph || 5))))}, level ${e.level}`, tone: "gold" });
      if (e.reward.outfit && outfit.every(id => have.has(id)))
        items.push({ when: "", what: "Full Raiments of the Eye", sub: "+60% runes in total", tone: "gold" });
    }
    html += section("Along the way", timeline(items));

    const runes = r.runes.filter(x => KEEP.includes(x.name) && x.n >= 1);
    if (runes.length) html += section("Runes from searches", table(["Rune", "Expected"], runes.map(x => ({ cells: [x.name, fmt(Math.round(x.n))] })),
      { foot: "Elemental, mind and body runes come too. Runes above your level come in smaller stacks." }));

    html += section("Odds over the plan", table(["Drop", "Rate", "Chance"], r.rare.map(x => ({
      cells: [x.name, "1/" + fmt(x.rate), x.chance >= 0.995 ? "99%+" : Math.round(x.chance * 100) + "%"]
    }))));

    html += tiles([stat(fmt(Math.round(r.xpBy.crafting)), "Crafting xp"), stat(fmt(Math.round(r.xpBy.mining)), "Mining xp")]);

    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Xp an hour follows the wiki's training table: 25k under 50, 40k to 75, 50k to 85, 65k to 98 (small teams), 70k at 99. The wiki doesn't list rates under 40.</li>
      <li>A search costs one elemental and one catalytic point. A full game is 6 searches (6.6 with a yew-lit lantern).</li>
      <li>Pearls: 14 to 16 from a roll of 18 in ${v.pouches ? 125 : 140} on the main table.</li>
      <li>Drops that also come from searches (needle, lantern) are bought at shop price here, so a lucky drop only speeds things up.</li>
      <li>Source: OSRS Wiki, Rewards Guardian, Temple Supplies, Pay-to-play Runecraft training.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}
