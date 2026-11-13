import{x as M,M as k,l as X,o as T,a as m,d as R}from"./app-DDtPzl0Z.js";import{s as q,b as F}from"./form-DerNmqW7.js";import{l as K,s as D,n as w,c as N,d as y,t as E,g as B,e as S}from"./ui-m6iUulm7.js";const C=4,U=2.5,W=[{id:"blood",name:"Blood rune",level:77,xp:23.8,xpHr:36e3,craftingHr:5755,miningHr:4211,xpHrEssence:34500,craftingHrEssence:5515,miningHrEssence:4036},{id:"soul",name:"Soul rune",level:90,xp:29.7,xpHr:44e3,craftingHr:5666,miningHr:4146}],Y={pieces:[0,.1,.2,.3,.6]},j=.1,G=[{id:"none",name:"No lantern",bonus:0},{id:"willow",name:"Willow logs",bonus:.05,fm:30},{id:"blisterwood",name:"Blisterwood logs",bonus:.2,bloodOnly:!0,fm:62},{id:"magic",name:"Magic logs",bonus:.1,fm:75},{id:"redwood",name:"Redwood logs",bonus:.05,fm:90}],Q={chance:.5,charges:1e3},_={mining:38,crafting:38},c={fragmentsPerBlock:C,blockXp:U,runes:W,outfit:Y,eliteDiaryBlood:j,lantern:G,bloodEssence:Q,reqs:_},H=c.runes,P=c.lantern,A=c.reqs,f=H.find(e=>e.id==="blood"),g=H.find(e=>e.id==="soul"),z=e=>e.xp+c.blockXp/c.fragmentsPerBlock;function L(e,s){return s==="soul"?e>=g.level?g:null:s==="blood"?e>=f.level?f:null:e>=g.level?g:e>=f.level?f:null}function O(e,s){let l=1+(c.outfit.pieces[Math.max(0,Math.min(4,s.outfit|0))]||0);const t=P.find(a=>a.id===s.lantern);return t&&(!t.bloodOnly||e.id==="blood")&&(l+=t.bonus),e.id==="blood"&&(s.elite&&(l+=c.eliteDiaryBlood),s.essence&&(l+=c.bloodEssence.chance)),l}function $(e,s){const l=e.id==="blood"&&s.essence,t=l?e.xpHrEssence:e.xpHr,a=t/z(e);return{xp:t,fragments:a,blocks:a/c.fragmentsPerBlock,runes:a*O(e,s),crafting:l?e.craftingHrEssence:e.craftingHr,mining:l?e.miningHrEssence:e.miningHr}}function I(e){if(e.goal.type==="runes")return J(e);let s=Math.min(k,e.startXp),l=0;const t=e.goal.type==="level"?M(Math.min(99,e.goal.value)):Math.min(k,e.goal.value),a=new Map;let d=null,o=0,b=0,p=0;for(let h=0;h<200&&s<t;h++){const v=X(s),r=L(v,e.choice);if(!r){d=e.choice==="soul"?g:f;break}const i=$(r,e),x=r===f&&e.choice==="auto"?Math.min(t,M(g.level)):t,n=(x-s)/i.xp,u=a.get(r.id)||{rune:r,hours:0,fragments:0,runes:0,xp:0,fromLv:v};u.hours+=n,u.fragments+=n*i.fragments,u.runes+=n*i.runes,u.xp+=x-s,r.id==="blood"&&e.essence&&(p+=n*i.fragments*c.bloodEssence.chance/c.bloodEssence.charges),o+=n*i.crafting,b+=n*i.mining,l+=n,s=x,u.toLv=X(s),a.set(r.id,u)}return{startXp:e.startXp,endXp:s,hours:l,rows:[...a.values()],blocked:d,crafting:o,mining:b,essences:p}}function J(e){const s=X(e.startXp),l=L(s,e.choice);if(!l)return{startXp:e.startXp,endXp:e.startXp,hours:0,rows:[],blocked:e.choice==="soul"?g:f,crafting:0,mining:0,essences:0};const t=$(l,e),a=Math.max(0,e.goal.value)/t.runes,d=Math.min(k,e.startXp+a*t.xp),o=l.id==="blood"&&e.essence?a*t.fragments*c.bloodEssence.chance/c.bloodEssence.charges:0;return{startXp:e.startXp,endXp:d,hours:a,blocked:null,crafting:a*t.crafting,mining:a*t.mining,essences:o,rows:[{rune:l,hours:a,fragments:a*t.fragments,runes:a*t.runes,xp:d-e.startXp,fromLv:s,toLv:X(d)}]}}const ne="Dense essence into blood and soul runes north of Arceuus",se=["<b>77</b> Runecraft",`<b>${A.mining}</b> Mining`,`<b>${A.crafting}</b> Crafting`],oe=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Runecraft</h2>
      ${K("r",77,M(77))}
    </div>
    <div class="group">
      <h2>Goal</h2>
      ${D("goal",[["level","Level"],["xp","XP"],["runes","Runes"]],"level")}
      <label class="field"><span data-goal-label>Target level</span><input name="target" type="number" min="1" value="90" inputmode="numeric"></label>
    </div>
    <div class="group">
      <h2>Runes</h2>
      <label class="field"><select name="choice">
        <option value="auto">Blood, then soul at 90</option>
        <option value="blood">Blood only</option>
        <option value="soul">Soul only</option>
      </select></label>
    </div>
    <div class="group">
      <h2>Extra runes</h2>
      <label class="field"><span>Raiments of the Eye</span><select name="outfit">
        <option value="0">None</option><option value="1">1 piece (+10%)</option><option value="2">2 pieces (+20%)</option>
        <option value="3">3 pieces (+30%)</option><option value="4" selected>Full set (+60%)</option>
      </select></label>
      <label class="field"><span>Abyssal lantern</span><select name="lantern">
        ${P.map(e=>`<option value="${e.id}">${e.name}${e.bonus?` (+${Math.round(e.bonus*100)}%${e.bloodOnly?" blood":""})`:""}</option>`).join("")}
      </select></label>
      <label class="toggle"><input type="checkbox" name="elite"><span>Elite Kourend &amp; Kebos diary<small>+10% blood runes</small></span></label>
      <label class="toggle"><input type="checkbox" name="essence"><span>Blood essence<small>+50% blood runes, a bit slower</small></span></label>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;function te(e){const s=e.querySelector(".out"),l=e.querySelector(".setup"),t=q(l,"rLvl","rXp"),a=F(l,"arceuus",d);t.setXp(a.values().rXp),T(o=>{o.skills.runecrafting!==void 0&&t.setXp(o.skills.runecrafting)});function d(o){l.querySelector("[data-goal-label]").textContent=o.goal==="xp"?"Target experience":o.goal==="runes"?"Runes to make":"Target level";const b=o.rXp,p=X(b),h={choice:o.choice,outfit:+o.outfit,lantern:o.lantern,elite:!!o.elite,essence:!!o.essence},v=L(p,o.choice);if(!v){const n=o.choice==="soul"?90:77;s.innerHTML=w(`${o.choice==="soul"?"Soul":"Blood"} runes need ${n} Runecraft. You're ${p}.`,"ember");return}if(o.goal==="level"&&o.target<=p){s.innerHTML=w(`You're already ${p}. Pick a higher level, or a number of runes.`);return}if(o.goal==="runes"&&!(o.target>0)){s.innerHTML=w("How many runes do you want to make?");return}const r=I({...h,startXp:b,goal:{type:o.goal,value:o.target}});let i=N({fromXp:b,toXp:r.endXp,skill:"Runecraft"});const x=r.rows.map(n=>y(m(Math.round(n.runes)),n.rune.name.toLowerCase()+"s","gold"));i+=E([...x,y(R(r.hours),"running to the altar"),y(m(Math.ceil(r.rows.reduce((n,u)=>n+u.fragments,0)/4)),"dense essence blocks")]),r.essences>0&&(i+=w(`Uses about ${m(Math.ceil(r.essences))} blood essence${Math.ceil(r.essences)===1?"":"s"}.`)),r.rows.length>1&&(i+=B("By rune",S(["Rune","Levels","Hours","Runes"],r.rows.map(n=>({cells:[n.rune.name,`${n.fromLv} to ${n.toLv}`,R(n.hours),m(Math.round(n.runes))]}))))),i+=B("An hour",S(["Rune","Level","XP","Runes","Per fragment"],H.map(n=>{const u=$(n,h);return{cls:p<n.level?"off":v.id===n.id?"on":"",cells:[n.name,n.level,m(u.xp),m(Math.round(u.runes)),"×"+O(n,h).toFixed(2).replace(/0$/,"")]}}))),i+=E([y(m(Math.round(r.crafting)),"Crafting xp"),y(m(Math.round(r.mining)),"Mining xp")]),i+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Xp an hour is the wiki's: 36,000 for blood (34,500 with blood essence), 44,000 for soul, with the medium Kourend &amp; Kebos diary.</li>
      <li>A fragment gives 23.8 xp as a blood rune or 29.7 as a soul rune, plus 2.5 xp per block at the Dark Altar. One fragment makes one rune before bonuses.</li>
      <li>Bonuses add up on the base rune: outfit, lantern, elite diary, blood essence. Blisterwood only helps blood runes.</li>
      <li>One blood essence lasts 1,000 extra runes.</li>
      <li>Source: OSRS Wiki, Pay-to-play Runecraft training, Blood Altar (Kourend), Soul Altar (Kourend), Abyssal lantern.</li>
    </ul></details>`,s.innerHTML=i}}export{oe as html,te as mount,se as reqs,ne as subtitle};
