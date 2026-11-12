import D from "../../data/mixology.json";

// Original calculator logic, moved from the single-page site. It talks to
// the DOM by id, so it runs once its markup is in the document.
export function mountLegacy() {
/* ---------- xp table ---------- */
var XP_TABLE = (function(){
  var t=[0,0], p=0;
  for(var l=1;l<126;l++){ p += Math.floor(l + 300*Math.pow(2,l/7)); t[l+1]=Math.floor(p/4); }
  return t;
})();
function xpForLevel(l){ return XP_TABLE[Math.max(1,Math.min(126,l))] || 0; }
function levelFromXp(xp){ for(var i=126;i>=1;i--){ if(xp>=XP_TABLE[i]) return i; } return 1; }
var MAX_XP = 200000000;

/* ---------- data ---------- */
var HERBS = D.HERBS;
function sec(name,qty,save){ return {name:name, qty:qty===undefined?1:qty, save:save!==false}; }
var POTIONS = D.POTIONS;
var BASES = D.BASES;
var RECOMMENDED = D.RECOMMENDED;
var PASTE_META = {
  mox:{label:"Mox",colour:"green",css:"var(--mox)"},
  aga:{label:"Aga",colour:"blue",css:"var(--aga)"},
  lye:{label:"Lye",colour:"red",css:"var(--lye)"}
};

/* ---------- helpers ---------- */
function num(v){ var n=parseFloat(String(v).replace(/[^0-9.\-]/g,"")); return (isFinite(n)&&n>0)?n:0; }
function fmt(n,d){ d=d||0; var f=Math.pow(10,d);
  return (Math.round(n*f)/f).toLocaleString("en-GB",{minimumFractionDigits:d,maximumFractionDigits:d}); }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function on(el){ return el.getAttribute("aria-pressed")==="true"; }
function line(k,v,opt){ opt=opt||{};
  return '<div class="line'+(opt.sub?" sub":"")+(opt.strong?" strong":"")+'"><span>'+esc(k)+
    '</span><span class="mono"'+(opt.c?' style="color:'+opt.c+'"':"")+'>'+v+'</span></div>'; }

/* ---------- build herb rows + vials ---------- */
var rows = [];
(function build(){
  var tb = $("herb-rows");
  HERBS.forEach(function(h){
    var tr = document.createElement("tr");
    var opts = '<option value="paste">Refine to '+PASTE_META[h.paste].label+' paste</option>';
    (POTIONS[h.id]||[]).forEach(function(p){
      opts += '<option value="'+p.id+'">'+esc(p.name)+' (lvl '+p.lvl+')</option>';
    });
    opts += '<option value="keep">Leave in the bank</option>';
    tr.innerHTML =
      '<td class="l herbname"><span class="dot" style="background:'+PASTE_META[h.paste].css+'"></span>'+
        esc(h.name)+'<span class="pasteqty">'+h.qty+' '+PASTE_META[h.paste].label.toLowerCase()+'</span></td>'+
      '<td><input inputmode="numeric" placeholder="0"></td>'+
      '<td><input inputmode="numeric" placeholder="0"></td>'+
      '<td class="mono">-</td>'+
      '<td class="mono held">-</td>'+
      '<td class="l"><select>'+opts+'</select><span class="lock hide"></span></td>'+
      '<td class="r mono out">-</td>';
    tb.appendChild(tr);
    var ins = tr.querySelectorAll("input");
    var r = {herb:h, tr:tr, seeds:ins[0], stock:ins[1],
      total:tr.children[3], held:tr.children[4],
      select:tr.querySelector("select"), lock:tr.querySelector(".lock"), out:tr.children[6]};
    r.select.value = RECOMMENDED[h.id];
    [r.seeds,r.stock].forEach(function(el){ el.addEventListener("input", paint); });
    r.select.addEventListener("change", paint);
    rows.push(r);
  });

  var vw = $("vials");
  ["mox","aga","lye"].forEach(function(k){
    var d = document.createElement("div");
    d.className = "vial";
    d.innerHTML = '<div class="tube"><div class="capline"><span>hopper 3,000</span></div>'+
      '<div class="fill" style="background:'+PASTE_META[k].css+'"></div></div>'+
      '<div class="vlabel"><strong style="color:'+PASTE_META[k].css+'">0</strong>'+
      '<span>'+PASTE_META[k].label+' &middot; '+PASTE_META[k].colour+'</span>'+
      '<span class="tiny">0 hopper fills</span></div>';
    vw.appendChild(d);
    d.refs = {fill:d.querySelector(".fill"), cap:d.querySelector(".capline"),
      val:d.querySelector("strong"), tiny:d.querySelector(".tiny")};
  });
})();

/* ---------- calculation ---------- */
function calc(){
  var startXp = Math.min(MAX_XP, num($("xp").value));
  var startLevel = levelFromXp(startXp);
  var yieldN = num($("yield").value);
  var goggles = on($("t-goggles")), scpOn = on($("t-scp"));
  var triple = on($("t-triple")), cleanup = on($("t-cleanup"));
  var amulet = $("amulet").value, strategy = $("strategy").value;
  var bonus = num($("speedxp").value);

  var totals = {};
  rows.forEach(function(r){ totals[r.herb.id] = num(r.seeds.value)*yieldN + num(r.stock.value); });

  /* super combat chain */
  var dosesPer = 3 + (amulet==="alch"?0.15:amulet==="chem"?0.05:0);
  var herbsPerSuper = 4/dosesPer;
  var torstolPer = goggles?0.9:1;
  /* what is already sitting in the bank */
  var bank = {
    att:num($("bk-att").value), str:num($("bk-str").value), def:num($("bk-def").value),
    shard:num($("bk-shard").value), dust:num($("bk-dust").value), amyl:num($("bk-amyl").value),
    energy:num($("bk-energy").value), senergy:num($("bk-senergy").value), stam:num($("bk-stam").value)
  };
  /* the recipe wants a full 4-dose of each super, so loose doses do not count */
  var haveSup = {att:Math.floor(bank.att/4), str:Math.floor(bank.str/4), def:Math.floor(bank.def/4)};

  var scp = {made:0,supers:0,torstol:0,irit:0,kwuarm:0,cadantine:0,xp:0,limiter:"",
             fromBank:0,fromHerbs:0,usedBank:{att:0,str:0,def:0}};
  if(scpOn){
    /* each super combat needs one 4-dose of each super: bank stock first, herbs after */
    var supply = function(held, herbs){ return held + herbs/herbsPerSuper; };
    var cap = Math.min(totals.torstol/torstolPer,
      supply(haveSup.att, totals.irit),
      supply(haveSup.str, totals.kwuarm),
      supply(haveSup.def, totals.cadantine));
    var target = num($("scptarget").value);
    if(target>0) cap = Math.min(cap,target);
    scp.made = Math.max(0, Math.floor(cap));

    var need = function(held){ return Math.max(0, scp.made - held); };
    var nIrit = need(haveSup.att), nKwuarm = need(haveSup.str), nCadantine = need(haveSup.def);
    scp.usedBank = {att:Math.min(haveSup.att, scp.made)*4,
                    str:Math.min(haveSup.str, scp.made)*4,
                    def:Math.min(haveSup.def, scp.made)*4};
    scp.fromBank  = Math.min(haveSup.att, haveSup.str, haveSup.def, scp.made);
    scp.fromHerbs = scp.made - scp.fromBank;

    scp.supers = (nIrit + nKwuarm + nCadantine) * herbsPerSuper / 3;   /* average, for secondaries */
    scp.torstol = Math.ceil(scp.made*torstolPer);
    scp.irit      = Math.ceil(nIrit*herbsPerSuper);
    scp.kwuarm    = Math.ceil(nKwuarm*herbsPerSuper);
    scp.cadantine = Math.ceil(nCadantine*herbsPerSuper);
    scp.xp = nIrit*herbsPerSuper*100 + nKwuarm*herbsPerSuper*125
           + nCadantine*herbsPerSuper*150 + scp.made*150;

    var herbCap = Math.min(supply(haveSup.att,totals.irit), supply(haveSup.str,totals.kwuarm),
                           supply(haveSup.def,totals.cadantine));
    scp.limiter = (totals.torstol/torstolPer <= herbCap) ? "Torstol" : "Irit / Kwuarm / Cadantine";
  }

  /* divine potions: one crystal dust per dose, 97 Herblore, 0.5 xp a dose */
  var dustTotal = bank.dust + bank.shard*10;
  var divine = {doses:Math.min(dustTotal, scp.made*4), pots:0, xp:0, dustLeft:0};
  divine.pots = divine.doses/4;
  divine.xp = divine.doses*0.5;
  divine.dustLeft = dustTotal - divine.doses;

  /* stamina: one amylase per dose of super energy */
  var stamina = {doses:Math.min(bank.amyl, bank.senergy), xp:0};
  stamina.xp = stamina.doses*(76.5/4);
  var reserved = {torstol:scp.torstol, irit:scp.irit, kwuarm:scp.kwuarm, cadantine:scp.cadantine};
  var free = {};
  HERBS.forEach(function(h){ free[h.id] = Math.max(0, totals[h.id] - (reserved[h.id]||0)); });

  /* routes */
  var paste = {mox:num($("paste-mox").value), aga:num($("paste-aga").value), lye:num($("paste-lye").value)};
  var refinedHerbs = 0, potionXp = 0, potionCount = 0;
  var potionRows = [], secondaries = {};
  function addSec(n,q){ secondaries[n] = (secondaries[n]||0)+q; }

  rows.forEach(function(r){
    var h = r.herb, n = free[h.id];
    r.route = r.select.value;
    if(n<=0) return;
    if(r.route==="paste"){ paste[h.paste] += n*h.qty; refinedHerbs += n; }
    else if(r.route!=="keep"){
      var p = null, list = POTIONS[h.id]||[];
      for(var i=0;i<list.length;i++) if(list[i].id===r.route) p=list[i];
      if(!p) return;
      potionRows.push({herb:h,potion:p,count:n});
      potionXp += n*p.xp; potionCount += n;
      p.sec.forEach(function(sc){ addSec(sc.name, n*sc.qty*(goggles&&sc.save?0.9:1)); });
    }
  });
  if(scp.made>0){
    var mult = goggles?0.9:1;
    addSec("Eye of newt", scp.supers*mult);
    addSec("Limpwurt root", scp.supers*mult);
    addSec("White berries", scp.supers*mult);
  }

  var refineXp = refinedHerbs*6;
  var vials = potionCount + Math.ceil(scp.supers)*3;
  var startPaste = {mox:paste.mox, aga:paste.aga, lye:paste.lye};

  /* mixology sim */
  var m=paste.mox, a=paste.aga, l=paste.lye;
  var xp = Math.min(MAX_XP, startXp + refineXp + potionXp + scp.xp + divine.xp + stamina.xp);
  var mixPotions=0, mixXp=0, cleanupPotions=0, guard=0;
  var resin = {mox:0,aga:0,lye:0};

  while(guard++ < 400){
    var lvl = levelFromXp(xp);
    if(lvl<60) break;
    var pool = BASES.filter(function(b){ return b.lvl<=lvl; });
    if(strategy==="mixalot"){
      var mal = BASES.filter(function(b){ return b.id==="MAL" && b.lvl<=lvl; });
      if(mal.length) pool = mal;
    }
    if(!pool.length) break;
    var W=0,cm=0,ca=0,cl=0,px=0,rm=0,ra=0,rl=0;
    pool.forEach(function(b){ W+=b.w; cm+=b.w*b.mox; ca+=b.w*b.aga; cl+=b.w*b.lye;
      px+=b.w*b.xp; rm+=b.w*b.rm; ra+=b.w*b.ra; rl+=b.w*b.rl; });
    cm/=W; ca/=W; cl/=W; rm/=W; ra/=W; rl/=W; px = px/W + bonus;

    var capacity = Infinity;
    if(cm>0) capacity = Math.min(capacity, m/cm);
    if(ca>0) capacity = Math.min(capacity, a/ca);
    if(cl>0) capacity = Math.min(capacity, l/cl);
    if(!isFinite(capacity) || capacity<1) break;

    var toLevel = Infinity;
    if(lvl<126) toLevel = Math.ceil((xpForLevel(lvl+1)-xp)/px);
    var batch = Math.max(1, Math.floor(Math.min(capacity, Math.max(1,toLevel))));

    m -= batch*cm; a -= batch*ca; l -= batch*cl;
    mixPotions += batch; mixXp += batch*px;
    xp = Math.min(MAX_XP, xp + batch*px);
    resin.mox += batch*rm; resin.aga += batch*ra; resin.lye += batch*rl;
  }

  if(cleanup && levelFromXp(xp)>=60){
    var burn = function(amount, rkey){
      var n = Math.floor(amount/30);
      if(n<=0) return 0;
      cleanupPotions += n; mixPotions += n; mixXp += n*(190+bonus);
      xp = Math.min(MAX_XP, xp + n*(190+bonus)); resin[rkey] += n*20;
      return n*30;
    };
    m -= burn(m,"mox"); a -= burn(a,"aga"); l -= burn(l,"lye");
  }

  var dw = num($("digweed").value), digXp = 0;
  if(dw>0 && mixPotions>0){
    var lv = levelFromXp(xp);
    var best = BASES.filter(function(b){ return b.lvl<=lv; }).sort(function(x,y){ return y.xp-x.xp; })[0];
    if(best){
      digXp = dw*best.xp;
      xp = Math.min(MAX_XP, xp+digXp);
      resin.mox += dw*best.rm; resin.aga += dw*best.ra; resin.lye += dw*best.rl;
    }
  }
  if(triple){ resin.mox*=1.4; resin.aga*=1.4; resin.lye*=1.4; }

  var leftover = {mox:Math.max(0,m), aga:Math.max(0,a), lye:Math.max(0,l)};
  var pasteSpent = (startPaste.mox-leftover.mox)+(startPaste.aga-leftover.aga)+(startPaste.lye-leftover.lye);
  var goal = Math.max(1, Math.min(126, Math.round(num($("goal").value))||99));

  return {
    startXp:startXp, startLevel:startLevel, totals:totals, free:free, reserved:reserved,
    scp:scp, herbsPerSuper:herbsPerSuper, dosesPer:dosesPer, goggles:goggles, scpOn:scpOn,
    bank:bank, haveSup:haveSup, divine:divine, stamina:stamina, dustTotal:dustTotal, startLevel:startLevel,
    startPaste:startPaste, refinedHerbs:refinedHerbs, refineXp:refineXp,
    potionRows:potionRows, potionXp:potionXp, secondaries:secondaries, vials:vials,
    mixPotions:mixPotions, mixXp:mixXp, cleanupPotions:cleanupPotions, digXp:digXp,
    resin:resin, leftover:leftover, pasteSpent:Math.max(0,pasteSpent),
    endXp:xp, endLevel:levelFromXp(xp), totalXp:xp-startXp,
    goal:goal, goalXp:xpForLevel(goal), goalRemaining:Math.max(0, xpForLevel(goal)-xp),
    aldarium:Math.floor(Math.min(resin.mox/80, resin.aga/60, resin.lye/90))
  };
}

/* ---------- render ---------- */
function paint(){
  var R = calc();

  $("hdr-level").textContent = R.endLevel>99 ? 99 : R.endLevel;
  $("hdr-cap").textContent = R.endLevel>99 ? ("virtual "+R.endLevel) : ("from "+R.startLevel);
  $("xp-hint").textContent = "Level "+R.startLevel;
  $("goal-hint").textContent = fmt(R.goalXp)+" xp";
  $("amulet-hint").textContent = fmt(R.dosesPer,2)+" doses per potion";
  $("warn-60").classList.toggle("hide", R.startLevel>=60);

  var totalHerbs = 0;
  rows.forEach(function(r){
    var h=r.herb, t=R.totals[h.id], res=R.reserved[h.id]||0, n=R.free[h.id];
    totalHerbs += t;
    r.tr.classList.toggle("live", t>0);
    r.total.textContent = t ? fmt(t) : "-";
    r.held.textContent = res ? fmt(res) : "-";
    var p=null, list=POTIONS[h.id]||[];
    for(var i=0;i<list.length;i++) if(list[i].id===r.select.value) p=list[i];
    var locked = p && R.startLevel < p.lvl;
    r.lock.classList.toggle("hide", !locked);
    if(locked) r.lock.textContent = "needs "+p.lvl;
    r.out.textContent = n<=0 ? "-"
      : r.select.value==="paste" ? fmt(n*h.qty)+" "+PASTE_META[h.paste].label.toLowerCase()
      : r.select.value==="keep" ? fmt(n)+" kept"
      : fmt(n)+" \u00d7 "+(p?p.name.toLowerCase():"");
  });
  $("herb-foot").innerHTML = fmt(totalHerbs)+" herbs total. Held back = pulled out for the super combat chain before anything else happens.";

  /* bank stock card */
  (function(){
    var b = R.bank, h = R.haveSup, d = R.divine, st = R.stamina, out = "";
    function hint(id, full, used){
      var e = $(id); if(!e) return;
      e.innerHTML = full>0 ? fmt(full)+" full potion"+(full===1?"":"s")+
        (used>0 ? " &middot; "+fmt(used)+" doses used" : "") : "&mdash;";
    }
    hint("bk-att-h", h.att, R.scp.usedBank.att);
    hint("bk-str-h", h.str, R.scp.usedBank.str);
    hint("bk-def-h", h.def, R.scp.usedBank.def);

    var any = b.att||b.str||b.def||b.shard||b.dust||b.amyl||b.energy||b.senergy||b.stam;
    if(!any){
      $("bank-body").innerHTML = '<p class="empty">Nothing entered yet. Anything you list here is used before your herbs are.</p>';
      return;
    }
    out += '<div class="statrow" style="margin-top:16px">';
    out += stat(fmt(R.scp.fromBank), "super combats off bank stock", true, false);
    out += stat(fmt(R.scp.fromHerbs), "still made from herbs");
    if(R.dustTotal>0) out += stat(fmt(d.pots%1?d.pots.toFixed(2):d.pots), "divine super combat (4)", false, true);
    if(st.doses>0) out += stat(fmt(st.doses), "stamina doses you can mix");
    out += '</div>';

    var notes = [];
    if(R.scp.fromBank>0)
      notes.push("Bank supers covered <strong>"+fmt(R.scp.fromBank)+"</strong> super combats, so that many irit, kwuarm and cadantine never get touched.");
    if(R.dustTotal>0){
      notes.push("You hold <strong>"+fmt(R.dustTotal)+"</strong> crystal dust (shards crush 10 each). Divine takes one per dose, so "+
        fmt(d.doses)+" doses go divine and "+fmt(d.dustLeft)+" dust is left over."+
        (R.startLevel<97 ? " <strong>Divine needs 97 Herblore</strong> and you are "+R.startLevel+"." : ""));
    }
    if(st.doses>0)
      notes.push("Amylase on super energy makes <strong>"+fmt(st.doses)+"</strong> stamina doses at 77 Herblore.");
    if(b.energy||b.stam)
      notes.push("Run supplies on hand: "+fmt(b.energy)+" energy and "+fmt(b.stam)+" stamina doses.");
    if(notes.length) out += '<p class="foot">'+notes.join(" ")+'</p>';
    $("bank-body").innerHTML = out;
  })();

  /* super combat card */
  $("scp-card").classList.toggle("hide", !R.scpOn);
  if(R.scpOn){
    if(R.scp.made>0){
      var warn = R.startLevel<90 ? '<p class="warn">Super combats need 90 Herblore. You are '+(90-R.startLevel)+' levels short right now.</p>' : "";
      $("scp-body").innerHTML =
        '<div class="statrow">'+
          stat(fmt(R.scp.made),"super combat (4)",true,false)+
          stat(fmt(R.scp.torstol),"torstol used")+
          stat(fmt(R.scp.irit)+" / "+fmt(R.scp.kwuarm)+" / "+fmt(R.scp.cadantine),"irit / kwuarm / cadantine")+
          stat(fmt(R.scp.xp),"xp from the whole chain",false,true)+
        '</div><p class="foot">A super combat wants 4 doses of each super, so one torstol pulls roughly '+
        fmt(R.herbsPerSuper,2)+' of each herb behind it. '+
        (R.goggles?"Goggles save the torstol 10% of the time, so 0.9 torstol per potion. ":"")+
        'Your bottleneck: <strong>'+R.scp.limiter+'</strong>.</p>'+warn;
    } else {
      $("scp-body").innerHTML = '<p class="empty">Add torstol plus irit, kwuarm and cadantine and the chain fills itself in.</p>';
    }
  }

  /* vials */
  var maxPaste = Math.max(1, R.startPaste.mox, R.startPaste.aga, R.startPaste.lye);
  var vs = $("vials").children;
  ["mox","aga","lye"].forEach(function(k,i){
    var v = R.startPaste[k], refs = vs[i].refs;
    refs.fill.style.height = Math.min(100, (v/maxPaste)*100)+"%";
    refs.val.textContent = fmt(v);
    var fills = Math.ceil(v/3000)||0;
    refs.tiny.textContent = fills+" hopper fill"+(fills===1?"":"s");
    if(maxPaste>3000){ refs.cap.style.display="block"; refs.cap.style.bottom = Math.min(100,(3000/maxPaste)*100)+"%"; }
    else refs.cap.style.display="none";
  });
  var pasteTotal = R.startPaste.mox+R.startPaste.aga+R.startPaste.lye;
  $("paste-foot").innerHTML = pasteTotal>0
    ? fmt(pasteTotal)+" paste in hand. Refining these herbs alone pays <strong>"+fmt(R.refineXp)+" xp</strong> before you mix anything."
    : "";

  /* headline */
  $("s-xp").textContent = "+"+fmt(R.totalXp);
  $("s-level").textContent = R.endLevel>99 ? ("99 (+"+(R.endLevel-99)+")") : R.endLevel;
  $("s-total").textContent = fmt(R.endXp);
  var nextLvl = Math.min(126, R.endLevel+1);
  var spanStart = xpForLevel(R.endLevel), spanEnd = xpForLevel(nextLvl);
  $("s-next").textContent = R.endLevel>=126 ? "-" : fmt(spanEnd-R.endXp);
  $("s-nextlabel").textContent = "xp to "+nextLvl;
  var pct = spanEnd>spanStart ? Math.min(100,((R.endXp-spanStart)/(spanEnd-spanStart))*100) : 100;
  $("bar-fill").style.width = pct+"%";
  $("bar-label").textContent = fmt(pct,1)+"% through level "+R.endLevel;

  var gf = $("goal-foot");
  if(R.goalRemaining>0){
    gf.className = "foot";
    gf.innerHTML = "Level "+R.goal+" is another <strong>"+fmt(R.goalRemaining)+" xp</strong> past where this lands you.";
  } else {
    gf.className = "foot good";
    gf.innerHTML = "This clears level "+R.goal+" with "+fmt(R.endXp-R.goalXp)+" xp to spare.";
  }

  /* columns */
  var mix = "";
  mix += line("Herbs refined", fmt(R.refinedHerbs));
  mix += line("Refining xp (6 each)", fmt(R.refineXp));
  mix += line("Potion bases mixed", fmt(R.mixPotions));
  if(R.cleanupPotions>0) mix += line("of which leftover burns", fmt(R.cleanupPotions), {sub:true});
  mix += line("Mixing xp", fmt(R.mixXp));
  mix += line("Xp per paste", R.pasteSpent>0 ? fmt(R.mixXp/R.pasteSpent,2) : "-", {sub:true});
  if(R.digXp>0) mix += line("Digweed xp", fmt(R.digXp));
  mix += line("Mox resin", fmt(R.resin.mox), {c:"var(--mox)"});
  mix += line("Aga resin", fmt(R.resin.aga), {c:"var(--aga)"});
  mix += line("Lye resin", fmt(R.resin.lye), {c:"var(--lye)"});
  mix += line("Aldarium affordable", fmt(R.aldarium), {strong:true});
  mix += line("Paste left stranded",
    fmt(R.leftover.mox)+" / "+fmt(R.leftover.aga)+" / "+fmt(R.leftover.lye), {sub:true});
  $("mix-lines").innerHTML = mix;

  var pot = "";
  if(R.scp.made>0) pot += line("Super combat (4)", fmt(R.scp.made), {strong:true});
  if(R.scp.fromBank>0) pot += line("&nbsp;&nbsp;of which from bank supers", fmt(R.scp.fromBank));
  if(R.divine.doses>0) pot += line("Divine super combat doses", fmt(R.divine.doses));
  if(R.stamina.doses>0) pot += line("Stamina doses", fmt(R.stamina.doses));
  if(R.potionRows.length===0 && R.scp.made===0) pot += '<p class="empty">Everything is going to paste.</p>';
  R.potionRows.forEach(function(r){ pot += line(r.potion.name, fmt(r.count)); });
  pot += line("Potion xp (incl. supers)", fmt(R.potionXp+R.scp.xp+R.divine.xp+R.stamina.xp), {strong:true});
  pot += line("Vials of water", fmt(R.vials), {sub:true});
  $("potion-lines").innerHTML = pot;

  /* secondaries */
  var keys = Object.keys(R.secondaries).sort(function(x,y){ return R.secondaries[y]-R.secondaries[x]; });
  $("sec-block").classList.toggle("hide", keys.length===0);
  $("secs").innerHTML = keys.map(function(k){
    return '<span class="sec"><strong>'+fmt(Math.ceil(R.secondaries[k]))+'</strong> '+esc(k)+'</span>'; }).join("");
  $("sec-foot").textContent = R.goggles ? "Savable secondaries already have the goggles' 10% shaved off." : "";

  /* milestones */
  var miles = BASES.filter(function(b){ return b.lvl>R.startLevel && b.lvl<=R.endLevel; });
  $("mile-block").classList.toggle("hide", miles.length===0);
  $("miles").innerHTML = miles.map(function(b){
    return '<span class="sec"><strong>'+b.lvl+'</strong> '+esc(b.name)+'</span>'; }).join("");
}

function stat(value,label,big,accent){
  return '<div class="stat'+(big?" big":"")+(accent?" accent":"")+'"><span class="sv">'+value+
    '</span><span class="sl">'+esc(label)+'</span></div>';
}

/* ---------- wiring ---------- */
["xp","yield","goal","speedxp","digweed","scptarget","paste-mox","paste-aga","paste-lye",
 "bk-att","bk-str","bk-def","bk-shard","bk-dust","bk-amyl","bk-energy","bk-senergy","bk-stam"]
  .forEach(function(id){ $(id).addEventListener("input", paint); });
["amulet","strategy"].forEach(function(id){ $(id).addEventListener("change", paint); });
["t-goggles","t-scp","t-triple","t-cleanup"].forEach(function(id){
  $(id).addEventListener("click", function(){
    this.setAttribute("aria-pressed", on(this) ? "false" : "true");
    paint();
  });
});
$("adv-toggle").addEventListener("click", function(){
  var a = $("adv"), hidden = a.classList.toggle("hide");
  this.textContent = hidden ? "Show extras" : "Hide extras";
});
$("b-paste").addEventListener("click", function(){
  rows.forEach(function(r){ r.select.value = "paste"; }); paint();
});
$("b-rec").addEventListener("click", function(){
  rows.forEach(function(r){ r.select.value = RECOMMENDED[r.herb.id]; }); paint();
});
$("b-clear").addEventListener("click", function(){
  rows.forEach(function(r){ r.seeds.value = ""; r.stock.value = ""; }); paint();
});

paint();

}
