import{B as F,f as E}from"./calc-BV5D_2EM.js";import{F as L,c as T}from"./calc-CDccmPUJ.js";import{O as P,a as j,s as N}from"./calc-vyAVZ4mI.js";import{a as O,P as k,T as R}from"./calc-DhEX0Wnv.js";import{H as q,a as G}from"./calc-B1CbSkrq.js";import{b as I}from"./form-DerNmqW7.js";import{o as X,g as A,h as m,d as U,l as g,a as v,M as y,e as M,x as _}from"./app-DDtPzl0Z.js";import{s as B,n as $}from"./ui-m6iUulm7.js";import"./herbs-DHo3Ndt3.js";const ss="The xp sitting in your bank, skill by skill",as=["Group bank loaded"],os=`<div class="calc">
  <form class="setup" onsubmit="return false">
    <div class="group">
      <h2>Prayer</h2>
      ${B("prayer",[["chaos","Chaos altar"],["ecto","Ectofuntus"]],"chaos")}
    </div>
    <div class="group">
      <h2>Cooking</h2>
      ${B("cook",[["hos5","Hosidius"],["hos10","With elite diary"]],"hos5")}
      <label class="toggle"><input type="checkbox" name="gauntlets"><span>Cooking gauntlets</span></label>
    </div>
    <div class="group">
      <h2>Smithing</h2>
      <label class="toggle"><input type="checkbox" name="coalBag" checked><span>Coal bag at the Blast Furnace</span></label>
    </div>
    <div class="group">
      <h2>Farming</h2>
      <label class="field"><span>Compost on herbs</span><select name="compost">
        <option value="ultra">Ultracompost</option><option value="super">Supercompost</option><option value="compost">Compost</option><option value="none">None</option>
      </select></label>
      <label class="toggle"><input type="checkbox" name="secateurs"><span>Magic secateurs</span></label>
    </div>
  </form>
  <div class="out" aria-live="polite"></div>
</div>`;function ts(x){const b=x.querySelector(".out"),C=x.querySelector(".setup");let h=null,w=!1;const S=I(C,"bankxp",H);X(e=>{h=e.skills,S.refresh()}),A(e=>{w=e.loaded,S.refresh()});const u=e=>h&&h[e]!==void 0?h[e]:_(99);function H(e){if(!w){b.innerHTML=$("Load your group bank in the sidebar (Group bank, under your stats) and this adds up the xp in it.");return}const r=[];{const s={};for(const a of F)s[a.id]=m(a.name);const o=u("prayer"),t=E(o,s,e.prayer,{zealot:0});t.rows.length&&r.push(d("Prayer","prayer",o,t.gained,t.rows.map(a=>[a.bone.name,a.n]),e.prayer==="chaos"?"Chaos altar, half the bones saved":"Ectofuntus"))}{const s={};for(const n of L)s[n.id]=m(n.raw);const o=u("cooking"),t=T(o,s,e.cook,!!e.gauntlets),a=t.rows.filter(n=>n.locked).map(n=>n.fish.name);t.rows.length&&r.push(d("Cooking","cooking",o,t.gained,t.rows.map(n=>[n.fish.raw,n.raw]),"Hosidius kitchen, after burns"+(a.length?`. Still locked: ${a.join(", ")}`:"")))}{const s={};for(const a of P)s[a]=m(j[a].name);const o=u("smithing"),t=N(o,s,{coalBag:!!e.coalBag,gauntlets:!1,pace:"mid"});t.rows.length&&r.push(d("Smithing","blastfurnace",o,t.gained,t.rows.map(a=>[a.bar.name+"s",Math.round(a.n)]),`Blast Furnace, about ${U(t.hours)}`))}{const s=u("construction"),o=g(s);let t=0;const a=[],n=[];for(const i of O){const c=m(k[i].name);if(!c)continue;const l=R.find(p=>p.plank===i);if(o<l.level){n.push(`${k[i].name} (${l.level})`);continue}t+=c*l.xp/l.planks,a.push([k[i].name,c])}(a.length||n.length)&&r.push(d("Construction","mahogany",s,Math.min(y-s,t),a,"Mahogany Homes contracts"+(n.length?`. Still locked: ${n.join(", ")}`:"")))}{const s=u("farming"),o=g(s),t={compost:e.compost||"ultra",secateurs:!!e.secateurs,cape:!1,anima:"none",outfit:!1},a={prot:!1,diary:0,xpMult:1};let n=0;const i=[],c=[];for(const l of q){const p=m(l.seed);if(p){if(o<l.level){c.push(`${l.seed}s (${l.level})`);continue}n+=p*G(l,o,t,a).xp,i.push([l.seed,p])}}(i.length||c.length)&&r.push(d("Farming","herbs",s,Math.min(y-s,n),i,"Herb seeds, planted and picked"+(c.length?`. Still locked: ${c.join(", ")}`:"")))}if(!r.length){b.innerHTML=$("Nothing in the bank that these calculators use yet: bones, raw fish, ores, planks or herb seeds.");return}const f=r.reduce((s,o)=>s+o.gained,0);b.innerHTML=`<div class="bx-total"><b>${v(Math.round(f))}</b><span>xp waiting in the bank</span></div>
      ${h?"":$("Load your stats at the top of the sidebar for your levels, burn rates and what's still locked. Until then this counts everything as unlocked.")}
      <div class="bx">${r.sort((s,o)=>o.gained-s.gained).map(s=>s.html).join("")}</div>`}function d(e,r,f,s,o,t){const a=g(f),n=g(Math.min(y,f+s)),i=h?`<span class="bx-lv">${a}<svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5"/></svg>${n}</span>`:"",c=o.slice(0,6).map(([l,p])=>`${v(p)} ${M(l.toLowerCase())}`).join(", ")+(o.length>6?`, and ${o.length-6} more`:"");return{gained:s,html:`<a class="bx-card" href="#/${r}">
        <span class="bx-head"><b>${e}</b>${i}</span>
        <span class="bx-xp">+${v(Math.round(s))} xp</span>
        <span class="bx-what">${c||"Nothing usable yet"}</span>
        <span class="bx-how">${M(t)}</span>
      </a>`}}}export{os as html,ts as mount,as as reqs,ss as subtitle};
