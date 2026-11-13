import{F as m,c as E,t as H,p as M,s as S,a as R}from"./calc-DK65mysr.js";import{s as A,b as x}from"./form-DV4vtwhv.js";import{x as P,e as q,f as j,b as O,o as W,l as I,a}from"./app-B4I534aK.js";import{l as K,s as N,n as $,c as C,t as B,d as v,g as X,e as T}from"./ui--3pB3kqk.js";const J="Raw fish into levels, with burns taken off at every level",Q=["Burn rates from the OSRS Wiki"],D=[["fire","Fire"],["range","Range"],["lumbridge","Lumbridge Castle range"],["hos5","Hosidius kitchen (+5%)"],["hos10","Hosidius kitchen, elite diary (+10%)"]],G=["karambwan","lobster","swordfish","monkfish","shark","anglerfish"],V=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Cooking</h2>
      ${K("k",30,P(30))}
    </div>
    <div class="group">
      <h2>Where</h2>
      <label class="field"><select name="spot">${D.map(([s,u])=>`<option value="${s}"${s==="hos5"?" selected":""}>${u}</option>`).join("")}</select></label>
      <label class="toggle"><input type="checkbox" name="gauntlets"><span>Cooking gauntlets<small>Lobster, swordfish, monkfish, shark, anglerfish</small></span></label>
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${N("mode",[["bank","Cook my bank"],["target","Reach a level"]],"bank")}
    </div>
    <div class="group" data-show="mode:target">
      <label class="field"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <div class="field"><span>Fish you'll cook</span></div>
      <div class="fishpick">${m.map(s=>`<label><input type="checkbox" name="use-${s.id}"${G.includes(s.id)?" checked":""}><span>${q(s.name)} <i>${s.level}</i></span></label>`).join("")}</div>
      <div class="linkbtns"><button type="button" class="linkbtn" data-pick="all">All</button><button type="button" class="linkbtn" data-pick="none">None</button></div>
    </div>
    <div class="group" data-show="mode:bank">
      ${j()}
      <div class="qty bank-head"><span></span><span>Raw in bank</span></div>
      <div class="qtys">${m.map(s=>`<label class="qty" data-fish="${s.id}"><span>${q(s.name)}<span class="lv">${s.level}</span></span><input name="raw-${s.id}" type="number" min="0" value="0" inputmode="numeric"></label>`).join("")}</div>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`,F=s=>(s*100).toFixed(s>=.995&&s<1?1:0)+"%";function Z(s){const u=s.querySelector(".out"),p=s.querySelector(".setup"),g=A(p,"kLvl","kXp"),y=x(p,"cooking",l);g.setXp(y.values().kXp),O(s,t=>{let n=0;for(const k of m){const h=t(k.raw);n+=h,y.set("raw-"+k.id,h)}return n}),W(t=>{t.skills.cooking!==void 0&&g.setXp(t.skills.cooking)}),p.querySelectorAll("[data-pick]").forEach(t=>t.addEventListener("click",()=>{p.querySelectorAll(".fishpick input").forEach(n=>{n.checked=t.dataset.pick==="all"}),y.refresh()}));function l(t){p.querySelectorAll("[data-show]").forEach(c=>{const[i,o]=c.dataset.show.split(":");c.hidden=!o.split(",").includes(t[i])});const n=t.kXp,k=I(n),h=t.spot,b=!!t.gauntlets;p.querySelectorAll(".qty[data-fish]").forEach(c=>{c.classList.toggle("locked",k<m.find(i=>i.id===c.dataset.fish).level)});let r="";if(t.mode==="bank"){const c=Object.fromEntries(m.map(e=>[e.id,Math.max(0,Math.floor(t["raw-"+e.id]||0))])),i=E(n,c,h,b);if(!i.rows.length){u.innerHTML=$("Enter the raw fish in your bank. They're cooked lowest level first, so the ones that burn most get cooked once you're higher.")+L(k,h,b,null);return}const o=i.rows.reduce((e,d)=>e+d.cooked,0),f=i.rows.reduce((e,d)=>e+d.burnt,0),w=i.rows.filter(e=>e.locked);r+=C({fromXp:n,toXp:i.endXp,skill:"Cooking"}),r+=B([v(a(o),"cooked","gold"),v(a(f),"expected burns",f>=1?"ember":""),v(a(o+f),"raw fish"),v(a(o+f?f/(o+f)*100:0,1)+"%","burnt overall")]),w.length&&(r+=$(`Still locked at the end: ${w.map(e=>`${a(e.locked)} ${e.fish.name.toLowerCase()} (${e.fish.level})`).join(", ")}.`,"ember")),r+=X("In cooking order",T(["Fish","Raw","Cooked","Burnt","Levels","XP"],i.rows.map(e=>({cls:e.locked?"off":"",cells:[e.fish.name,a(e.raw),a(e.cooked),a(e.burnt),e.fromLv===e.toLv?String(e.toLv):`${e.fromLv} → ${e.toLv}`,a(e.gained)]})))),r+=L(k,h,b,i.rows.map(e=>e.fish.id))}else{const c=m.filter(e=>t["use-"+e.id]).map(e=>e.id);if(!c.length){u.innerHTML=$("Pick the fish you'll cook and the plan uses the best of them at every level.");return}const i=H({value:t.target});if(i<=n){u.innerHTML=$(`You're already level ${k}.`,"moss");return}const o=M(n,i,c,h,b),f=o.segs.reduce((e,d)=>e+d.raw,0),w=o.segs.reduce((e,d)=>e+d.burnt,0);if(r+=C({fromXp:n,toXp:o.endXp,skill:"Cooking"}),r+=B([v(a(f),"raw fish","gold"),v(a(w),"expected burns",w>=1?"ember":""),v(a(f-w),"cooked"),v(String(o.segs.length),o.segs.length===1?"kind of fish":"kinds of fish")]),o.blocked){const e=Math.min(...m.filter(d=>c.includes(d.id)).map(d=>d.level));r+=$(`None of your fish can be cooked at level ${o.blocked}. The lowest you picked needs ${e}.`,"ember")}r+=X("The plan",T(["Fish","Levels","Raw","Burnt","Success"],o.segs.map(e=>({cells:[e.fish.name,`${e.fromLv} → ${e.toLv}`,`<b>${a(e.raw)}</b>`,a(e.burnt),`${F(S(e.fish,e.fromLv,h,b))} → ${F(S(e.fish,Math.max(e.fromLv,e.toLv-1),h,b))}`]})),{foot:"Each level uses whichever of your fish gives the most xp per raw fish, burns included."})),r+=L(k,h,b,c)}r+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Success chance at each level uses the wiki's low and high values for that fish and cooking spot, with its formula: (1 + floor(low×(99−L)/98 + high×(L−1)/98 + 0.5)) / 256.</li>
      <li>Burnt fish give no xp. The chance is recalculated every level, so later fish burn less than the first ones.</li>
      <li>Gauntlets only change lobster, swordfish, monkfish, shark and anglerfish. At Hosidius they stack for those that have a wiki value for it; swordfish gets no extra.</li>
      <li>Karambwan needs Tai Bwo Wannai Trio to cook. Source: OSRS Wiki cooked food pages.</li>
    </ul></details>`,u.innerHTML=r}}function L(s,u,p,g){const y=g&&g.length?m.filter(l=>g.includes(l.id)):m.filter(l=>l.level<=Math.max(s,1)+15);return X("Burn rates here",T(["Fish","Level","XP","Success now","Stops burning"],y.map(l=>{const t=S(l,s,u,p),n=R(l,u,p);return{cls:s<l.level?"off":"",cells:[l.name,l.level,a(l.xp,l.xp%1?1:0),s<l.level?"locked":F(t),n?String(n):"never"]}})))}export{V as html,Z as mount,Q as reqs,J as subtitle};
