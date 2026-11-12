import{h as x}from"./herbs-DHo3Ndt3.js";import{x as A,l as E,M as L,f as B,e as X,o as D,b as N,a as m,p as I,c as U}from"./app-KCR0G2o4.js";import{s as K,b as Y}from"./form-D-rXcn7D.js";import{l as G,s as _,n as $,c as W,t as z,d as H,g as S,e as O,h as J}from"./ui-c4aSgRfp.js";const u=x.herbs,T=x.patches,F=x.compost,Q=x.kandarinBonus;function V(e,n,s){const l=Math.min(99,Math.max(1,s)),r=Math.trunc(e*(99-l)/98)+Math.trunc(n*(l-1)/98)+1;return Math.min(Math.max(r/256,0),1)}function Z(e,n,s,l=0){const r=(s.secateurs?.1:0)+(s.cape?.05:0),d=s.anima==="attas"?.05:0,f=o=>Math.floor((Math.floor(o*(1+r))+l)*(1+d));return V(f(e.ctsLow),f(e.ctsHigh),n)}function ee(e,n,s,l=0){return(3+F[s.compost].lives)/(1-Z(e,n,s,l))}function j(e,n){if(n)return 0;const s=e.anima==="iasor"?.2:1,l=(Math.floor(Math.floor(27/F[e.compost].reduction)*s)+1)/128;return 1-Math.pow(1-l,3)}function q(e){const n=e.level||1;return T.filter(s=>e.patches.includes(s.id)&&(!s.level||n>=s.level)).map(s=>{let l=!!s.protected,r=0,d=1;return s.id==="hosidius"&&(l=!!e.kourendEasy,r=e.kourendHard?x.kourendHardBonus:0),s.id==="guild"&&(r=e.kourendHard?x.kourendHardBonus:0),s.id==="catherby"&&(r=Q[e.kandarin]||0),s.id==="falador"&&e.faladorMedium&&(d+=x.faladorXpBonus),s.id==="fortis"&&(l=!!e.fortisChampion),{...s,prot:l,diary:r,xpMult:d}})}function R(e,n,s,l){const r=1-j(s,l.prot),d=r*ee(e,n,s,l.diary),f=(e.plantXp+d*e.harvestXp)*l.xpMult*(1+(s.outfit?.025:0));return{herbs:d,xp:f,live:r}}function P(e,n){let s=null;for(const l of u)e>=l.level&&(s=l);return s}function ae(e){var g;let n=Math.min(L,e.startXp);const s=e.mode==="level"?A(e.target):1/0,l=e.mode==="runs"?Math.max(0,Math.round(e.runs)):5e3,r=e.mode==="seeds"?{...e.seeds}:null,d={},f={},o=[];let p=0,c=null,h=0;for(;p<l&&n<s;){const t=E(n),v=q({...e,level:t});if(!v.length)break;v.sort((y,a)=>a.prot-y.prot||a.diary-y.diary||a.xpMult-y.xpMult);let M=0,b=0;for(const y of v){let a;if(r){if(a=[...u].reverse().find(w=>t>=w.level&&r[w.id]>0),!a)break;r[a.id]--}else if(a=e.herb==="auto"?P(t):u.find(w=>w.id===e.herb),!a||t<a.level)break;const i=R(a,t,e,y);d[a.id]=(d[a.id]||0)+i.herbs,f[a.id]=(f[a.id]||0)+1,h+=1-i.live,b+=i.xp,M++,!r&&e.herb==="auto"&&(!c||c.id!==a.id)&&(c&&o.push({run:p+1,level:t,what:a.name}),c=a)}if(!M)break;n=Math.min(L,n+b),p++}const k=E(e.startXp);return{runs:p,startXp:e.startXp,endXp:n,gained:n-e.startXp,herbsOut:d,seedsUsed:f,events:o,deadPatches:h,leftover:r,startHerb:e.herb==="auto"?P(k):u.find(t=>t.id===e.herb),blocked:e.herb!=="auto"&&e.mode!=="seeds"&&((g=u.find(t=>t.id===e.herb))==null?void 0:g.level)>k?u.find(t=>t.id===e.herb):null}}const de="Herbs and xp from your patches, run by run",ce=["<b>9</b> Farming","80 minutes a run"],te={guam:"Guam leaf",marrentill:"Marrentill",tarromin:"Tarromin",harralander:"Harralander",ranarr:"Ranarr weed",toadflax:"Toadflax",irit:"Irit leaf",avantoe:"Avantoe",kwuarm:"Kwuarm",huasca:"Huasca",snapdragon:"Snapdragon",cadantine:"Cadantine",lantadyme:"Lantadyme",dwarfweed:"Dwarf weed",torstol:"Torstol"},se=["falador","phasmatys","catherby","ardougne","hosidius"],ue=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Farming</h2>
      ${G("h",32,A(32))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${_("mode",[["seeds","Plant my seeds"],["level","Reach a level"],["runs","Number of runs"]],"seeds")}
      <label class="field" data-show="mode:level"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field" data-show="mode:runs"><span>Runs</span><input name="runs" type="number" min="1" value="10" inputmode="numeric"></label>
      <label class="field" data-show="mode:level,runs"><span>Herb</span><select name="herb">
        <option value="auto">Best for my level</option>
        ${u.map(e=>`<option value="${e.id}">${e.name} (${e.level})</option>`).join("")}
      </select></label>
      <label class="field"><span>Runs a day</span><input name="perDay" type="number" min="1" max="18" value="4" inputmode="numeric"></label>
    </div>
    <div class="group" data-show="mode:seeds">
      <h2>Seeds in the bank</h2>
      ${B()}
      <div class="qtys">${u.map(e=>`<label class="qty" data-herb="${e.id}"><span>${X(e.name)}<span class="lv">${e.level}</span></span><input name="seed-${e.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Patches</h2>
      <div class="fishpick">${T.map(e=>`<label title="${X(e.note||"")}"><input type="checkbox" name="p-${e.id}"${se.includes(e.id)?" checked":""}><span>${X(e.name)}${e.level?` <i>${e.level}</i>`:""}</span></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Boosts</h2>
      <label class="field"><span>Compost</span><select name="compost">
        ${Object.entries(F).map(([e,n])=>`<option value="${e}"${e==="ultra"?" selected":""}>${n.name}</option>`).join("")}
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
</div>`;function ne(e){return{compost:e.compost,secateurs:!!e.secateurs,cape:!!e.cape,outfit:!!e.outfit,anima:e.anima,kandarin:e.kandarin,kourendEasy:!!e.kourendEasy,kourendHard:!!e.kourendHard,faladorMedium:!!e.faladorMedium,fortisChampion:!!e.fortisChampion,patches:T.filter(n=>e["p-"+n.id]).map(n=>n.id)}}function pe(e){const n=e.querySelector(".out"),s=e.querySelector(".setup"),l=K(s,"hLvl","hXp"),r=Y(s,"herbs",f);l.setXp(r.values().hXp),D(o=>{o.skills.farming!==void 0&&l.setXp(o.skills.farming)});let d=null;N(e,o=>{let p=0;for(const c of u){const h=o(c.seed);p+=h,r.set("seed-"+c.id,h)}return p}),n.addEventListener("click",o=>{if(!o.target.closest("[data-send]")||!d)return;const p=[...document.querySelectorAll("#herb-rows tr")];let c=0;for(const[h,k]of Object.entries(d)){const g=te[h],t=p.find(b=>{var y;return(y=b.querySelector(".herbname"))==null?void 0:y.textContent.startsWith(g)}),v=t==null?void 0:t.querySelectorAll("input")[1];if(!v)continue;const M=Math.floor(k);v.value=(parseInt(v.value,10)||0)+M,v.dispatchEvent(new Event("input",{bubbles:!0})),c+=M}o.target.closest("[data-send]").textContent=`Added ${m(c)} herbs to Mixology`,setTimeout(()=>{location.hash="/mixology"},700)});function f(o){s.querySelectorAll("[data-show]").forEach(a=>{const[i,w]=a.dataset.show.split(":");a.hidden=!w.split(",").includes(o[i])});const p=o.hXp,c=E(p);s.querySelectorAll(".qty[data-herb]").forEach(a=>a.classList.toggle("locked",c<u.find(i=>i.id===a.dataset.herb).level));const h=ne(o),k=Object.fromEntries(u.map(a=>[a.id,Math.max(0,Math.floor(o["seed-"+a.id]||0))])),g=Math.max(1,o.perDay||4);if(c<u[0].level){n.innerHTML=$(`Herbs start at ${u[0].level} Farming. You're ${c}.`,"ember");return}if(!h.patches.length){n.innerHTML=$("Pick the patches you use.");return}if(o.mode==="seeds"&&!Object.values(k).some(Boolean)){n.innerHTML=$("Enter the herb seeds you have. Each run plants your best seeds first, in your best patches.")+C(c,h);return}const t=ae({...h,mode:o.mode,startXp:p,target:o.target,runs:o.runs,herb:o.herb,seeds:k});if(t.blocked){n.innerHTML=$(`${t.blocked.name} needs ${t.blocked.level} Farming. You're ${c}.`,"ember");return}const v=Object.values(t.herbsOut).reduce((a,i)=>a+i,0),M=Object.values(t.seedsUsed).reduce((a,i)=>a+i,0);let b=W({fromXp:p,toXp:t.endXp,skill:"Farming"});b+=z([H(m(v),"herbs expected","gold"),H(m(t.runs),I(t.runs,"run")),H(U(Math.ceil(t.runs/g)),`at ${g} a day`),H(m(t.deadPatches,t.deadPatches<10?1:0),"patches lost to disease",t.deadPatches>=1?"ember":"")]);const y=u.filter(a=>t.seedsUsed[a.id]).reverse().map(a=>({cells:[a.name,m(t.seedsUsed[a.id]),`<b>${m(t.herbsOut[a.id])}</b>`,m(t.herbsOut[a.id]/t.seedsUsed[a.id],2)]}));if(d=t.herbsOut,b+=S("Herbs",O(["Herb","Seeds","Herbs","Per seed"],y)+'<div class="actions"><button type="button" class="btn-gold" data-send>Add these herbs to Mixology</button></div>'),o.mode==="seeds"&&t.leftover&&Object.values(t.leftover).some(Boolean)){const a=u.filter(i=>t.leftover[i.id]>0).map(i=>`${m(t.leftover[i.id])} ${i.name.toLowerCase()}`);b+=$(`Not planted yet: ${a.join(", ")}. Those need a higher level.`)}if(o.herb==="auto"&&o.mode!=="seeds"){const a=[];t.startHerb&&a.push({when:"Run 1",what:t.startHerb.name,sub:`${m(M)} seeds over the whole plan`,tone:"moss"});for(const i of t.events)a.push({when:"Run "+m(i.run),what:"Switch to "+i.what,sub:`Level ${i.level}, day ${m(Math.ceil(i.run/g))}`,tone:"moss"});b+=S("Along the way",J(a))}b+=C(c,h),b+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Each patch starts with 3 harvest lives, plus 1, 2 or 3 for compost, super or ultra. Every herb picked may use a life; the chance it doesn't depends on your level, the herb and your boosts.</li>
      <li>Expected herbs per patch = lives ÷ (1 − chance to save), times the chance the patch survives disease. Protected patches never die.</li>
      <li>Planting xp comes when you pick the last herb, or when you clear a dead patch.</li>
      <li>Source: OSRS Wiki, Farming (variable crop yield), Herb patch, and the wiki's herb farming calculator.</li>
    </ul></details>`,n.innerHTML=b}}function C(e,n){const s=P(e)||u[0],l=q({...n,level:e});return l.length?S(`Your patches with ${s.name.toLowerCase()}`,O(["Patch","Disease risk","Herbs","XP"],l.map(r=>{const d=R(s,e,n,r);return{cells:[r.name+(r.diary?" (diary)":""),r.prot?"None":(j(n,!1)*100).toFixed(1)+"%",m(d.herbs,2),m(d.xp)]}})),""):""}export{ue as html,pe as mount,ce as reqs,de as subtitle};
