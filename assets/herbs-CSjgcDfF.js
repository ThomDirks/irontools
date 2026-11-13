import{H as i,P as E,C as T,s as L,b as P,p as O,a as A,d as X}from"./calc-BxATJqc9.js";import{s as j,b as q}from"./form-DV4vtwhv.js";import{x as R,f as D,e as x,o as B,b as N,l as U,a as o,p as I,c as K}from"./app-B4I534aK.js";import{l as Y,s as G,n as y,c as W,t as _,d as w,g as H,e as F,h as z}from"./ui--3pB3kqk.js";import"./herbs-DHo3Ndt3.js";const le="Herbs and xp from your patches, run by run",ne=["<b>9</b> Farming","80 minutes a run"],J={guam:"Guam leaf",marrentill:"Marrentill",tarromin:"Tarromin",harralander:"Harralander",ranarr:"Ranarr weed",toadflax:"Toadflax",irit:"Irit leaf",avantoe:"Avantoe",kwuarm:"Kwuarm",huasca:"Huasca",snapdragon:"Snapdragon",cadantine:"Cadantine",lantadyme:"Lantadyme",dwarfweed:"Dwarf weed",torstol:"Torstol"},Q=["falador","phasmatys","catherby","ardougne","hosidius"],oe=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Farming</h2>
      ${Y("h",32,R(32))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${G("mode",[["seeds","Plant my seeds"],["level","Reach a level"],["runs","Number of runs"]],"seeds")}
      <label class="field" data-show="mode:level"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field" data-show="mode:runs"><span>Runs</span><input name="runs" type="number" min="1" value="10" inputmode="numeric"></label>
      <label class="field" data-show="mode:level,runs"><span>Herb</span><select name="herb">
        <option value="auto">Best for my level</option>
        ${i.map(e=>`<option value="${e.id}">${e.name} (${e.level})</option>`).join("")}
      </select></label>
      <label class="field"><span>Runs a day</span><input name="perDay" type="number" min="1" max="18" value="4" inputmode="numeric"></label>
    </div>
    <div class="group" data-show="mode:seeds">
      <h2>Seeds in the bank</h2>
      ${D()}
      <div class="qtys">${i.map(e=>`<label class="qty" data-herb="${e.id}"><span>${x(e.name)}<span class="lv">${e.level}</span></span><input name="seed-${e.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Patches</h2>
      <div class="fishpick">${E.map(e=>`<label title="${x(e.note||"")}"><input type="checkbox" name="p-${e.id}"${Q.includes(e.id)?" checked":""}><span>${x(e.name)}${e.level?` <i>${e.level}</i>`:""}</span></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Boosts</h2>
      <label class="field"><span>Compost</span><select name="compost">
        ${Object.entries(T).map(([e,n])=>`<option value="${e}"${e==="ultra"?" selected":""}>${n.name}</option>`).join("")}
      </select></label>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="secateurs" checked><span>Magic secateurs<small>+10% chance to save a life</small></span></label>
        <label class="toggle"><input type="checkbox" name="cape"><span>Farming cape<small>+5%</small></span></label>
        <label class="toggle"><input type="checkbox" name="outfit"><span>Farmer's outfit<small>+2.5% xp</small></span></label>
      </div>
      <label class="field"><span>Anima patch</span><select name="anima">
        <option value="none">Nothing planted</option><option value="attas">Attas (+5% yield)</option><option value="iasor">Iasor (less disease)</option>
      </select></label>
    </div>
    <div class="group">
      <h2>Diaries and unlocks</h2>
      <label class="field"><span>Kandarin diary (Catherby)</span><select name="kandarin">
        <option value="none">Not done</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="elite">Elite</option>
      </select></label>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="kourendEasy"><span>Kourend easy<small>Hosidius disease-free</small></span></label>
        <label class="toggle"><input type="checkbox" name="kourendHard"><span>Kourend hard<small>Hosidius and Farming Guild yield</small></span></label>
        <label class="toggle"><input type="checkbox" name="faladorMedium"><span>Falador medium<small>+10% xp at Falador</small></span></label>
        <label class="toggle"><input type="checkbox" name="fortisChampion"><span>Colosseum Champion<small>Civitas illa Fortis disease-free</small></span></label>
      </div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;function V(e){return{compost:e.compost,secateurs:!!e.secateurs,cape:!!e.cape,outfit:!!e.outfit,anima:e.anima,kandarin:e.kandarin,kourendEasy:!!e.kourendEasy,kourendHard:!!e.kourendHard,faladorMedium:!!e.faladorMedium,fortisChampion:!!e.fortisChampion,patches:E.filter(n=>e["p-"+n.id]).map(n=>n.id)}}function re(e){const n=e.querySelector(".out"),p=e.querySelector(".setup"),f=j(p,"hLvl","hXp"),m=q(p,"herbs",S);f.setXp(m.values().hXp),B(t=>{t.skills.farming!==void 0&&f.setXp(t.skills.farming)});let h=null;N(e,t=>{let u=0;for(const r of i){const d=t(r.seed);u+=d,m.set("seed-"+r.id,d)}return u}),n.addEventListener("click",t=>{if(!t.target.closest("[data-send]")||!h)return;const u=[...document.querySelectorAll("#herb-rows tr")];let r=0;for(const[d,g]of Object.entries(h)){const v=J[d],a=u.find(c=>{var $;return($=c.querySelector(".herbname"))==null?void 0:$.textContent.startsWith(v)}),b=a==null?void 0:a.querySelectorAll("input")[1];if(!b)continue;const k=Math.floor(g);b.value=(parseInt(b.value,10)||0)+k,b.dispatchEvent(new Event("input",{bubbles:!0})),r+=k}t.target.closest("[data-send]").textContent=`Added ${o(r)} herbs to Mixology`,setTimeout(()=>{location.hash="/mixology"},700)});function S(t){p.querySelectorAll("[data-show]").forEach(s=>{const[l,C]=s.dataset.show.split(":");s.hidden=!C.split(",").includes(t[l])});const u=t.hXp,r=U(u);p.querySelectorAll(".qty[data-herb]").forEach(s=>s.classList.toggle("locked",r<i.find(l=>l.id===s.dataset.herb).level));const d=V(t),g=Object.fromEntries(i.map(s=>[s.id,Math.max(0,Math.floor(t["seed-"+s.id]||0))])),v=Math.max(1,t.perDay||4);if(r<i[0].level){n.innerHTML=y(`Herbs start at ${i[0].level} Farming. You're ${r}.`,"ember");return}if(!d.patches.length){n.innerHTML=y("Pick the patches you use.");return}if(t.mode==="seeds"&&!Object.values(g).some(Boolean)){n.innerHTML=y("Enter the herb seeds you have. Each run plants your best seeds first, in your best patches.")+M(r,d);return}const a=L({...d,mode:t.mode,startXp:u,target:t.target,runs:t.runs,herb:t.herb,seeds:g});if(a.blocked){n.innerHTML=y(`${a.blocked.name} needs ${a.blocked.level} Farming. You're ${r}.`,"ember");return}const b=Object.values(a.herbsOut).reduce((s,l)=>s+l,0),k=Object.values(a.seedsUsed).reduce((s,l)=>s+l,0);let c=W({fromXp:u,toXp:a.endXp,skill:"Farming"});c+=_([w(o(b),"herbs expected","gold"),w(o(a.runs),I(a.runs,"run")),w(K(Math.ceil(a.runs/v)),`at ${v} a day`),w(o(a.deadPatches,a.deadPatches<10?1:0),"patches lost to disease",a.deadPatches>=1?"ember":"")]);const $=i.filter(s=>a.seedsUsed[s.id]).reverse().map(s=>({cells:[s.name,o(a.seedsUsed[s.id]),`<b>${o(a.herbsOut[s.id])}</b>`,o(a.herbsOut[s.id]/a.seedsUsed[s.id],2)]}));if(h=a.herbsOut,c+=H("Herbs",F(["Herb","Seeds","Herbs","Per seed"],$)+'<div class="actions"><button type="button" class="btn-gold" data-send>Add these herbs to Mixology</button></div>'),t.mode==="seeds"&&a.leftover&&Object.values(a.leftover).some(Boolean)){const s=i.filter(l=>a.leftover[l.id]>0).map(l=>`${o(a.leftover[l.id])} ${l.name.toLowerCase()}`);c+=y(`Not planted yet: ${s.join(", ")}. Those need a higher level.`)}if(t.herb==="auto"&&t.mode!=="seeds"){const s=[];a.startHerb&&s.push({when:"Run 1",what:a.startHerb.name,sub:`${o(k)} seeds over the whole plan`,tone:"moss"});for(const l of a.events)s.push({when:"Run "+o(l.run),what:"Switch to "+l.what,sub:`Level ${l.level}, day ${o(Math.ceil(l.run/v))}`,tone:"moss"});c+=H("Along the way",z(s))}c+=M(r,d),c+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Each patch starts with 3 harvest lives, plus 1, 2 or 3 for compost, super or ultra. Every herb picked may use a life; the chance it doesn't depends on your level, the herb and your boosts.</li>
      <li>Expected herbs per patch = lives ÷ (1 − chance to save), times the chance the patch survives disease. Protected patches never die.</li>
      <li>Planting xp comes when you pick the last herb, or when you clear a dead patch.</li>
      <li>Source: OSRS Wiki, Farming (variable crop yield), Herb patch, and the wiki's herb farming calculator.</li>
    </ul></details>`,n.innerHTML=c}}function M(e,n){const p=P(e)||i[0],f=O({...n,level:e});return f.length?H(`Your patches with ${p.name.toLowerCase()}`,F(["Patch","Disease risk","Herbs","XP"],f.map(m=>{const h=A(p,e,n,m);return{cells:[m.name+(m.diary?" (diary)":""),m.prot?"None":(X(n,!1)*100).toFixed(1)+"%",o(h.herbs,2),o(h.xp)]}})),""):""}export{oe as html,re as mount,ne as reqs,le as subtitle};
