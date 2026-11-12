import D from "../../data/smithing.json";

// Original calculator logic, moved from the single-page site. It talks to
// the DOM by id, so it runs once its markup is in the document.
export function mountLegacy() {
/* ---------- helpers ---------- */
function $(id){ return document.getElementById(id); }
function num(v){ var n = parseFloat(String(v).replace(/[^0-9.\-]/g,"")); return isNaN(n)?0:n; }
function fmt(n){ return Math.round(n).toLocaleString("en-GB"); }
function gp(n){
  var a = Math.abs(n), s = n < 0 ? "-" : "";
  if(a >= 1e9) return s + (a/1e9).toFixed(2) + "b";
  if(a >= 1e6) return s + (a/1e6).toFixed(2) + "m";
  if(a >= 1e3) return s + (a/1e3).toFixed(1) + "k";
  return s + Math.round(a);
}
var XP = [0,0];
(function(){ var acc = 0; for(var l = 1; l < 99; l++){ acc += Math.floor(l + 300*Math.pow(2, l/7)); XP[l+1] = Math.floor(acc/4); } })();
function xpForLevel(l){ return XP[Math.max(1,Math.min(99,l))] || 0; }
function levelFromXp(x){ var l = 1; while(l < 99 && XP[l+1] <= x) l++; return l; }
var MAXXP = 200000000;

/* ---------- game data (OSRS Wiki: Module:Giants' Foundry Calculator) ---------- */
var METALS = D.METALS;
var ORES = D.ORES;
/* Ordan's Ore seller at the Blast Furnace, Keldagrim. Prices are static for
   every account type since the January 2023 update, so no live feed is needed.
   Stock caps at 100 of each; a Dwarven Miner restocks 20-40 of one random ore
   every 27 seconds. He does not stock adamantite or runite at any price, and
   no shop anywhere sells finished bars. */
var ORE_SHOP = D.ORE_SHOP;

/* Lowest NPC shop price for every crucible-compatible item, from the wiki's
   Giants' Foundry/Strategies specialty-store tables. "bars" is what the item
   is worth in the crucible: the bars needed to smith it, minus one. */
var ANY = "best shop price";
var JW  = "Weapons galore, Jatizso";
var JA  = "Armour Shop, Jatizso";

/* [item, price, bars worth, shop]
   Unnamed rows are the wiki's lowest price across every shop that sells the
   item. The Jatizso rows are that shop's own table: both sell at 110%, four
   of each in stock, restocking one a minute. */
var SHOP_ITEMS = D.SHOP_ITEMS;

/* where these actually come from, by metal */
var SHOP_GUIDE = D.SHOP_GUIDE;

var SHOP_NOTES = "Cam Torum Blacksmith is the cheapest warhammers from bronze to adamant. "
  + "The Blacksmith in Civitas illa Fortis covers bronze to adamant, and Aneirin's Armour in "
  + "Prifddinas stocks mithril to rune.";

/* every way to get one bar of a metal, cheapest first */
function sources(metal, useBF, skipClaws, jatizsoOnly, preferItems){
  var out = [];
  (SHOP_ITEMS[metal.id] || []).forEach(function(it){
    if(skipClaws && it[0] === "claws") return;
    if(jatizsoOnly && it[3].indexOf("Jatizso") < 0) return;
    var nm = metal.item + " " + it[0];
    out.push({ kind:"item", label:nm + " \u2014 " + it[3], name:nm, shop:it[3],
               price:it[1], bars:it[2], per:it[1]/it[2] });
  });
  var ore = barShopCost(metal, useBF);
  if(ore != null && !jatizsoOnly)
    out.push({ kind:"ore", label:"Smelt it yourself from Ordan's ore", per:ore, bars:1, shop:"Ordan, Blast Furnace" });
  out.sort(function(a,b){
    /* you said you would rather buy the item than stand at a furnace, so ore
       sorts last unless nothing else is available */
    if(preferItems && a.kind !== b.kind) return a.kind === "ore" ? 1 : -1;
    return a.per - b.per;
  });
  /* this shop does not stock this metal at all: fall back rather than break */
  if(!out.length && jatizsoOnly) return sources(metal, useBF, skipClaws, false, preferItems);
  return out;
}

var SHOP_NAME = "Ordan, Ore seller \u00b7 Blast Furnace, Keldagrim";

function orePrice(id){ var o = ORE_SHOP[id]; return o && o.price != null ? o.price : null; }
function oreBuyable(id){ return orePrice(id) != null; }

/* what one bar costs in shop-bought ore, or null if part of it cannot be bought */
function barShopCost(metal, useBF){
  var total = 0;
  for(var ore in metal.smelt){
    var per = metal.smelt[ore];
    if(ore === "coal" && useBF) per = per/2;
    var p = orePrice(ore);
    if(p == null) return null;
    total += per*p;
  }
  return total;
}
function metalBuyable(metal){ return true; }   /* every metal has a shop item */

var MOULDS = D.MOULDS;
/* Kovac's commissions and how often each turns up; the weights sum to 24 */
var COMBOS = D.COMBOS;

function metalScore(t1,t2,a1,a2){
  var v1,v2;
  if(t2 === t1 || t2 === 0){ v1 = 10*t1; v2 = 0; }
  else { v1 = 10*t1*a1/28; v2 = 10*t2*a2/28; }
  return Math.floor((Math.floor(10*v1) + Math.floor(10*v2) + Math.floor(v1*v2))/10);
}
function swordXp(q){ return (Math.floor(q*q/73) + Math.floor(1.5*q) + 1)*30; }
function sections(score){ return score<20?3:score<60?4:score<90?5:score<120?6:7; }

/* best matching mould per commission, averaged over how often each comes up */
function averages(level, unlocked, mscore){
  var best = { Forte:{}, Blade:{}, Tip:{} };
  MOULDS.forEach(function(m){
    if(m.l > level) return;
    if(!m.d && !unlocked[m.n]) return;
    COMBOS.forEach(function(c,i){
      var s = m[c[0][0]] + m[c[0][1]];
      if(!(i in best[m.t]) || best[m.t][i] < s) best[m.t][i] = s;
    });
  });
  var q = 0, x = 0, mould = 0;
  COMBOS.forEach(function(c,i){
    var ms = (best.Forte[i]||0) + (best.Blade[i]||0) + (best.Tip[i]||0);
    var quality = mscore + ms;
    q += c[1]*quality/24; x += c[1]*swordXp(quality)/24; mould += c[1]*ms/24;
  });
  return { quality:q, xp:x, mould:mould };
}

/* ---------- state ---------- */
var unlocked = {}, bankBars = {}, bankOres = {};

(function build(){
  METALS.forEach(function(m){
    ["al-m1","al-m2"].forEach(function(id){
      var o = document.createElement("option");
      o.value = m.id; o.textContent = m.name; $(id).appendChild(o);
    });
  });
  var none = document.createElement("option");
  none.value = "none"; none.textContent = "None (single metal)";
  $("al-m2").appendChild(none);
  $("al-m1").value = "adamant"; $("al-m2").value = "rune";

  MOULDS.filter(function(m){ return !m.d; }).forEach(function(m){
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.setAttribute("aria-pressed","false");
    b.dataset.mould = m.n;
    b.innerHTML = '<span class="tick">&#10003;</span><span>' + m.n + '<em>' + m.t +
      ' \u00b7 level ' + m.l + ' \u00b7 ' + m.r + ' rep</em></span>';
    b.addEventListener("click", function(){
      var on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", on ? "false" : "true");
      unlocked[m.n] = !on; render();
    });
    $("mo-list").appendChild(b);
  });

  METALS.forEach(function(m){
    var d = document.createElement("div");
    d.className = "field";
    d.innerHTML = '<label>' + m.name + ' bars</label><input id="bar-' + m.id + '" type="number" min="0" placeholder="0">';
    $("fs-bars").appendChild(d);
  });
  ORES.forEach(function(o){
    var d = document.createElement("div");
    d.className = "field";
    d.innerHTML = '<label>' + o.name + '</label><input id="ore-' + o.id + '" type="number" min="0" placeholder="0">';
    $("fs-ores").appendChild(d);
  });
})();

/* ---------- calculation ---------- */
function calc(){
  var level = Math.max(1, Math.min(99, num($("sm-lvl").value) || 1));
  var curXp = num($("sm-xp").value);
  var m1 = METALS.filter(function(m){ return m.id === $("al-m1").value; })[0];
  var m2id = $("al-m2").value;
  var m2 = m2id === "none" ? null : METALS.filter(function(m){ return m.id === m2id; })[0];
  var a1 = Math.max(0, Math.min(28, Math.round(num($("al-a1").value))));
  if(!m2 || m2.id === m1.id){ a1 = 28; }
  var a2 = 28 - a1;

  var ms = metalScore(m1.tier, m2 ? m2.tier : 0, a1, a2);
  var avg = averages(level, unlocked, ms);
  var xpPer = avg.xp, coinsPer = Math.floor(xpPer)*2;

  /* how many swords the goal needs, crediting any experience from smelting */
  var goalType = $("sm-goaltype").value, goal = num($("sm-goal").value);
  var useBF = $("fs-bf").getAttribute("aria-pressed") === "true";
  var skipClaws = $("fs-claws").getAttribute("aria-pressed") === "true";
  var jatOnly = false;
  var preferItems = $("fs-items").getAttribute("aria-pressed") === "true";

  METALS.forEach(function(m){ bankBars[m.id] = num(($("bar-"+m.id)||{}).value); });
  ORES.forEach(function(o){ bankOres[o.id] = num(($("ore-"+o.id)||{}).value); });

  var need = {}; need[m1.id] = a1; if(m2 && a2 > 0) need[m2.id] = (need[m2.id]||0) + a2;

  function plan(swords){
    var ores = {}; ORES.forEach(function(o){ ores[o.id] = bankOres[o.id]; });
    var rows = [], smeltXp = 0, cost = 0, buy = [], oreBuy = {}, blocked = [];

    Object.keys(need).forEach(function(mid){
      var m = METALS.filter(function(x){ return x.id === mid; })[0];
      var opts = sources(m, useBF, skipClaws, jatOnly, preferItems);
      if(!opts.length) return;
      var pickEl = $("src-" + mid);
      var pick = pickEl && pickEl.value ? opts.filter(function(o){ return o.label === pickEl.value; })[0] : null;
      if(!pick) pick = opts[0];

      var want = need[mid]*swords;
      var fromBank = Math.min(bankBars[mid], want);
      var short = Math.max(0, want - fromBank);
      var rowCost = 0, detail = "";

      if(pick.kind === "ore"){
        if(m.lvl > level && short > 0) blocked.push(m.name + " needs " + m.lvl + " Smithing to smelt");
        var parts = [];
        for(var ore in m.smelt){
          var per = m.smelt[ore];
          if(ore === "coal" && useBF) per = per/2;
          var needOre = Math.ceil(short*per);
          var have = Math.min(ores[ore]||0, needOre);
          ores[ore] = (ores[ore]||0) - have;
          var gap = needOre - have;
          if(gap > 0){ oreBuy[ore] = (oreBuy[ore]||0) + gap; rowCost += gap*orePrice(ore); }
          parts.push(fmt(needOre) + " " + ORES.filter(function(x){ return x.id === ore; })[0].name);
        }
        smeltXp += short*m.xp;
        detail = parts.join(", ");
      }else{
        /* buying finished items: they go straight in the crucible, no smelting */
        var count = Math.ceil(short/pick.bars);
        rowCost = count*pick.price;
        if(count > 0) buy.push({ name:pick.name, count:count, each:pick.price, bars:pick.bars, cost:rowCost });
        detail = short > 0 ? fmt(count) + " \u00d7 " + pick.name + " (" + pick.bars + " bars each)" : "\u2014";
      }
      cost += rowCost;
      rows.push({ metal:m, want:want, fromBank:fromBank, short:short, pick:pick, detail:detail, cost:rowCost });
    });
    return { rows:rows, smeltXp:smeltXp, cost:cost, buy:buy, oreBuy:oreBuy, blocked:blocked };
  }

  /* smelting experience counts toward the goal  /* smelting experience counts toward the goal  /* smelting experience counts toward the goal, so settle on the sword count */
  var swords = 0, p = plan(0);
  for(var i = 0; i < 6; i++){
    var target;
    if(goalType === "rep"){ target = null; swords = Math.ceil(goal/Math.max(1, avg.quality)); }
    else{
      var goalXp = goalType === "level" ? xpForLevel(Math.round(goal)) : goal;
      var toGo = Math.max(0, Math.min(MAXXP, goalXp) - curXp - p.smeltXp);
      swords = xpPer > 0 ? Math.ceil(toGo/xpPer) : 0;
    }
    var np = plan(swords);
    if(Math.abs(np.smeltXp - p.smeltXp) < 1){ p = np; break; }
    p = np;
  }

  var foundryXp = swords*xpPer;
  var totalXp = foundryXp + p.smeltXp;
  var endXp = Math.min(MAXXP, curXp + totalXp);
  var rep = Math.floor(avg.quality*swords);
  var income = swords*coinsPer;
  var grogs = Math.floor(rep/300);

  return {
    level:level, curXp:curXp, m1:m1, m2:m2, a1:a1, a2:a2, ms:ms, avg:avg,
    xpPer:xpPer, coinsPer:coinsPer, swords:swords, plan:p, foundryXp:foundryXp,
    totalXp:totalXp, endXp:endXp, rep:rep, income:income, grogs:grogs,
    useBF:useBF, skipClaws:skipClaws, jatOnly:jatOnly, preferItems:preferItems, goalType:goalType
  };
}

/* ---------- render ---------- */
function stat(v,l,cls){ return '<div class="stat ' + (cls||"") + '"><span class="sv">' + v + '</span><span class="sl">' + l + '</span></div>'; }
function line(k,v,strong){ return '<div class="line' + (strong?" strong":"") + '"><span>' + k + '</span><b>' + v + '</b></div>'; }

function render(){
  var R = calc();

  $("sm-note").textContent = "Level " + levelFromXp(R.curXp) + " \u00b7 " +
    fmt(Math.max(0, xpForLevel(Math.min(99, levelFromXp(R.curXp)+1)) - R.curXp)) + " xp to the next level";

  /* alloy */
  $("al-stats").innerHTML =
    stat(fmt(R.ms), "metal score", "big") +
    stat(fmt(R.avg.quality), "average quality", "accent") +
    stat(fmt(R.xpPer), "xp per sword", "accent") +
    stat(gp(R.coinsPer), "coins per sword");
  $("al-foot").innerHTML = "Each sword comes out in <strong>" + sections(R.ms) + " sections</strong> and pays " +
    "<strong>" + fmt(R.avg.quality) + " reputation</strong>. Kovac pays twice the experience in coins. " +
    "Mould matching is adding <strong>" + R.avg.mould.toFixed(1) + "</strong> quality on average.";

  var warn = "";
  if(R.level < 15) warn = "You need 15 Smithing to enter the foundry at all.";
  else{
    var bad = [R.m1, R.m2].filter(function(m){ return m && m.lvl > R.level; });
    if(bad.length) warn = "You cannot smelt " + bad.map(function(m){ return m.name; }).join(" or ") +
      " yet, so those bars have to be bought rather than made.";
  }
  $("al-warn").innerHTML = warn ? '<div class="warn">' + warn + '</div>' : "";

  var totalMould = MOULDS.filter(function(m){ return !m.d && unlocked[m.n]; }).length;
  var repSpent = MOULDS.filter(function(m){ return !m.d && unlocked[m.n]; })
    .reduce(function(t,m){ return t + m.r; }, 0);
  $("mo-sum").textContent = totalMould + " of 15 ticked \u00b7 " + fmt(repSpent) +
    " reputation \u00b7 " + R.avg.mould.toFixed(1) + " average mould score";
  MOULDS.filter(function(m){ return !m.d; }).forEach(function(m){
    var b = $("mo-list").querySelector('[data-mould="' + CSS.escape(m.n) + '"]');
    if(b) b.toggleAttribute("disabled", m.l > R.level);
  });

  /* the run */
  var P = R.plan;
  $("rn-stats").innerHTML =
    stat(fmt(R.swords), "swords", "big") +
    stat(fmt(R.totalXp), "smithing xp", "accent") +
    stat(fmt(R.rep), "reputation") +
    stat(levelFromXp(R.endXp), "level you land on", "accent");

  /* the headline: how much metal, what it costs, how long it takes */
  var rate = Math.max(1, num($("sp-rate").value));
  var perDay = Math.max(1, num($("sp-day").value));
  var hours = R.swords/rate;
  var barsNeeded = 0, itemsToBuy = 0;
  P.rows.forEach(function(r){ barsNeeded += r.want; });
  P.buy.forEach(function(it){ itemsToBuy += it.count; });
  var profitTop = R.income - P.cost;

  function dur(h){
    if(h < 1) return Math.round(h*60) + " min";
    var whole = Math.floor(h), mins = Math.round((h - whole)*60);
    return whole + "h" + (mins ? " " + mins + "m" : "");
  }
  $("sum-stats").innerHTML =
    stat(fmt(R.swords), "swords to forge", "big") +
    stat(fmt(barsNeeded), "bars of metal", "accent") +
    stat(dur(hours), "at your rate", "accent") +
    stat((profitTop >= 0 ? "+" : "") + gp(profitTop), profitTop >= 0 ? "profit" : "net cost",
         profitTop >= 0 ? "good" : "bad");
  $("sp-hint").textContent = fmt(rate*R.xpPer) + " xp an hour";
  $("sp-dayhint").textContent = hours > 0
    ? Math.ceil(hours/perDay) + " day" + (Math.ceil(hours/perDay) === 1 ? "" : "s") + " of that"
    : "\u2014";
  $("sp-note").innerHTML = itemsToBuy > 0
    ? "<strong>" + fmt(itemsToBuy) + "</strong> items to buy, " + fmt(barsNeeded) + " bars of metal in total."
    : "Your bank covers the whole run.";

  /* keep a source picker in sync for each metal in the alloy */
  var used = [R.m1].concat(R.m2 && R.m2.id !== R.m1.id ? [R.m2] : []);
  var srcWrap = $("fs-src");
  srcWrap.innerHTML = used.map(function(m){
    var opts = sources(m, R.useBF, R.skipClaws, R.jatOnly, R.preferItems);
    var cur = ($("src-"+m.id) || {}).value;
    return '<div class="field"><label>' + m.name + '</label><select id="src-' + m.id + '">' +
      opts.map(function(o){
        return '<option value="' + o.label + '"' + (o.label === cur ? " selected" : "") + '>' +
          o.label + " \u2014 " + Math.round(o.per) + " gp/bar" +
          (o.bars > 1 ? " (" + o.bars + " bars each)" : "") + '</option>';
      }).join("") + '</select></div>';
  }).join("");
  srcWrap.querySelectorAll("select").forEach(function(sel){
    sel.addEventListener("change", render);
  });

  var rows = "";
  P.rows.forEach(function(r){
    rows += '<tr><td class="l">' + r.metal.name + '</td><td>' + fmt(r.want) + '</td><td>' +
      fmt(r.fromBank) + '</td><td>' + fmt(r.short) + '</td><td class="l">' + r.detail +
      '</td><td>' + (r.cost > 0 ? gp(r.cost) : "\u2014") + '</td></tr>';
  });
  $("rn-rows").innerHTML = rows || '<tr><td class="l" colspan="6">Nothing to make yet.</td></tr>';

  var shop = "";
  P.buy.forEach(function(it){
    shop += '<tr><td class="l">' + it.name + '</td><td>' + fmt(it.count) + '</td><td>' + fmt(it.each) +
      '</td><td>' + gp(it.cost) + '</td><td class="l">' + fmt(it.count*it.bars) + ' bars</td></tr>';
  });
  Object.keys(P.oreBuy).forEach(function(ore){
    var o = ORES.filter(function(x){ return x.id === ore; })[0], qty = P.oreBuy[ore], each = orePrice(ore);
    shop += '<tr><td class="l">' + o.name + '</td><td>' + fmt(qty) + '</td><td>' + each +
      '</td><td>' + gp(qty*each) + '</td><td class="l">' + fmt(Math.ceil(qty/ORE_SHOP[ore].stock)) +
      ' full buyouts</td></tr>';
  });
  $("buy-rows").innerHTML = shop ||
    '<tr><td class="l" colspan="5">Nothing to buy: your bank covers it.</td></tr>';

  var profit = R.income - P.cost;
  var money = line("Bought from shops", "-" + gp(P.cost)) +
    line("Coins from Kovac", "+" + gp(R.income)) +
    line(profit >= 0 ? "Profit" : "Net cost", (profit >= 0 ? "+" : "") + gp(profit), true) +
    line("Per experience", R.totalXp > 0
      ? (profit >= 0 ? gp(profit/R.totalXp) + " gp/xp earned" : gp(-profit/R.totalXp) + " gp/xp spent")
      : "\u2014") +
    (R.grogs > 0 ? line("Kovac's grog earned", fmt(R.grogs) + " (drinkable, not sellable)") : "");
  $("rn-money").innerHTML = money;

  var notes = [];
  if(P.smeltXp > 0) notes.push("Smelting your own bars is worth <strong>" + fmt(P.smeltXp) +
    "</strong> extra experience, counted toward the goal. Shop items skip that, but go straight in the crucible.");
  if(P.blocked.length) notes.push("<strong>" + P.blocked.join(". ") + ".</strong>");
  notes.push(SHOP_NOTES);
  $("rn-foot").innerHTML = notes.join(" ");
  $("fs-oreNote").textContent = R.useBF
    ? "Blast Furnace on: steel takes 1 coal, mithril 2, adamantite 3, runite 4."
    : "Blast Furnace off: steel takes 2 coal, mithril 4, adamantite 6, runite 8.";

  /* ore shelf */
  $("shop-rows").innerHTML = ORES.map(function(o){
    var e = ORE_SHOP[o.id];
    if(!e) return "";
    if(e.price == null)
      return '<tr class="mine"><td class="l">' + o.name + '</td><td>\u2014</td><td>\u2014</td><td>\u2014</td>' +
        '<td class="l">Not sold. Mine it, or buy the finished item instead.</td></tr>';
    return '<tr><td class="l">' + o.name + '</td><td>' + e.price + '</td><td>' + e.stock +
      '</td><td>~2 min</td><td class="l">static price</td></tr>';
  }).join("");

  $("guide-rows").innerHTML = SHOP_GUIDE.map(function(g){
    return '<tr><td class="l">' + g[0] + '</td><td class="l">' + g[1] + '</td><td class="l">' + g[2] + '</td></tr>';
  }).join("");

  /* item price table for the chosen metal */
  var ipm = METALS.filter(function(m){ return m.id === $("ip-metal").value; })[0] || R.m1;
  var list = sources(ipm, R.useBF, false, R.jatOnly, false).filter(function(o){ return o.kind === "item"; });
  var cheapNoClaws = list.filter(function(o){ return o.name.indexOf("claws") < 0; })[0];
  $("ip-rows").innerHTML = list.map(function(o){
    var claws = o.name.indexOf("claws") >= 0;
    return '<tr' + (o === cheapNoClaws ? ' class="best"' : (claws ? ' class="mine"' : '')) + '>' +
      '<td class="l">' + o.name + '</td><td class="l">' + o.shop + '</td><td>' + o.bars + '</td><td>' + fmt(o.price) + '</td><td>' +
      o.per.toFixed(2) + '</td><td class="l">' + (claws ? "stock too thin to rely on" :
      (o === cheapNoClaws ? "cheapest practical" : "")) + '</td></tr>';
  }).join("");
  var oreCost = barShopCost(ipm, R.useBF);
  $("ip-foot").innerHTML = (oreCost != null
      ? "Smelting " + ipm.name.toLowerCase() + " from Ordan's ore costs <strong>" + Math.round(oreCost) +
        " gp per bar</strong>" + (cheapNoClaws ? ", against " + Math.round(cheapNoClaws.per) +
        " for the cheapest item." : ".")
      : "No shop sells " + ipm.name.toLowerCase() + " ore, so items are the only way to buy this metal.")
    + " " + SHOP_NOTES;

  /* route comparison */  /* route comparison */  /* route comparison */
  var barsHeld = 0;
  METALS.forEach(function(m){ barsHeld += bankBars[m.id]; });
  var perBarFoundry = R.xpPer/28;
  $("cmp-rows").innerHTML =
    '<tr class="best"><td class="l">Giants\' Foundry, this alloy</td><td>' + perBarFoundry.toFixed(1) +
      '</td><td>' + fmt(perBarFoundry*barsHeld) + '</td><td class="l">28 bars a sword</td></tr>' +
    '<tr><td class="l">Anvil, any item</td><td>12.5</td><td>' + fmt(12.5*barsHeld) +
      '</td><td class="l">flat rate per bar</td></tr>' +
    '<tr><td class="l">Cannonballs</td><td>25.5</td><td>' + fmt(25.5*barsHeld) +
      '</td><td class="l">steel bars only, 35 Smithing</td></tr>';

  /* alloy table */
  var opts = [];
  METALS.forEach(function(A){
    opts.push({ a:A, b:null, a1:28, a2:0 });
    METALS.forEach(function(B){ if(B.tier > A.tier) opts.push({ a:A, b:B, a1:14, a2:14 }); });
  });
  opts.forEach(function(o){
    o.ms = metalScore(o.a.tier, o.b ? o.b.tier : 0, o.a1, o.a2);
    var av = averages(R.level, unlocked, o.ms);
    o.q = av.quality; o.xp = av.xp;
    var cA = (sources(o.a, R.useBF, R.skipClaws, R.jatOnly, R.preferItems)[0]||{per:Infinity}).per;
    var cB = o.b ? (sources(o.b, R.useBF, R.skipClaws, R.jatOnly, R.preferItems)[0]||{per:Infinity}).per : 0;
    o.shopFed = true;
    o.cost = o.a1*cA + o.a2*cB;
    o.net = (o.cost - Math.floor(o.xp)*2)/o.xp;
  });
  opts.sort(function(x,y){ return y.xp - x.xp; });
  var best = opts[0];
  $("tbl-rows").innerHTML = opts.map(function(o){
    var name = o.b ? (o.a.name + " + " + o.b.name + " (14/14)") : (o.a.name + " (28)");
    var cur = o.a.id === R.m1.id && ((!o.b && !R.m2) || (o.b && R.m2 && o.b.id === R.m2.id));
    var cls = o === best || cur ? "best" : (o.shopFed ? "" : "mine");
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td class="l">' + name +

      '</td><td>' + fmt(o.ms) + '</td><td>' + sections(o.ms) + '</td><td>' + fmt(o.q) +
      '</td><td>' + fmt(o.xp) + '</td><td>' + (o.shopFed ? gp(o.cost) : "\u2014") +
      '</td><td>' + (o.shopFed ? o.net.toFixed(2) : "\u2014") + '</td></tr>';
  }).join("");
}

/* ---------- wiring ---------- */
["sm-lvl","sm-xp","sm-goal","al-a1","sp-rate","sp-day"].forEach(function(id){
  $(id).addEventListener("input", function(){
    if(id === "sm-lvl"){ $("sm-xp").value = xpForLevel(Math.round(num($("sm-lvl").value))); }
    if(id === "sm-xp"){ $("sm-lvl").value = levelFromXp(num($("sm-xp").value)); }
    render();
  });
});
["sm-goaltype","al-m1","al-m2"].forEach(function(id){ $(id).addEventListener("change", render); });
["fs-bf","fs-claws","fs-items"].forEach(function(id){
  $(id).addEventListener("click", function(){
    var b = $(id), on = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", on ? "false" : "true"); render();
  });
});
METALS.forEach(function(m){
  var o = document.createElement("option");
  o.value = m.id; o.textContent = m.name; $("ip-metal").appendChild(o);
});
$("ip-metal").value = "adamant";
$("ip-metal").addEventListener("change", render);
$("fs-bars").addEventListener("input", render);
$("fs-ores").addEventListener("input", render);
$("mo-all").addEventListener("click", function(){
  MOULDS.forEach(function(m){ if(!m.d) unlocked[m.n] = true; });
  $("mo-list").querySelectorAll(".chip").forEach(function(b){ b.setAttribute("aria-pressed","true"); });
  render();
});
$("mo-none").addEventListener("click", function(){
  unlocked = {};
  $("mo-list").querySelectorAll(".chip").forEach(function(b){ b.setAttribute("aria-pressed","false"); });
  render();
});
render();

}
