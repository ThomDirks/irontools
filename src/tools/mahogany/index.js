import { TIERS, PLANKS, REWARDS, TYPES, MISC, PLANK_MAKE, simulate, supply, kingdom, contractsPerHour } from "./calc.js";
import { bindForm, syncLevelXp } from "../../lib/form.js";
import { onStats } from "../../lib/stats.js";
import { xpForLevel, levelFromXp } from "../../lib/xp.js";
import { fmt, duration, short, plural } from "../../lib/format.js";
import { landing, stat, tiles, section, timeline, table, note, row, rewardPicker, readRewards, seg, levelXpFields } from "../../lib/ui.js";

export const subtitle = "Contracts to your goal, from planks or logs, with Miscellania timing";
export const reqs = ["Player-owned house", "<b>5</b> points an Expert contract"];

const bankRow = k => `<div class="qty bank-row">
  <span>${PLANKS[k].name.replace(" plank", "")}</span>
  <input name="pl-${k}" type="number" min="0" value="0" inputmode="numeric" aria-label="${PLANKS[k].name}s in the bank">
  <input name="lg-${k}" type="number" min="0" value="0" inputmode="numeric" aria-label="${PLANKS[k].log} in the bank">
</div>`;

export const html = `<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Construction</h2>
      ${levelXpFields("c", 50, xpForLevel(50))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${seg("mode", [["target", "Reach a level"], ["bank", "Use my bank"]], "target")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field"><span>Contracts</span><select name="tier">
        <option value="auto">Best I can do</option>
        ${TIERS.map(t => `<option value="${t.id}">${t.name} only (${t.level}, ${PLANKS[t.plank].name.toLowerCase()}s)</option>`).join("")}
      </select></label>
    </div>
    <div class="group">
      <h2>In the bank</h2>
      <div class="qty bank-head"><span></span><span>Planks</span><span>Logs</span></div>
      ${TYPES.map(bankRow).join("")}
      <label class="field"><span>Turn logs into planks with</span></label>
      ${seg("method", [["sawmill", "Sawmill"], ["plankMake", "Plank Make"]], "sawmill")}
    </div>
    <div class="group">
      <h2>Pace</h2>
      ${seg("pace", [["low", "Relaxed"], ["mid", "Typical"], ["high", "Fast"]], "mid")}
    </div>
    <div class="group">
      <h2>Rewards</h2>
      <label class="field"><span>Points now</span><input name="points" type="number" min="0" value="0" inputmode="numeric"></label>
      ${rewardPicker(REWARDS, { sack: "want", hat: "want", top: "want", legs: "want", boots: "want" })}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;

export function mount(root) {
  const out = root.querySelector(".out");
  const form = root.querySelector(".setup");
  const lx = syncLevelXp(form, "cLvl", "cXp");
  const f = bindForm(form, "mahogany", paint);
  lx.setXp(f.values().cXp);
  onStats(s => { if (s.skills.construction !== undefined) lx.setXp(s.skills.construction); });

  function paint(v) {
    form.querySelectorAll("[data-show]").forEach(el => {
      const [k, vals] = el.dataset.show.split(":");
      el.hidden = !vals.split(",").includes(v[k]);
    });
    const startXp = v.cXp;
    const level = levelFromXp(startXp);
    const { owned, wishlist } = readRewards(REWARDS, v);
    const bankPlanks = Object.fromEntries(TYPES.map(k => [k, Math.max(0, v["pl-" + k] || 0)]));
    const bankLogs = Object.fromEntries(TYPES.map(k => [k, Math.max(0, v["lg-" + k] || 0)]));

    const r = simulate({
      mode: v.mode, startXp, goal: { type: "level", value: v.target }, tier: v.tier, pace: v.pace,
      planks: bankPlanks, logs: bankLogs, owned, wishlist, startPoints: v.points
    });

    if (r.blocked && !r.contracts) {
      out.innerHTML = note(`${r.blocked.name} contracts need ${r.blocked.level} Construction. You're ${level}.`, "ember");
      return;
    }
    if (v.mode === "bank" && !r.contracts) {
      out.innerHTML = note("Add planks or logs you have. Contracts at your level use " +
        TIERS.filter(t => level >= t.level).map(t => PLANKS[t.plank].name.toLowerCase() + "s").join(", ") + ".");
      return;
    }

    const planksTotal = TYPES.reduce((s, k) => s + r.planksNeeded[k], 0);
    let html = landing({ fromXp: startXp, toXp: r.endXp, skill: "Construction" });
    html += tiles([
      stat(fmt(r.contracts), plural(r.contracts, "contract"), "gold"),
      stat(duration(r.hours), "doing contracts"),
      stat(fmt(planksTotal), "planks"),
      stat(fmt(r.bars), "steel bars")
    ]);
    if (r.blocked) html += note(`Stops at level ${levelFromXp(r.endXp)}: ${r.blocked.name} contracts need ${r.blocked.level}.`, "ember");

    // where the planks come from
    const sup = supply(r.planksNeeded, bankPlanks, bankLogs, v.method);
    if (sup.rows.length) {
      const mats = table(["Planks", "Needed", "Bank planks", "Bank logs", "Logs to get", "Coins"],
        sup.rows.map(x => ({
          cells: [PLANKS[x.type].name, fmt(x.need), x.fromPlanks ? fmt(x.fromPlanks) : "–", x.fromLogs ? fmt(x.fromLogs) : "–",
            x.gather ? `<b>${fmt(x.gather)}</b>` : "–", x.cost ? short(x.cost) : "–"]
        })));
      const make = v.method === "plankMake"
        ? `<div class="rows">${row("Plank Make casts", fmt(sup.casts))}${row("Runes", Object.entries(sup.runes).map(([n, q]) => `${fmt(q)} ${n.replace(" rune", "").toLowerCase()}`).join(", "))}${row("Magic xp", "+" + fmt(sup.magicXp))}${row("Casting time", duration(sup.castHours))}</div>`
        : "";
      html += section("Planks", mats + make + (sup.coins ? `<div class="rows">${row(v.method === "plankMake" ? "Coins for Plank Make" : "Sawmill fees", fmt(sup.coins) + " gp", "gold")}</div>` : ""));
    }

    // Miscellania for the teak and mahogany still missing
    const gatherOf = k => sup.rows.find(x => x.type === k)?.gather || 0;
    const kd = kingdom(gatherOf("teak"), gatherOf("mahogany"));
    if (kd) {
      const parts = [];
      if (kd.useBoth) parts.push(`"Both" hardwood: ${MISC.options.both.teak} teak and ${MISC.options.both.mahogany} mahogany a day`);
      else {
        if (kd.teakDays) parts.push(`Teak: ${MISC.options.teak.teak} a day for ${fmt(kd.teakDays)} ${plural(kd.teakDays, "day")}`);
        if (kd.mahoDays) parts.push(`Mahogany: ${MISC.options.mahogany.mahogany} a day for ${fmt(kd.mahoDays)} ${plural(kd.mahoDays, "day")}`);
      }
      html += section("From Miscellania", tiles([
        stat(fmt(kd.days), plural(kd.days, "day") + " of collecting", "gold"),
        stat(short(kd.coffer), "gp from the coffer")
      ]) + `<p class="fine">${parts.join(". ")}. Maximum yield: Royal Trouble done, 10 workers on hardwood, 100% approval, at least 750k in the coffer.</p>`);
    }

    // the path
    const items = [];
    const first = r.byTier[0]?.tier;
    if (first) items.push({ when: "Start", what: first.name + " contracts", sub: PLANKS[first.plank].name.toLowerCase() + "s, " + fmt(first.xp) + " xp each", tone: "moss" });
    const have = new Set(owned);
    const outfit = REWARDS.filter(x => x.outfit).map(x => x.id);
    for (const e of r.events) {
      if (e.kind === "tier") { items.push({ when: "No. " + fmt(e.contract + 1), what: "Move up to " + e.what, sub: "Level " + e.level + ", " + e.sub, tone: "moss" }); continue; }
      have.add(e.reward.id);
      const sub = e.reward.xpBoost ? `+${(e.reward.xpBoost * 100).toFixed(1)}% xp from here` : e.reward.id === "sack" ? "Faster contracts from here" : "";
      items.push({ when: "No. " + fmt(e.contract), what: e.what, sub: `Level ${e.level}${sub ? ", " + sub.charAt(0).toLowerCase() + sub.slice(1) : ""}`, tone: "gold" });
      if (e.reward.outfit && outfit.every(id => have.has(id))) items.push({ when: "", what: "Full outfit", sub: "+2.5% xp in total", tone: "gold" });
    }
    html += section("Along the way", timeline(items));

    if (r.byTier.length > 1) {
      html += section("By tier", table(["Tier", "Contracts", "Planks", "Experience"],
        r.byTier.map(b => ({ cells: [b.tier.name, fmt(b.contracts), fmt(Math.ceil(b.contracts * b.tier.planks)), fmt(b.xp)] }))));
    }

    const sack = owned.includes("sack");
    html += section("Every tier", table(["Tier", "Level", "Planks", "XP a contract", "Contracts an hour", "Points"],
      TIERS.map(t => ({
        cls: level < t.level ? "off" : first?.id === t.id ? "on" : "",
        cells: [t.name, t.level, `${t.planks} ${t.plank === "plank" ? "" : t.plank}`, fmt(t.xp), fmt(contractsPerHour(t, sack, v.pace), 0), t.points]
      })), { foot: sack ? "With the plank sack." : "Without the plank sack." }));

    html += `<details class="how"><summary>How it's worked out</summary><ul>
      <li>Planks, steel bars and xp per contract are the wiki's averages over every house layout. The xp includes the completion bonus.</li>
      <li>Contracts an hour come from the wiki's xp-an-hour range for each tier: Relaxed is the low end, Fast the high end. Buying the plank sack moves you to the faster range.</li>
      <li>With "Best I can do", each contract uses the highest tier your level allows. In bank mode it drops to a lower tier when you run out of the planks for the higher one.</li>
      <li>Logs count as planks once made: sawmill ${PLANKS.plank.sawmill}/${PLANKS.oak.sawmill}/${PLANKS.teak.sawmill}/${fmt(PLANKS.mahogany.sawmill)} gp, Plank Make ${PLANKS.plank.plankMake}/${PLANKS.oak.plankMake}/${PLANKS.teak.plankMake}/${fmt(PLANKS.mahogany.plankMake)} gp plus runes (${PLANK_MAKE.magic} Magic, Lunar).</li>
      <li>Sources: OSRS Wiki, Mahogany Homes, Sawmill, Plank Make and Managing Miscellania.</li>
    </ul></details>`;
    out.innerHTML = html;
  }
}
