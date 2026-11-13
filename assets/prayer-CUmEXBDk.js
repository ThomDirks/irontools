import{B as m,p as M,f as q,t as C,M as g}from"./calc-BV5D_2EM.js";import{s as H,b as O}from"./form-DerNmqW7.js";import{x as T,e as X,f as F,b as W,o as z,l as R,a as c,d as A}from"./app-DDtPzl0Z.js";import{l as Y,s as L,n as w,c as B,t as x,g as S,e as P,d as h}from"./ui-m6iUulm7.js";const G="Your bones through the Chaos altar, the Ectofuntus or the libation bowl",I=["Libation bowl: <b>30</b> Prayer"],D=[["chaos","Chaos altar"],["ecto","Ectofuntus"],["libation","Libation bowl"]],J=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Prayer</h2>
      ${Y("p",43,T(43))}
    </div>
    <div class="group">
      <h2>Where</h2>
      ${L("method",D,"chaos")}
      <label class="field" data-show="method:libation"><span>Wine</span><select name="wine">
        <option value="sunfire">Blessed sunfire wine (6 xp a shard)</option>
        <option value="blessed">Blessed wine (5 xp a shard)</option>
      </select></label>
      <label class="field"><span>Zealot's robes pieces</span><select name="zealot">
        ${[0,1,2,3,4].map(e=>`<option value="${e}">${e===0?"None":e===4?"Full set (5% save)":e+" ("+e*1.25+"% save)"}</option>`).join("")}
      </select></label>
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${L("mode",[["bank","Use my bones"],["target","Reach a level"]],"bank")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="70" inputmode="numeric"></label>
      <label class="field" data-show="mode:target"><span>Bones</span><select name="bone">
        ${m.map(e=>`<option value="${e.id}"${e.id==="dragon"?" selected":""}>${X(e.name)}</option>`).join("")}
      </select></label>
    </div>
    <div class="group" data-show="mode:bank">
      <h2>Bones in the bank</h2>
      ${F()}
      <div class="qtys">${m.map(e=>`<label class="qty" data-bone="${e.id}"><span>${X(e.name)}<span class="lv">${e.shardsOnly?e.shards+" shards":e.xp}</span></span><input name="b-${e.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;let y=null;function K({method:e}){y==null||y.set("method",e)}function Q(e){const r=e.querySelector(".out"),p=e.querySelector(".setup"),n=H(p,"pLvl","pXp"),f=O(p,"prayer",v);y=f,W(e,s=>{let b=0;for(const a of m){const d=s(a.name);b+=d,f.set("b-"+a.id,d)}return b}),n.setXp(f.values().pXp),z(s=>{s.skills.prayer!==void 0&&n.setXp(s.skills.prayer)});function v(s){var $;p.querySelectorAll("[data-show]").forEach(o=>{const[i,t]=o.dataset.show.split(":");o.hidden=!t.split(",").includes(s[i])});const b=s.pXp,a=R(b),d=s.method,u={zealot:+s.zealot||0,wine:s.wine};p.querySelectorAll(".qty[data-bone]").forEach(o=>{const i=m.find(t=>t.id===o.dataset.bone);o.classList.toggle("locked",!M(i,d,u))});let l="";if(d==="libation"&&a<g.libation.level&&(l+=w(`The libation bowl needs ${g.libation.level} Prayer. You're ${a}.`,"ember")),s.mode==="bank"){const o=Object.fromEntries(m.map(t=>[t.id,Math.max(0,Math.floor(s["b-"+t.id]||0))])),i=q(b,o,d,u);if(!i.rows.length&&!i.skipped.length){r.innerHTML=l+w("Enter the bones in your bank.")+k(a,u,"dragon");return}l+=B({fromXp:b,toXp:i.endXp,skill:"Prayer"}),l+=x(E(d,i,i.rows.reduce((t,j)=>t+j.n,0))),i.skipped.length&&(l+=w(`${i.skipped.map(t=>t.name).join(", ")} can't be used here.`,"ember")),l+=S("Bones",P(["Bones","Amount","XP each","XP"],i.rows.map(t=>({cells:[t.bone.name,c(t.n),c(t.each,1),c(t.xp)]})))),l+=k(a,u,(($=i.rows[i.rows.length-1])==null?void 0:$.bone.id)||"dragon")}else{const o=C(b,{value:s.target},s.bone,d,u);if(o.impossible){r.innerHTML=l+w(`${o.bone.name} can't be used at the ${g[d].name.toLowerCase()}.`,"ember");return}if(!o.bones){r.innerHTML=l+w(`You're already level ${a}.`,"moss");return}l+=B({fromXp:b,toXp:o.endXp,skill:"Prayer"}),l+=x([h(c(o.bones),o.bone.name.toLowerCase(),"gold"),...E(d,o,o.bones).slice(1)]),l+=k(a,u,o.bone.id,s.target,b)}l+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Chaos altar: 3.5× the bone's xp, and a 50% chance the bone isn't used. With zealot's robes, a failed roll gets a second roll for the robes, so a full set saves 52.5% of bones.</li>
      <li>Ectofuntus: 4× the bone's xp, with one bucket of slime per bone. Robes save the bonemeal and slime.</li>
      <li>Libation bowl: bless bones at the exposed altar, chisel them into shards, and offer 5 xp a shard with blessed wine or 6 with blessed sunfire wine. One jug covers 400 shards. Robes save shards but not the wine.</li>
      <li>Source: OSRS Wiki, Chaos Temple, Ectofuntus, Libation bowl, Blessed bone shards and Zealot's robes.</li>
    </ul></details>`,r.innerHTML=l}}function E(e,r,p){const n=[h(c(p),"bones","gold")];return e==="chaos"&&n.push(h(c(r.offerings||p),"offerings on average")),e==="ecto"&&(n.push(h(c(r.slime||p),"buckets of slime")),n.push(h(c(r.tokens),"ecto-tokens")),n.push(h(A((r.offerings||p)/g.ecto.perHour),"at 180 an hour"))),e==="libation"&&(n.push(h(c(r.shards),"blessed bone shards")),n.push(h(c(Math.ceil(r.jugs)),"jugs of wine"))),n}function k(e,r,p,n,f){const v=m.find(a=>a.id===p),s=n?Math.max(0,T(n)-f):0,b=["Where","XP a bone"].concat(s?["Bones to "+n]:[]);return S(`Every method with ${v.name.toLowerCase()}`,P(b,[["chaos","Chaos altar"],["ecto","Ectofuntus"],["libation","Libation bowl (sunfire)"],["libationB","Libation bowl (blessed wine)"]].map(([a,d])=>{const u=M(v,a.startsWith("libation")?"libation":a,{...r,wine:a==="libationB"?"blessed":"sunfire"});return{cells:[d,u?c(u.xp,1):"–"].concat(s?[u?c(Math.ceil(s/u.xp)):"–"]:[])}})))}export{J as html,Q as mount,K as preset,I as reqs,G as subtitle};
