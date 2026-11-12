import{f as R}from"./legacy-fSyDgocF.js";import{f as q,b as A}from"./app-CcrVXAlR.js";const D=`<div class="frame">

  <!-- YOUR STATS -->
  <div class="panel">
    <div class="ph">Your current levels <span class="sub">type a level or exact XP, they stay in sync</span></div>
    <div class="pbody">
      <div class="stats">
        <div class="stat">
          <h3><span class="dot craft"></span>Crafting</h3>
          <div class="field"><label>Level</label><input id="craftLvl" type="number" min="1" max="99" value="60"></div>
          <div class="field"><label>XP</label><input id="craftXp" type="number" min="0" value="273742"></div>
          <div class="lvlnote" id="craftNote"></div>
        </div>
        <div class="stat">
          <h3><span class="dot hunt"></span>Hunter</h3>
          <div class="field"><label>Level</label><input id="huntLvl" type="number" min="1" max="99" value="60"></div>
          <div class="field"><label>XP</label><input id="huntXp" type="number" min="0" value="273742"></div>
          <div class="lvlnote" id="huntNote"></div>
        </div>
        <div class="stat">
          <h3><span class="dot mine"></span>Mining</h3>
          <div class="field"><label>Level</label><input id="mineLvl" type="number" min="1" max="99" value="50"></div>
          <div class="field"><label>XP</label><input id="mineXp" type="number" min="0" value="101333"></div>
          <div class="lvlnote" id="mineNote"></div>
        </div>
      </div>
      <div class="assump">
        <label title="Sunstone gives 23 XP normally, 28 XP with momentum active"><input type="checkbox" id="momentum" checked> Mining with momentum (28 XP / sunstone)</label>
        <span id="mineRate"></span>
      </div>
    </div>
  </div>

  <!-- TABS -->
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true"  data-tab="t1">Furs &rarr; XP</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="t2">Target level &rarr; Furs</button>
    <button class="tab" role="tab" aria-selected="false" data-tab="t3">Fur reference</button>
  </div>

  <!-- MODE 1 -->
  <div class="panel tabpanel on" id="t1">
    <div class="ph">Enter the furs you have <span class="sub">1 fur = 1 golem</span></div>
    <div class="pbody">
      <table class="furtable">
        <thead>
          <tr>
            <th>Fur</th>
            <th class="num">Crafting XP<br>each</th>
            <th class="num">Hunter XP<br>each</th>
            <th class="num" style="width:90px">You have</th>
          </tr>
        </thead>
        <tbody id="furRows"></tbody>
      </table>
      <div class="clearrow"><button class="btn" id="clearBtn">Clear all</button></div>

      <div class="results" style="margin-top:14px">
        <div class="rh">Totals from these furs</div>
        <div class="rgrid" id="m1cards"></div>
        <div id="m1skills"></div>
      </div>
      <div id="m1warn"></div>
    </div>
  </div>

  <!-- MODE 2 -->
  <div class="panel tabpanel" id="t2">
    <div class="ph">Reach a target Crafting level <span class="sub">how many furs / golems you need</span></div>
    <div class="pbody">
      <div class="m2ctl">
        <div class="cell">
          <label for="m2fur">Fur used for golems</label>
          <select id="m2fur"></select>
        </div>
        <div class="cell">
          <label for="m2target">Target Crafting level (1&ndash;99)</label>
          <input id="m2target" type="number" min="2" max="99" value="99">
        </div>
      </div>

      <div class="results">
        <div class="rh">What it takes</div>
        <div class="rgrid" id="m2cards"></div>
        <div id="m2skills"></div>
      </div>
      <div id="m2msg"></div>
    </div>
  </div>

  <!-- MODE 3 -->
  <div class="panel tabpanel" id="t3">
    <div class="ph">All usable furs <span class="sub">tap a heading to sort</span></div>
    <div class="pbody">
      <table class="reftable" id="refTable">
        <thead>
          <tr>
            <th data-sort="craftXP">Fur <span class="ar">&#9662;</span></th>
            <th data-sort="craftXP" class="num">Craft XP<br>/ golem <span class="ar"></span></th>
            <th data-sort="huntSort" class="num">Hunter XP<br>/ catch <span class="ar"></span></th>
            <th data-sort="huntLvl" class="num">Hunter<br>lvl <span class="ar"></span></th>
            <th data-sort="method">Catch<br>method <span class="ar"></span></th>
            <th data-sort="xpHr" class="num">Craft XP/hr<br>(~58/hr) <span class="ar"></span></th>
          </tr>
        </thead>
        <tbody id="refRows"></tbody>
      </table>
      <p style="font-size:11.5px;color:var(--ink-soft);margin:10px 0 0">
        <span class="legend"></span> Green edge = you can catch this at your current Hunter level.
      </p>
    </div>
  </div>

  <details class="foot how">
    <summary>How it's worked out</summary>
    <ul>
      <li>Each golem uses <b>1 fur</b> and gives the "Crafting XP" shown. That number is the fur XP plus the flat 1,560 golem XP.</li>
      <li>Each golem needs <b>5 sunstones</b> (4 to shape it, 1 chiselled into a core). Mining XP = 5 &times; per-sunstone XP (23 normal, 28 with momentum). Chiselling each core also gives a small +10 Crafting XP that is not counted above.</li>
      <li><b>Hunter XP</b> assumes you catch every fur yourself. Buying furs from the Grand Exchange gives no Hunter XP. Wyrmscraig goat XP scales with your Hunter level (20 to lure with a cattleprod, plus 100 to 179 loot), so it is recalculated from your Hunter level.</li>
      <li><b>Mining XP</b> assumes you mine the sunstones yourself.</li>
    </ul>
    <h4>Sources</h4>
    <ul>
      <li>All fur, sunstone and Hunter values are from the OSRS Wiki (Golem crafting, Sunstone rocks, and each creature's Hunter page), current as of the Wyrmscraig release.</li>
    </ul>
  </details>
</div>
`,O=[{name:"Moonlight antelope fur",craftXP:2760,creature:"Moonlight antelope",huntLvl:91,huntXP:450,method:"Pitfall",xpHr:160080},{name:"Sunlight antelope fur",craftXP:2740,creature:"Sunlight antelope",huntLvl:72,huntXP:380,method:"Pitfall",xpHr:158920},{name:"Dashing kebbit fur",craftXP:2720,creature:"Dashing kebbit",huntLvl:69,huntXP:156,method:"Falconry",xpHr:157760},{name:"Kyatt fur",craftXP:2700,creature:"Sabre-toothed kyatt",huntLvl:55,huntXP:300,method:"Pitfall",xpHr:156600},{name:"Dark kebbit fur",craftXP:2700,creature:"Dark kebbit",huntLvl:57,huntXP:132,method:"Falconry",xpHr:156600},{name:"Fox fur",craftXP:2680,creature:"Pyre fox",huntLvl:57,huntXP:222,method:"Deadfall",xpHr:155440},{name:"Spotted kebbit fur",craftXP:2660,creature:"Spotted kebbit",huntLvl:43,huntXP:104,method:"Falconry",xpHr:154280},{name:"Graahk fur",craftXP:2640,creature:"Horned graahk",huntLvl:41,huntXP:240,method:"Pitfall",xpHr:153120},{name:"Larupia fur",craftXP:2620,creature:"Spined larupia",huntLvl:31,huntXP:180,method:"Pitfall",xpHr:151960},{name:"Feldip weasel fur",craftXP:2590,creature:"Feldip weasel",huntLvl:7,huntXP:48,method:"Tracking",xpHr:150220},{name:"Common kebbit fur",craftXP:2560,creature:"Common kebbit",huntLvl:3,huntXP:36,method:"Tracking",xpHr:148480},{name:"Desert devil fur",craftXP:2520,creature:"Desert devil",huntLvl:13,huntXP:66,method:"Tracking",xpHr:146160},{name:"Polar kebbit fur",craftXP:2480,creature:"Polar kebbit",huntLvl:1,huntXP:30,method:"Tracking",xpHr:143840},{name:"Wyrmscraig goat fur",craftXP:2440,creature:"Wyrmscraig goat",huntLvl:60,huntXP:null,method:"Goat pit",xpHr:141520,isGoat:!0}],C={FURS:O};function U(){const p=[0];(function(){let e=0;for(let t=1;t<99;t++)e+=Math.floor(t+300*Math.pow(2,t/7)),p[t+1]=Math.floor(e/4)})();const M=p[99];function f(e){return e=Math.max(1,Math.min(99,Math.round(e))),p[e]}function d(e){if(e>=M)return 99;for(let t=98;t>=1;t--)if(e>=p[t])return t;return 1}function s(e){return Math.round(e).toLocaleString("en-US")}const b=C.FURS,H=5;function P(e){const t=Math.max(60,Math.min(99,Math.round(e)));return 20+(100+3*(Math.min(t,80)-60)+Math.max(0,t-80))}function B(e,t){return e.isGoat?P(t):e.huntXP}const i={craft:f(60),hunt:f(60),mine:f(50)},L={};b.forEach((e,t)=>L[t]=0);function x(){return document.getElementById("momentum").checked?28:23}function S(e,t,n,r){const l=document.getElementById(t),o=document.getElementById(n),u=document.getElementById(r);function c(){const a=d(i[e]);if(a>=99){u.textContent="Level 99 — maxed";return}const h=p[a+1]-i[e],v=M-i[e];u.textContent=s(h)+" xp to level "+(a+1)+"  ·  "+s(v)+" xp to 99"}l.addEventListener("input",()=>{let a=parseInt(l.value,10);isNaN(a)||(a=Math.max(1,Math.min(99,a)),i[e]=f(a),o.value=i[e],c(),E())}),o.addEventListener("input",()=>{let a=parseInt(o.value,10);isNaN(a)&&(a=0),a=Math.max(0,Math.min(2e8,a)),i[e]=a,l.value=d(a),c(),E()}),c()}function X(e,t,n,r){const l=Math.min(2e8,n+r),o=d(n),u=d(l);let c,a;if(u>=99)c=100,a="99 (max)";else{const v=p[u],y=p[u+1];c=Math.max(0,Math.min(100,(l-v)/(y-v)*100)),a=s(y-l)+" to "+(u+1)}const h=u-o;return'<div class="skillline"><div class="nm"><span class="dot '+t+'"></span>'+e+'</div><div class="prog"><span style="width:'+c.toFixed(1)+'%"></span></div><div class="lv">Lv <b>'+o+"</b> &rarr; <b>"+u+"</b>"+(h>0?" (+"+h+")":"")+" &middot; "+a+"</div></div>"}function F(){const e=document.getElementById("furRows");e.innerHTML=b.map((t,n)=>{const r=t.isGoat?P(d(i.hunt))+" *":s(t.huntXP);return'<tr data-i="'+n+'"><td><span class="furname">'+t.name+'</span><br><span class="furmeta">'+t.creature+" &middot; "+t.method+" &middot; lvl "+t.huntLvl+'</span></td><td class="num">'+s(t.craftXP)+'</td><td class="num">'+r+'</td><td class="num"><input class="qty" type="number" min="0" step="1" value="'+(L[n]||0)+'" data-i="'+n+'"></td></tr>'}).join(""),e.querySelectorAll("input.qty").forEach(t=>{t.addEventListener("input",()=>{const n=+t.dataset.i;let r=parseInt(t.value,10);(isNaN(r)||r<0)&&(r=0),L[n]=r,k()})})}function k(){const e=d(i.hunt);let t=0,n=0,r=0,l=[];b.forEach((a,h)=>{const v=L[h]||0;if(!v)return;t+=v,n+=v*a.craftXP,r+=v*B(a,e),a.huntLvl>e&&l.push(a);const y=document.querySelector('#furRows tr[data-i="'+h+'"]');y&&y.classList.remove("dim")});const o=t*H,u=o*x();document.getElementById("m1cards").innerHTML=m("Golems / furs",s(t),"")+m("Sunstones to mine",s(o),"5 per golem")+m("Crafting XP","<span class='xpdrop'>+"+s(n)+"</span>","")+m("Hunter XP","<span class='xpdrop'>+"+s(r)+"</span>","if self-caught")+m("Mining XP","<span class='xpdrop'>+"+s(u)+"</span>",x()+" xp / sunstone")+m("Gems rewarded",s(t),"~466 gp avg each"),document.getElementById("m1skills").innerHTML=X("Crafting","craft",i.craft,n)+X("Hunter","hunt",i.hunt,r)+X("Mining","mine",i.mine,u);const c=document.getElementById("m1warn");l.length?c.innerHTML='<div class="warn"><b>Heads up:</b> at Hunter '+e+" you cannot catch: "+l.map(a=>a.creature+" (lvl "+a.huntLvl+")").join(", ")+". Their Hunter XP is only counted if you actually catch them.</div>":c.innerHTML="",document.querySelectorAll("#furRows tr").forEach(a=>{const h=+a.dataset.i;b[h].isGoat&&(a.children[2].textContent=P(e)+" *")})}function m(e,t,n){return'<div class="rcard"><div class="k">'+e+'</div><div class="v'+(t.length>9&&t.indexOf("xpdrop")<0?" small":"")+'">'+t+"</div>"+(n?'<div class="note">'+n+"</div>":"")+"</div>"}function G(){const e=document.getElementById("m2fur");e.innerHTML=b.map((t,n)=>'<option value="'+n+'">'+t.name+"  ("+s(t.craftXP)+" xp/golem)</option>").join(""),e.value="4",e.addEventListener("change",T),document.getElementById("m2target").addEventListener("input",T)}function T(){const e=b[+document.getElementById("m2fur").value];let t=parseInt(document.getElementById("m2target").value,10);const n=document.getElementById("m2cards"),r=document.getElementById("m2skills"),l=document.getElementById("m2msg");if(isNaN(t)){n.innerHTML="",r.innerHTML="",l.innerHTML="";return}t=Math.max(2,Math.min(99,t));const o=f(t)-i.craft;if(o<=0){n.innerHTML="",r.innerHTML="",l.innerHTML='<div class="done">You are already Crafting level '+d(i.craft)+", which is at or above level "+t+". Nothing to do here.</div>";return}const u=d(i.hunt),c=Math.ceil(o/e.craftXP),a=c*H,h=c*e.craftXP,v=c*B(e,u),y=a*x(),w=h/e.xpHr,N=w<1?Math.round(w*60)+" min":w.toFixed(1)+" h";n.innerHTML=m("Golems / furs needed","<span class='xpdrop'>"+s(c)+"</span>","")+m("Sunstones to mine",s(a),"5 per golem")+m("Crafting XP needed",s(o),"to level "+t)+m("Hunter XP gained","+"+s(v),"if self-caught")+m("Mining XP gained","+"+s(y),x()+" xp / sunstone")+m("Est. crafting time","~"+N,"at "+s(e.xpHr)+" xp/hr"),r.innerHTML=X("Crafting","craft",i.craft,h)+X("Hunter","hunt",i.hunt,v)+X("Mining","mine",i.mine,y),l.innerHTML=e.huntLvl>u?'<div class="warn">To catch <b>'+e.creature+"</b> you need Hunter "+e.huntLvl+" (you are "+u+"). You can still buy the furs, but then you gain no Hunter XP.</div>":""}let g={key:"craftXP",dir:-1};function I(){const e=d(i.hunt),t=b.map((n,r)=>{const l=n.isGoat?P(e):n.huntXP;return Object.assign({},n,{idx:r,huntSort:l})});t.sort((n,r)=>{let l=n[g.key],o=r[g.key];return typeof l=="string"?g.dir*l.localeCompare(o):g.dir*(l-o)}),document.getElementById("refRows").innerHTML=t.map(n=>{const r=n.huntLvl<=e,l=n.isGoat?P(e)+' <span class="pill">scales</span>':s(n.huntXP);return'<tr class="'+(r?"canhunt":"")+'"><td><b>'+n.name.replace(" fur","")+'</b><br><span class="furmeta">'+n.creature+'</span></td><td class="num">'+s(n.craftXP)+'</td><td class="num">'+l+'</td><td class="num">'+n.huntLvl+"</td><td>"+n.method+'</td><td class="num">'+s(n.xpHr)+"</td></tr>"}).join("")}document.querySelectorAll("#refTable th[data-sort]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.sort;g.key===t?g.dir*=-1:g={key:t,dir:t==="method"?1:-1},document.querySelectorAll("#refTable th .ar").forEach(n=>n.innerHTML=""),e.querySelector(".ar").innerHTML=g.dir<0?"&#9662;":"&#9652;",I()})}),document.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected","false")),e.setAttribute("aria-selected","true"),document.querySelectorAll(".tabpanel").forEach(t=>t.classList.remove("on")),document.getElementById(e.dataset.tab).classList.add("on")})});function E(){document.getElementById("mineRate").textContent="= "+H*x()+" Mining XP per golem",k(),T(),I()}S("craft","craftLvl","craftXp","craftNote"),S("hunt","huntLvl","huntXp","huntNote"),S("mine","mineLvl","mineXp","mineNote"),document.getElementById("momentum").addEventListener("change",E),document.getElementById("clearBtn").addEventListener("click",()=>{b.forEach((e,t)=>L[t]=0),document.querySelectorAll("input.qty").forEach(e=>e.value=0),k()}),F(),G(),document.querySelector('#refTable th[data-sort="craftXP"] .ar').innerHTML="&#9662;",E()}const Y="Furs and sunstone into golems",_=["<b>60</b> Crafting","<b>50</b> Mining","<b>5</b> sunstones a golem"],z=`<div id="view-golem" class="legacy">${D}</div>`;function K(){U(),R({craftXp:"crafting",huntXp:"hunter",mineXp:"mining"});const p=document.getElementById("view-golem");document.getElementById("clearBtn").insertAdjacentHTML("beforebegin",q()),A(p,M=>{let f=0;return p.querySelectorAll("#furRows input.qty").forEach(d=>{const s=M(C.FURS[+d.dataset.i].name);d.value=s,d.dispatchEvent(new Event("input",{bubbles:!0})),f+=s}),f})}export{z as html,K as mount,_ as reqs,Y as subtitle};
