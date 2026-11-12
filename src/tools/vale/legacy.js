import D from "../../data/vale.json";

// Original calculator logic, moved from the single-page site. It talks to
// the DOM by id, so it runs once its markup is in the document.
export function mountLegacy() {
function $(id){ return document.getElementById(id); }
function num(v){ var n = parseFloat(String(v).replace(/[^0-9.\-]/g,"")); return isNaN(n)?0:n; }
function fmt(n){ return Math.round(n).toLocaleString("en-GB"); }
function dur(h){
  if(h <= 0) return "\u2014";
  if(h < 1) return Math.round(h*60) + " min";
  var w = Math.floor(h), m = Math.round((h-w)*60);
  if(m === 60){ w++; m = 0; }
  return w + "h" + (m ? " " + m + "m" : "");
}
var XP = [0,0];
(function(){ var a = 0; for(var l = 1; l < 99; l++){ a += Math.floor(l + 300*Math.pow(2, l/7)); XP[l+1] = Math.floor(a/4); } })();
function xpForLevel(l){ return XP[Math.max(1,Math.min(99,l))] || 0; }
function levelFromXp(x){ var l = 1; while(l < 99 && XP[l+1] <= x) l++; return l; }
var MAXXP = 200000000;

/* OSRS Wiki, Vale Totems/Strategies "Base Totem XP and Offerings".
   XP total = one build + three carvings + four decorations.
   Oak durability 2 and redwood 7 are stated; the tiers between are the even
   steps that fit the seven-leaf indicator. */
var TIERS = D.TIERS;

/* Decorations: logs each, the level to make them, and the ordinary fletching xp
   they give if you make them yourself. Oak through yew are derived from the
   wiki's "Fletching Decorations Between Totems" totals; magic and redwood use
   the standard fletching values for those products. */
var DECS = D.DECS;
var SITES = 8;

var rateTouched = false;
function tierOf(id){ return TIERS.filter(function(t){ return t.id === id; })[0] || TIERS[0]; }

function build(){
  TIERS.forEach(function(t){
    var o = document.createElement("option");
    o.value = t.id; o.textContent = t.name + " \u00b7 " + t.lvl + " Fletching";
    $("vt-log").appendChild(o);
  });
  $("vt-log").value = "yew";
  fillDecs();
}
function fillDecs(){
  var t = $("vt-log").value, sel = $("vt-dec"), cur = sel.value;
  sel.innerHTML = "";
  (DECS[t] || []).forEach(function(d){
    var o = document.createElement("option");
    o.value = d[0]; o.textContent = d[0] + " \u00b7 " + d[1] + " log" + (d[1] > 1 ? "s" : "") + " \u00b7 lvl " + d[2];
    sel.appendChild(o);
  });
  if([].slice.call(sel.options).some(function(o){ return o.value === cur; })) sel.value = cur;
}

function calc(){
  var level = Math.max(1, Math.min(99, num($("vt-lvl").value) || 1));
  var curXp = num($("vt-xp").value);
  var tier  = tierOf($("vt-log").value);
  var decs  = DECS[tier.id] || [];
  var dec   = decs.filter(function(d){ return d[0] === $("vt-dec").value; })[0] || decs[0];

  var knife   = $("vt-knife").getAttribute("aria-pressed")  === "true";
  var basket  = $("vt-basket").getAttribute("aria-pressed") === "true";
  var fletch  = $("vt-fletch").getAttribute("aria-pressed") === "true";
  var house   = $("vt-house").getAttribute("aria-pressed")  === "true";
  var wrong   = num($("vt-wrong").value);
  var conLvl  = Math.max(1, num($("vt-con").value));
  var have    = num($("vt-have").value);

  /* 1 log builds the totem, 4 decorations on top */
  var logsPerTotem = 1 + 4*dec[1];

  /* wrong spirits cost a quarter of the totem's experience each */
  var mult = Math.max(0, 1 - 0.25*wrong);
  var totemXp = tier.total*mult;
  var fletchXp = fletch ? 4*dec[3] : 0;
  var xpPerTotem = totemXp + fletchXp;
  var conXp = house ? conLvl : 0;

  /* the wiki compares everything at 13 loops, 104 totems, an hour. These
     adjustments are my own reading of its notes, so the rate stays editable. */
  var baseRate = 104, mods = [];
  if(fletch){ baseRate *= 0.95; mods.push("fletching as you run, 5% slower"); }
  if(fletch && !knife){ baseRate *= 0.88; mods.push("no fletching knife, 12% slower again"); }
  if(!basket){ baseRate *= 0.95; mods.push("no log basket, an extra bank stop"); }
  var suggested = Math.round(baseRate);
  /* follow the kit unless the rate has been typed over by hand */
  if(!rateTouched && num($("vt-rate").value) !== suggested) $("vt-rate").value = suggested;
  var rate = Math.max(1, num($("vt-rate").value));

  var goalType = $("vt-goaltype").value, goal = num($("vt-goal").value);
  var totems;
  if(goalType === "logs")          totems = Math.floor(have/logsPerTotem);
  else if(goalType === "offerings")totems = Math.ceil(goal/tier.off);
  else if(goalType === "points")   totems = Math.ceil(goal/(tier.off/100));
  else {
    var goalXp = goalType === "level" ? xpForLevel(Math.round(goal)) : goal;
    var toGo = Math.max(0, Math.min(MAXXP, goalXp) - curXp);
    totems = xpPerTotem > 0 ? Math.ceil(toGo/xpPerTotem) : 0;
  }
  totems = Math.max(0, totems);

  var rounds     = totems/SITES;
  var logsNeeded = totems*logsPerTotem;
  var logsShort  = Math.max(0, logsNeeded - have);
  var hours      = totems/rate;
  var offerings  = totems*tier.off;
  var points     = offerings/100;
  var totalXp    = totems*xpPerTotem;
  var endXp      = Math.min(MAXXP, curXp + totalXp);
  /* a basket lets you clear all eight sites; without one you reset halfway */
  var bankTrips  = Math.ceil(totems/(basket ? SITES : SITES/2));

  return { level:level, curXp:curXp, tier:tier, dec:dec, decs:decs, knife:knife, basket:basket,
    fletch:fletch, house:house, wrong:wrong, mult:mult, logsPerTotem:logsPerTotem,
    totemXp:totemXp, fletchXp:fletchXp, xpPerTotem:xpPerTotem, conXp:conXp,
    totems:totems, rounds:rounds, logsNeeded:logsNeeded, have:have, logsShort:logsShort,
    hours:hours, rate:rate, suggested:suggested, mods:mods, offerings:offerings, points:points,
    totalXp:totalXp, endXp:endXp, bankTrips:bankTrips, goalType:goalType };
}

function stat(v,l,cls){ return '<div class="stat ' + (cls||"") + '"><span class="sv">' + v + '</span><span class="sl">' + l + '</span></div>'; }
function line(k,v,strong){ return '<div class="line' + (strong?" strong":"") + '"><span>' + k + '</span><b>' + v + '</b></div>'; }

function render(){
  var R = calc();

  $("sum").innerHTML =
    stat(fmt(R.logsNeeded), "logs needed", "big") +
    stat(dur(R.hours), "time to run it", "accent") +
    stat(fmt(Math.ceil(R.rounds)), "rounds of eight", "accent") +
    stat(fmt(R.totems), "totems", "leaf");
  $("sum-note").innerHTML = R.logsShort > 0
    ? "You have <strong>" + fmt(R.have) + "</strong> " + R.tier.name.toLowerCase() +
      " logs, so you are <strong>" + fmt(R.logsShort) + "</strong> short. That is " +
      fmt(Math.floor(R.have/R.logsPerTotem)) + " totems' worth on hand."
    : (R.have > 0
        ? "Your <strong>" + fmt(R.have) + "</strong> logs cover the whole thing with " +
          fmt(R.have - R.logsNeeded) + " to spare."
        : "Each totem takes <strong>" + R.logsPerTotem + "</strong> logs: one for the base and four for decorations.");

  $("vt-note").textContent = "Level " + levelFromXp(R.curXp) + " \u00b7 " +
    fmt(Math.max(0, xpForLevel(Math.min(99, levelFromXp(R.curXp)+1)) - R.curXp)) + " xp to the next level";
  $("vt-logh").textContent = R.tier.total.toLocaleString("en-GB") + " xp and " + R.tier.off + " offerings a totem";
  $("vt-haveh").textContent = R.have > 0 ? Math.floor(R.have/R.logsPerTotem) + " totems' worth" : "leave at 0 if buying as you go";
  $("vt-dech").textContent = R.dec[1] + " log" + (R.dec[1] > 1 ? "s" : "") + " each" +
    (R.fletch ? " \u00b7 " + R.dec[3] + " fletching xp each" : " \u00b7 pre-made, no extra xp");
  $("vt-rateh").innerHTML = "wiki compares at 104 an hour" + (R.mods.length ? " \u00b7 your kit suggests " + R.suggested : "");

  var warn = "";
  if(R.level < R.tier.lvl) warn = "You need " + R.tier.lvl + " Fletching for " + R.tier.name.toLowerCase() + " totems and you are " + R.level + ".";
  else if(R.level < R.dec[2]) warn = R.tier.name + " " + R.dec[0].toLowerCase() + " needs " + R.dec[2] + " Fletching. Decorating with one needs the same level as making it.";
  $("vt-warn").innerHTML = warn ? '<div class="warn">' + warn + '</div>' : "";

  /* the round */
  $("round-stats").innerHTML =
    stat(fmt(R.logsPerTotem*SITES), "logs a round") +
    stat(fmt(SITES*R.xpPerTotem), "xp a round", "accent") +
    stat(fmt(SITES*R.tier.off), "offerings a round", "leaf") +
    stat(fmt(R.bankTrips), "bank stops in total");

  var lines = line("Totem experience", fmt(R.totemXp) + " each" + (R.wrong ? " (" + Math.round(R.mult*100) + "% after " + R.wrong + " wrong)" : "")) +
    (R.fletch ? line("Fletching the four decorations", "+" + fmt(R.fletchXp) + " each") : "") +
    line("Experience a totem", fmt(R.xpPerTotem) + "", true) +
    line("Experience an hour", fmt(R.xpPerTotem*R.rate)) +
    (R.house ? line("Construction experience", "+" + fmt(R.conXp*R.totems) + " over the run") : "") +
    line("Total Fletching experience", "+" + fmt(R.totalXp)) +
    line("Level you land on", String(levelFromXp(R.endXp)), true);
  $("round-lines").innerHTML = lines;

  var foot = [];
  foot.push("A round is all eight sites, " + (R.basket
    ? "and the log basket carries enough to finish one without banking."
    : "and without a log basket you reset at Nemus Retreat halfway, so two stops a round."));
  if(R.mods.length) foot.push("Rate suggestion accounts for: " + R.mods.join("; ") + ".");
  foot.push("Building a totem restores 15% run energy, and admiring scenery alongside an ent gives 20% more, " +
    "so run energy is rarely the limit. Stepping on both halves of an ent trail gives 15% more experience for the " +
    "next four build and carve actions and doubles that ent's next offering.");
  $("round-foot").innerHTML = foot.join(" ");

  /* offerings */
  $("off-stats").innerHTML =
    stat(fmt(R.offerings), "vale offerings", "big") +
    stat(fmt(R.points), "research points", "leaf") +
    stat(fmt(R.tier.off*R.rate), "offerings an hour") +
    stat(R.tier.durab, "ent visits a totem", "accent");
  var expKnife = R.offerings/333, expMask = R.offerings/500;
  $("off-drops").innerHTML = '<div style="margin-top:14px">' +
    line("Fletching knife at ~1/333", expKnife >= 1 ? fmt(expKnife) + " expected" : (expKnife*100).toFixed(1) + "% chance") +
    line("Greenman's mask at ~1/500", expMask >= 1 ? fmt(expMask) + " expected" : (expMask*100).toFixed(1) + "% chance") +
    '</div>';

  /* every tier */
  $("tier-rows").innerHTML = TIERS.map(function(t){
    var d = (DECS[t.id]||[])[0];
    var lpt = 1 + 4*d[1];
    var f = R.fletch ? 4*d[3] : 0;
    var xpt = t.total*R.mult + f;
    var locked = R.level < t.lvl;
    var cls = t.id === R.tier.id ? "best" : (locked ? "locked" : "");
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td class="l">' + t.name +
      (locked ? " \u2014 locked" : "") + '</td><td>' + t.lvl + '</td><td>' + fmt(xpt) +
      '</td><td>' + t.off + '</td><td>' + t.durab + '</td><td>' + fmt(xpt*R.rate) +
      '</td><td>' + fmt(lpt*R.rate) + '</td></tr>';
  }).join("");
}

build();
["vt-lvl","vt-xp","vt-goal","vt-have","vt-rate","vt-con"].forEach(function(id){
  $(id).addEventListener("input", function(){
    if(id === "vt-rate") rateTouched = true;
    if(id === "vt-lvl") $("vt-xp").value = xpForLevel(Math.round(num($("vt-lvl").value)));
    if(id === "vt-xp")  $("vt-lvl").value = levelFromXp(num($("vt-xp").value));
    render();
  });
});
["vt-goaltype","vt-dec","vt-wrong"].forEach(function(id){ $(id).addEventListener("change", render); });
$("vt-log").addEventListener("change", function(){ fillDecs(); render(); });
["vt-knife","vt-basket","vt-fletch","vt-house"].forEach(function(id){
  $(id).addEventListener("click", function(){
    var b = $(id), on = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", on ? "false" : "true"); render();
  });
});
render();

}
