import{B,O as F,a as v,s as D,f as X,p as I,m as K,b as R,c as q}from"./calc-D_lfZX4q.js";import{s as W,b as Y}from"./form-DV4vtwhv.js";import{x as C,e as E,f as _,b as G,o as U,l as x,a as n,d as S,s as $}from"./app-B4I534aK.js";import{l as z,s as M,n as b,c as P,t as A,d as h,g as w,e as y}from"./ui--3pB3kqk.js";const ae="Your ore into bars and levels, with coal, coffer and time",se=["Keldagrim","<b>72k</b> coffer an hour"],J=["iron","steel","gold","mithril","adamant","rune"],te=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Smithing</h2>
      ${z("s",30,C(30))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${M("mode",[["bank","Smelt my ore"],["target","Reach a level"]],"bank")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field" data-show="mode:target"><span>Bars</span><select name="bar">
        <option value="auto">Best of the ones I pick</option>
        ${B.map(t=>`<option value="${t.id}">${t.name} only (${t.level})</option>`).join("")}
      </select></label>
      <div data-show="mode:target"><div class="fishpick" data-show-bar>${B.map(t=>`<label><input type="checkbox" name="use-${t.id}"${J.includes(t.id)?" checked":""}><span>${E(t.name.replace(" bar",""))} <i>${t.level}</i></span></label>`).join("")}</div></div>
    </div>
    <div class="group" data-show="mode:bank">
      <h2>Ore in the bank</h2>
      ${_()}
      <div class="qtys">${F.map(t=>`<label class="qty"><span>${E(v[t].name)}</span><input name="ore-${t}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
    <div class="group">
      <h2>Kit</h2>
      <div class="toggles">
        <label class="toggle"><input type="checkbox" name="coalBag" checked><span>Coal bag<small>Faster steel, mithril, adamant and rune</small></span></label>
        <label class="toggle"><input type="checkbox" name="gauntlets"><span>Goldsmith gauntlets<small>56.2 xp a gold bar</small></span></label>
      </div>
      <label class="field"><span>Pace</span></label>
      ${M("pace",[["low","Relaxed"],["mid","Typical"],["high","Fast"]],"mid")}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;function le(t){const m=t.querySelector(".out"),r=t.querySelector(".setup"),O=W(r,"sLvl","sXp"),j=Y(r,"blastfurnace",N);O.setXp(j.values().sXp),G(t,s=>{let d=0;for(const i of F){const p=s(v[i].name);d+=p,j.set("ore-"+i,p)}return d}),U(s=>{s.skills.smithing!==void 0&&O.setXp(s.skills.smithing)});function N(s){r.querySelectorAll("[data-show]").forEach(o=>{const[c,e]=o.dataset.show.split(":");o.hidden=!e.split(",").includes(s[c])}),r.querySelector("[data-show-bar]").hidden=s.bar!=="auto";const d=s.sXp,i=x(d),p={coalBag:!!s.coalBag,gauntlets:!!s.gauntlets,pace:s.pace};let l="",u=[],f=0,k=d,L=null;if(s.mode==="bank"){L=Object.fromEntries(F.map(e=>[e,Math.max(0,Math.floor(s["ore-"+e]||0))]));const o=D(d,L,p);if(!o.rows.length){m.innerHTML=b(Object.values(L).some(Boolean)?"Nothing you can smelt yet with that ore. Check the level column below.":"Enter the ore and coal in your bank. The best bar goes first, so iron ore with coal becomes steel.")+T(i,p);return}u=o.rows,f=o.hours,k=o.endXp,l+=P({fromXp:d,toXp:k,skill:"Smithing"}),l+=A([h(n(u.reduce((e,a)=>e+a.n,0)),"bars","gold"),h(S(f),"at the furnace"),h($(X(f,i).coffer),"gp in the coffer"),h(n(u.reduce((e,a)=>e+a.coal,0)),"coal used")]),l+=w("Bars",y(["Bar","Bars","Levels","XP"],u.map(e=>({cells:[e.bar.name,n(e.n),e.fromLv===e.toLv?String(e.toLv):`${e.fromLv} → ${e.toLv}`,n(e.xp)]})))),o.locked.length&&(l+=b(`Waiting on a level: ${o.locked.map(e=>`${n(e.n)} ${e.bar.name.toLowerCase()}s (${e.bar.level})`).join(", ")}.`,"ember"));const c=Object.entries(o.leftover).filter(([,e])=>e>0).map(([e,a])=>`${n(a)} ${v[e].name.toLowerCase()}`);c.length&&(l+=`<p class="fine">Left over: ${c.join(", ")}.</p>`)}else{const o=B.filter(a=>s["use-"+a.id]).map(a=>a.id);if(s.bar==="auto"&&!o.length){m.innerHTML=b("Pick the bars you can supply ore for.");return}if(C(s.target)<=d){m.innerHTML=b(`You're already level ${i}.`,"moss");return}const c=I(d,s.target,{...p,bar:s.bar,allowed:o});if(!c.segs.length){m.innerHTML=b(`None of those bars can be smelted at level ${i}.`,"ember")+T(i,p);return}u=c.segs,f=c.segs.reduce((a,g)=>a+g.hours,0),k=c.endXp;const e=K(u);l+=P({fromXp:d,toXp:k,skill:"Smithing"}),l+=A([h(n(u.reduce((a,g)=>a+g.n,0)),"bars","gold"),h(S(f),"at the furnace"),h($(X(f,i).coffer),"gp in the coffer"),h(n(e.coal||0),"coal")]),c.blocked&&(l+=b(`Stops at ${c.blocked}: no picked bar is unlocked there.`,"ember")),l+=w("The plan",y(["Bar","Levels","Bars","Time"],u.map(a=>({cells:[a.bar.name,`${a.fromLv} → ${a.toLv}`,`<b>${n(a.n)}</b>`,S(a.hours)]})))),l+=w("Ore to bring",y(["Ore","Amount","From Ordan"],Object.entries(e).map(([a,g])=>({cells:[v[a].name,n(g),v[a].ordan?$(g*v[a].ordan)+" gp":"Not sold"]}))),"")+`<p class="fine">Ordan at the Blast Furnace stocks 100 of each and restocks every 2 minutes. He doesn't sell adamantite, runite, lead or nickel.</p>`}const H=X(f,i);H.foreman&&(l+=b(`Below 60 Smithing the foreman charges 2,500 gp per 10 minutes: about ${$(H.foreman)} gp here.`)),l+=T(i,p),l+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Coal is halved at the Blast Furnace: steel 1, mithril 2, adamantite 3, runite 4 per bar.</li>
      <li>Bars an hour are the wiki's ranges per bar, with and without the coal bag: Relaxed is the low end, Fast the high end.</li>
      <li>The coffer pays the dwarves 72,000 gp an hour while you're there.</li>
      <li>Hybrid methods (gold alongside mithril, adamant or rune) aren't modelled. Source: OSRS Wiki, Blast Furnace.</li>
    </ul></details>`,m.innerHTML=l}}function T(t,m){return w("Every bar here",y(["Bar","Level","XP","Bars an hour","XP an hour"],B.map(r=>({cls:t<r.level?"off":"",cells:[r.name,r.level,n(R(r,m),1),n(q(r,m)),n(R(r,m)*q(r,m))]}))))}export{te as html,le as mount,se as reqs,ae as subtitle};
