import{T as X,P as n,a as b,R,s as U,b as _,k as z,M as v,c as G,d as J}from"./calc-DQ73to7b.js";import{s as Q,b as V}from"./form-DV4vtwhv.js";import{x as Z,f as aa,b as ea,o as sa,l as q,a as e,s as I,p as M,d as P}from"./app-B4I534aK.js";import{l as ta,s as S,r as oa,b as na,a as la,n as T,c as ra,t as O,d as k,e as x,f,g as w,h as ia}from"./ui--3pB3kqk.js";const ua="Contracts to your goal, from planks or logs, with Miscellania timing",ka=["Player-owned house","<b>5</b> points an Expert contract"],ca=l=>`<div class="qty bank-row">
  <span>${n[l].name.replace(" plank","")}</span>
  <input name="pl-${l}" type="number" min="0" value="0" inputmode="numeric" aria-label="${n[l].name}s in the bank">
  <input name="lg-${l}" type="number" min="0" value="0" inputmode="numeric" aria-label="${n[l].log} in the bank">
</div>`,ga=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Construction</h2>
      ${ta("c",50,Z(50))}
    </div>
    <div class="group">
      <h2>Plan</h2>
      ${S("mode",[["target","Reach a level"],["bank","Use my bank"]],"target")}
      <label class="field" data-show="mode:target"><span>Target level</span><input name="target" type="number" min="2" max="99" value="99" inputmode="numeric"></label>
      <label class="field"><span>Contracts</span><select name="tier">
        <option value="auto">Best I can do</option>
        ${X.map(l=>`<option value="${l.id}">${l.name} only (${l.level}, ${n[l.plank].name.toLowerCase()}s)</option>`).join("")}
      </select></label>
    </div>
    <div class="group">
      <h2>In the bank</h2>
      ${aa()}
      <div class="qty bank-head"><span></span><span>Planks</span><span>Logs</span></div>
      ${b.map(ca).join("")}
      <label class="field"><span>Turn logs into planks with</span></label>
      ${S("method",[["sawmill","Sawmill"],["plankMake","Plank Make"]],"sawmill")}
    </div>
    <div class="group">
      <h2>Pace</h2>
      ${S("pace",[["low","Relaxed"],["mid","Typical"],["high","Fast"]],"mid")}
    </div>
    <div class="group">
      <h2>Rewards</h2>
      <label class="field"><span>Points now</span><input name="points" type="number" min="0" value="0" inputmode="numeric"></label>
      <p class="rw-note">Drag to set the order. Wanted rewards are bought top to bottom.</p>
      ${oa(R,{sack:"want",hat:"want",top:"want",legs:"want",boots:"want"})}
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;function fa(l){const L=l.querySelector(".out"),y=l.querySelector(".setup"),B=Q(y,"cLvl","cXp"),C=V(y,"mahogany",W);B.setXp(C.values().cXp),na(y),ea(l,s=>{let h=0;for(const d of b){const u=s(n[d].name),$=s(n[d].log);h+=u+$,C.set("pl-"+d,u),C.set("lg-"+d,$)}return h}),sa(s=>{s.skills.construction!==void 0&&B.setXp(s.skills.construction)});function W(s){var H;y.querySelectorAll("[data-show]").forEach(a=>{const[r,o]=a.dataset.show.split(":");a.hidden=!o.split(",").includes(s[r])});const h=s.cXp,d=q(h),{owned:u,wishlist:$}=la(R,s),F=Object.fromEntries(b.map(a=>[a,Math.max(0,s["pl-"+a]||0)])),E=Object.fromEntries(b.map(a=>[a,Math.max(0,s["lg-"+a]||0)])),t=U({mode:s.mode,startXp:h,goal:{type:"level",value:s.target},tier:s.tier,pace:s.pace,planks:F,logs:E,owned:u,wishlist:$,startPoints:s.points});if(t.blocked&&!t.contracts){L.innerHTML=T(`${t.blocked.name} contracts need ${t.blocked.level} Construction. You're ${d}.`,"ember");return}if(s.mode==="bank"&&!t.contracts){L.innerHTML=T("Add planks or logs you have. Contracts at your level use "+X.filter(a=>d>=a.level).map(a=>n[a.plank].name.toLowerCase()+"s").join(", ")+".");return}const N=b.reduce((a,r)=>a+t.planksNeeded[r],0);let c=ra({fromXp:h,toXp:t.endXp,skill:"Construction"});c+=O([k(e(t.contracts),M(t.contracts,"contract"),"gold"),k(P(t.hours),"doing contracts"),k(e(N),"planks"),k(e(t.bars),"steel bars")]),t.blocked&&(c+=T(`Stops at level ${q(t.endXp)}: ${t.blocked.name} contracts need ${t.blocked.level}.`,"ember"));const p=_(t.planksNeeded,F,E,s.method);if(p.rows.length){const a=x(["Planks","Needed","Bank planks","Bank logs","Logs to get","Coins"],p.rows.map(o=>({cells:[n[o.type].name,e(o.need),o.fromPlanks?e(o.fromPlanks):"–",o.fromLogs?e(o.fromLogs):"–",o.gather?`<b>${e(o.gather)}</b>`:"–",o.cost?I(o.cost):"–"]}))),r=s.method==="plankMake"?`<div class="rows">${f("Plank Make casts",e(p.casts))}${f("Runes",Object.entries(p.runes).map(([o,Y])=>`${e(Y)} ${o.replace(" rune","").toLowerCase()}`).join(", "))}${f("Magic xp","+"+e(p.magicXp))}${f("Casting time",P(p.castHours))}</div>`:"";c+=w("Planks",a+r+(p.coins?`<div class="rows">${f(s.method==="plankMake"?"Coins for Plank Make":"Sawmill fees",e(p.coins)+" gp","gold")}</div>`:""))}const j=a=>{var r;return((r=p.rows.find(o=>o.type===a))==null?void 0:r.gather)||0},i=z(j("teak"),j("mahogany"));if(i){const a=[];i.useBoth?a.push(`"Both" hardwood: ${v.options.both.teak} teak and ${v.options.both.mahogany} mahogany a day`):(i.teakDays&&a.push(`Teak: ${v.options.teak.teak} a day for ${e(i.teakDays)} ${M(i.teakDays,"day")}`),i.mahoDays&&a.push(`Mahogany: ${v.options.mahogany.mahogany} a day for ${e(i.mahoDays)} ${M(i.mahoDays,"day")}`)),c+=w("From Miscellania",O([k(e(i.days),M(i.days,"day")+" of collecting","gold"),k(I(i.coffer),"gp from the coffer")])+`<p class="fine">${a.join(". ")}. Maximum yield: Royal Trouble done, 10 workers on hardwood, 100% approval, at least 750k in the coffer.</p>`)}const g=[],m=(H=t.byTier[0])==null?void 0:H.tier;m&&g.push({when:"Start",what:m.name+" contracts",sub:n[m.plank].name.toLowerCase()+"s, "+e(m.xp)+" xp each",tone:"moss"});const A=new Set(u),K=R.filter(a=>a.outfit).map(a=>a.id);for(const a of t.events){if(a.kind==="tier"){g.push({when:P(a.hours)||"0h",what:"Move up to "+a.what,sub:`Contract ${e(a.contract+1)}, level ${a.level}, ${a.sub}`,tone:"moss"});continue}A.add(a.reward.id);const r=a.reward.xpBoost?`+${(a.reward.xpBoost*100).toFixed(1)}% xp from here`:a.reward.id==="sack"?"Faster contracts from here":"";g.push({when:P(a.hours),what:a.what,sub:`Contract ${e(a.contract)}, level ${a.level}${r?", "+r.charAt(0).toLowerCase()+r.slice(1):""}`,tone:"gold"}),a.reward.outfit&&K.every(o=>A.has(o))&&g.push({when:"",what:"Full outfit",sub:"+2.5% xp in total",tone:"gold"})}c+=w("Along the way",ia(g)),t.byTier.length>1&&(c+=w("By tier",x(["Tier","Contracts","Planks","Experience"],t.byTier.map(a=>({cells:[a.tier.name,e(a.contracts),e(Math.ceil(a.contracts*a.tier.planks)),e(a.xp)]})))));const D=u.includes("sack");c+=w("Every tier",x(["Tier","Level","Planks","XP a contract","Contracts an hour","Points"],X.map(a=>({cls:d<a.level?"off":(m==null?void 0:m.id)===a.id?"on":"",cells:[a.name,a.level,`${a.planks} ${a.plank==="plank"?"":a.plank}`,e(a.xp),e(G(a,D,s.pace),0),a.points]})),{foot:D?"With the plank sack.":"Without the plank sack."})),c+=`<details class="how"><summary>How it's worked out</summary><ul>
      <li>Planks, steel bars and xp per contract are the wiki's averages over every house layout. The xp includes the completion bonus.</li>
      <li>Contracts an hour come from the wiki's xp-an-hour range for each tier: Relaxed is the low end, Fast the high end. Buying the plank sack moves you to the faster range.</li>
      <li>With "Best I can do", each contract uses the highest tier your level allows. In bank mode it drops to a lower tier when you run out of the planks for the higher one.</li>
      <li>Logs count as planks once made: sawmill ${n.plank.sawmill}/${n.oak.sawmill}/${n.teak.sawmill}/${e(n.mahogany.sawmill)} gp, Plank Make ${n.plank.plankMake}/${n.oak.plankMake}/${n.teak.plankMake}/${e(n.mahogany.plankMake)} gp plus runes (${J.magic} Magic, Lunar).</li>
      <li>Sources: OSRS Wiki, Mahogany Homes, Sawmill, Plank Make and Managing Miscellania.</li>
    </ul></details>`,L.innerHTML=c}}export{ga as html,fa as mount,ka as reqs,ua as subtitle};
