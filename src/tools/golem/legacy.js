import D from "../../data/golem.json";

// Original calculator logic, moved from the single-page site. It talks to
// the DOM by id, so it runs once its markup is in the document.
export function mountLegacy() {
"use strict";

/* ---------- OSRS experience table ---------- */
const XP=[0]; // XP[L] = xp needed to reach level L (1..99)
(function(){
  let pts=0;
  for(let l=1;l<99;l++){ pts+=Math.floor(l+300*Math.pow(2,l/7)); XP[l+1]=Math.floor(pts/4); }
})();
const MAXXP=XP[99];
function xpForLevel(l){ l=Math.max(1,Math.min(99,Math.round(l))); return XP[l]; }
function levelFromXp(xp){
  if(xp>=MAXXP) return 99;
  for(let l=98;l>=1;l--){ if(xp>=XP[l]) return l; }
  return 1;
}
function fmt(n){ return Math.round(n).toLocaleString("en-US"); }

/* ---------- fur data (all wiki-confirmed) ---------- */
const FURS = D.FURS;
const SUNSTONES_PER_GOLEM=5;

/* Wyrmscraig goat: cattleprod lure (20) + level-scaled loot (100 @60, +3/lvl to 80, +1/lvl to 99) */
function goatHuntXp(hunterLvl){
  const L=Math.max(60,Math.min(99,Math.round(hunterLvl)));
  const loot=100+3*(Math.min(L,80)-60)+Math.max(0,L-80);
  return 20+loot;
}
function furHuntXp(f,hunterLvl){ return f.isGoat ? goatHuntXp(hunterLvl) : f.huntXP; }

/* ---------- state (XP is the source of truth) ---------- */
const state={ craft:xpForLevel(60), hunt:xpForLevel(60), mine:xpForLevel(50) };
const qty={}; FURS.forEach((f,i)=>qty[i]=0);
function sunstoneXp(){ return document.getElementById("momentum").checked?28:23; }

/* ---------- level / xp synced inputs ---------- */
function bindSkill(key,lvlId,xpId,noteId){
  const lvlEl=document.getElementById(lvlId), xpEl=document.getElementById(xpId), noteEl=document.getElementById(noteId);
  function paintNote(){
    const l=levelFromXp(state[key]);
    if(l>=99){ noteEl.textContent="Level 99 \u2014 maxed"; return; }
    const toNext=XP[l+1]-state[key], to99=MAXXP-state[key];
    noteEl.textContent=fmt(toNext)+" xp to level "+(l+1)+"  \u00b7  "+fmt(to99)+" xp to 99";
  }
  lvlEl.addEventListener("input",()=>{
    let l=parseInt(lvlEl.value,10); if(isNaN(l))return; l=Math.max(1,Math.min(99,l));
    state[key]=xpForLevel(l); xpEl.value=state[key]; paintNote(); renderAll();
  });
  xpEl.addEventListener("input",()=>{
    let x=parseInt(xpEl.value,10); if(isNaN(x))x=0; x=Math.max(0,Math.min(200000000,x));
    state[key]=x; lvlEl.value=levelFromXp(x); paintNote(); renderAll();
  });
  paintNote();
}

/* ---------- skill progress block ---------- */
function skillBlock(label,dotClass,startXp,gainedXp){
  const endXp=Math.min(200000000,startXp+gainedXp);
  const startLv=levelFromXp(startXp), endLv=levelFromXp(endXp);
  let pct, ptxt;
  if(endLv>=99){ pct=100; ptxt="99 (max)"; }
  else{
    const base=XP[endLv], next=XP[endLv+1];
    pct=Math.max(0,Math.min(100,(endXp-base)/(next-base)*100));
    ptxt=fmt(next-endXp)+" to "+(endLv+1);
  }
  const gainedLv=endLv-startLv;
  return '<div class="skillline">'
    +'<div class="nm"><span class="dot '+dotClass+'"></span>'+label+'</div>'
    +'<div class="prog"><span style="width:'+pct.toFixed(1)+'%"></span></div>'
    +'<div class="lv">Lv <b>'+startLv+'</b> &rarr; <b>'+endLv+'</b>'
    +(gainedLv>0?' (+'+gainedLv+')':'')+' &middot; '+ptxt+'</div>'
    +'</div>';
}

/* ---------- MODE 1 : furs -> xp ---------- */
function buildFurRows(){
  const tb=document.getElementById("furRows");
  tb.innerHTML=FURS.map((f,i)=>{
    const hx = f.isGoat ? goatHuntXp(levelFromXp(state.hunt))+" *" : fmt(f.huntXP);
    return '<tr data-i="'+i+'">'
      +'<td><span class="furname">'+f.name+'</span><br>'
        +'<span class="furmeta">'+f.creature+' &middot; '+f.method+' &middot; lvl '+f.huntLvl+'</span></td>'
      +'<td class="num">'+fmt(f.craftXP)+'</td>'
      +'<td class="num">'+hx+'</td>'
      +'<td class="num"><input class="qty" type="number" min="0" step="1" value="'+(qty[i]||0)+'" data-i="'+i+'"></td>'
      +'</tr>';
  }).join("");
  tb.querySelectorAll("input.qty").forEach(inp=>{
    inp.addEventListener("input",()=>{
      const i=+inp.dataset.i; let v=parseInt(inp.value,10); if(isNaN(v)||v<0)v=0; qty[i]=v;
      renderMode1();
    });
  });
}
function renderMode1(){
  const hLv=levelFromXp(state.hunt);
  let golems=0, craftG=0, huntG=0, missing=[];
  FURS.forEach((f,i)=>{
    const n=qty[i]||0; if(!n)return;
    golems+=n; craftG+=n*f.craftXP; huntG+=n*furHuntXp(f,hLv);
    if(f.huntLvl>hLv) missing.push(f);
    const row=document.querySelector('#furRows tr[data-i="'+i+'"]'); if(row)row.classList.remove("dim");
  });
  const sunstones=golems*SUNSTONES_PER_GOLEM;
  const mineG=sunstones*sunstoneXp();

  document.getElementById("m1cards").innerHTML=
     card("Golems / furs",fmt(golems),"")
    +card("Sunstones to mine",fmt(sunstones),"5 per golem")
    +card("Crafting XP","<span class='xpdrop'>+"+fmt(craftG)+"</span>","")
    +card("Hunter XP","<span class='xpdrop'>+"+fmt(huntG)+"</span>","if self-caught")
    +card("Mining XP","<span class='xpdrop'>+"+fmt(mineG)+"</span>",sunstoneXp()+" xp / sunstone")
    +card("Gems rewarded",fmt(golems),"~466 gp avg each");

  document.getElementById("m1skills").innerHTML=
     skillBlock("Crafting","craft",state.craft,craftG)
    +skillBlock("Hunter","hunt",state.hunt,huntG)
    +skillBlock("Mining","mine",state.mine,mineG);

  const w=document.getElementById("m1warn");
  if(missing.length){
    w.innerHTML='<div class="warn"><b>Heads up:</b> at Hunter '+hLv+' you cannot catch: '
      +missing.map(f=>f.creature+" (lvl "+f.huntLvl+")").join(", ")
      +'. Their Hunter XP is only counted if you actually catch them.</div>';
  } else w.innerHTML="";

  // refresh goat hunter-xp display in the table when hunter level changes
  document.querySelectorAll('#furRows tr').forEach(tr=>{
    const i=+tr.dataset.i; if(FURS[i].isGoat){ tr.children[2].textContent=goatHuntXp(hLv)+" *"; }
  });
}
function card(k,v,note){
  return '<div class="rcard"><div class="k">'+k+'</div><div class="v'
    +(v.length>9&&v.indexOf("xpdrop")<0?" small":"")+'">'+v+'</div>'
    +(note?'<div class="note">'+note+'</div>':'')+'</div>';
}

/* ---------- MODE 2 : target -> furs ---------- */
function buildM2Select(){
  const sel=document.getElementById("m2fur");
  sel.innerHTML=FURS.map((f,i)=>'<option value="'+i+'">'+f.name+'  ('+fmt(f.craftXP)+' xp/golem)</option>').join("");
  sel.value="4"; // Dark kebbit fur (ironman-recommended)
  sel.addEventListener("change",renderMode2);
  document.getElementById("m2target").addEventListener("input",renderMode2);
}
function renderMode2(){
  const f=FURS[+document.getElementById("m2fur").value];
  let target=parseInt(document.getElementById("m2target").value,10);
  const cardsEl=document.getElementById("m2cards"), skEl=document.getElementById("m2skills"), msgEl=document.getElementById("m2msg");
  if(isNaN(target)){ cardsEl.innerHTML=""; skEl.innerHTML=""; msgEl.innerHTML=""; return; }
  target=Math.max(2,Math.min(99,target));
  const need=xpForLevel(target)-state.craft;

  if(need<=0){
    cardsEl.innerHTML=""; skEl.innerHTML="";
    msgEl.innerHTML='<div class="done">You are already Crafting level '+levelFromXp(state.craft)
      +', which is at or above level '+target+'. Nothing to do here.</div>';
    return;
  }
  const hLv=levelFromXp(state.hunt);
  const golems=Math.ceil(need/f.craftXP);
  const sunstones=golems*SUNSTONES_PER_GOLEM;
  const craftG=golems*f.craftXP;
  const huntG=golems*furHuntXp(f,hLv);
  const mineG=sunstones*sunstoneXp();
  const hours=craftG/f.xpHr;
  const hoursTxt=hours<1?Math.round(hours*60)+" min":hours.toFixed(1)+" h";

  cardsEl.innerHTML=
     card("Golems / furs needed","<span class='xpdrop'>"+fmt(golems)+"</span>","")
    +card("Sunstones to mine",fmt(sunstones),"5 per golem")
    +card("Crafting XP needed",fmt(need),"to level "+target)
    +card("Hunter XP gained","+"+fmt(huntG),"if self-caught")
    +card("Mining XP gained","+"+fmt(mineG),sunstoneXp()+" xp / sunstone")
    +card("Est. crafting time","~"+hoursTxt,"at "+fmt(f.xpHr)+" xp/hr");

  skEl.innerHTML=
     skillBlock("Crafting","craft",state.craft,craftG)
    +skillBlock("Hunter","hunt",state.hunt,huntG)
    +skillBlock("Mining","mine",state.mine,mineG);

  msgEl.innerHTML = f.huntLvl>hLv
    ? '<div class="warn">To catch <b>'+f.creature+'</b> you need Hunter '+f.huntLvl
      +' (you are '+hLv+'). You can still buy the furs, but then you gain no Hunter XP.</div>'
    : "";
}

/* ---------- MODE 3 : reference ---------- */
let refSort={key:"craftXP",dir:-1};
function renderRef(){
  const hLv=levelFromXp(state.hunt);
  const rows=FURS.map((f,i)=>{
    const hSort=f.isGoat?goatHuntXp(hLv):f.huntXP;
    return Object.assign({},f,{idx:i,huntSort:hSort});
  });
  rows.sort((a,b)=>{
    let av=a[refSort.key], bv=b[refSort.key];
    if(typeof av==="string") return refSort.dir*av.localeCompare(bv);
    return refSort.dir*(av-bv);
  });
  document.getElementById("refRows").innerHTML=rows.map(f=>{
    const can=f.huntLvl<=hLv;
    const hx=f.isGoat?(goatHuntXp(hLv)+' <span class="pill">scales</span>'):fmt(f.huntXP);
    return '<tr class="'+(can?"canhunt":"")+'">'
      +'<td><b>'+f.name.replace(" fur","")+'</b><br><span class="furmeta">'+f.creature+'</span></td>'
      +'<td class="num">'+fmt(f.craftXP)+'</td>'
      +'<td class="num">'+hx+'</td>'
      +'<td class="num">'+f.huntLvl+'</td>'
      +'<td>'+f.method+'</td>'
      +'<td class="num">'+fmt(f.xpHr)+'</td>'
      +'</tr>';
  }).join("");
}
document.querySelectorAll("#refTable th[data-sort]").forEach(th=>{
  th.addEventListener("click",()=>{
    const k=th.dataset.sort;
    if(refSort.key===k) refSort.dir*=-1; else refSort={key:k,dir:(k==="method"?1:-1)};
    document.querySelectorAll("#refTable th .ar").forEach(a=>a.innerHTML="");
    th.querySelector(".ar").innerHTML=refSort.dir<0?"&#9662;":"&#9652;";
    renderRef();
  });
});

/* ---------- tabs ---------- */
document.querySelectorAll(".tab").forEach(tb=>{
  tb.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected","false"));
    tb.setAttribute("aria-selected","true");
    document.querySelectorAll(".tabpanel").forEach(p=>p.classList.remove("on"));
    document.getElementById(tb.dataset.tab).classList.add("on");
  });
});

/* ---------- global render ---------- */
function renderAll(){
  document.getElementById("mineRate").textContent =
    "= "+ (SUNSTONES_PER_GOLEM*sunstoneXp()) +" Mining XP per golem";
  renderMode1(); renderMode2(); renderRef();
}

/* ---------- init ---------- */
bindSkill("craft","craftLvl","craftXp","craftNote");
bindSkill("hunt","huntLvl","huntXp","huntNote");
bindSkill("mine","mineLvl","mineXp","mineNote");
document.getElementById("momentum").addEventListener("change",renderAll);
document.getElementById("clearBtn").addEventListener("click",()=>{
  FURS.forEach((f,i)=>qty[i]=0);
  document.querySelectorAll("input.qty").forEach(inp=>inp.value=0);
  renderMode1();
});
buildFurRows();
buildM2Select();
document.querySelector('#refTable th[data-sort="craftXP"] .ar').innerHTML="&#9662;";
renderAll();

}
