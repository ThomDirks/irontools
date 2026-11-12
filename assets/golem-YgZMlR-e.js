import{f as N}from"./legacy-CvrGhUVW.js";import"./app-Dyv7qYUi.js";const R=`<div class="frame">

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
`,q=[{name:"Moonlight antelope fur",craftXP:2760,creature:"Moonlight antelope",huntLvl:91,huntXP:450,method:"Pitfall",xpHr:160080},{name:"Sunlight antelope fur",craftXP:2740,creature:"Sunlight antelope",huntLvl:72,huntXP:380,method:"Pitfall",xpHr:158920},{name:"Dashing kebbit fur",craftXP:2720,creature:"Dashing kebbit",huntLvl:69,huntXP:156,method:"Falconry",xpHr:157760},{name:"Kyatt fur",craftXP:2700,creature:"Sabre-toothed kyatt",huntLvl:55,huntXP:300,method:"Pitfall",xpHr:156600},{name:"Dark kebbit fur",craftXP:2700,creature:"Dark kebbit",huntLvl:57,huntXP:132,method:"Falconry",xpHr:156600},{name:"Fox fur",craftXP:2680,creature:"Pyre fox",huntLvl:57,huntXP:222,method:"Deadfall",xpHr:155440},{name:"Spotted kebbit fur",craftXP:2660,creature:"Spotted kebbit",huntLvl:43,huntXP:104,method:"Falconry",xpHr:154280},{name:"Graahk fur",craftXP:2640,creature:"Horned graahk",huntLvl:41,huntXP:240,method:"Pitfall",xpHr:153120},{name:"Larupia fur",craftXP:2620,creature:"Spined larupia",huntLvl:31,huntXP:180,method:"Pitfall",xpHr:151960},{name:"Feldip weasel fur",craftXP:2590,creature:"Feldip weasel",huntLvl:7,huntXP:48,method:"Tracking",xpHr:150220},{name:"Common kebbit fur",craftXP:2560,creature:"Common kebbit",huntLvl:3,huntXP:36,method:"Tracking",xpHr:148480},{name:"Desert devil fur",craftXP:2520,creature:"Desert devil",huntLvl:13,huntXP:66,method:"Tracking",xpHr:146160},{name:"Polar kebbit fur",craftXP:2480,creature:"Polar kebbit",huntLvl:1,huntXP:30,method:"Tracking",xpHr:143840},{name:"Wyrmscraig goat fur",craftXP:2440,creature:"Wyrmscraig goat",huntLvl:60,huntXP:null,method:"Goat pit",xpHr:141520,isGoat:!0}],A={FURS:q};function D(){const g=[0];(function(){let n=0;for(let t=1;t<99;t++)n+=Math.floor(t+300*Math.pow(2,t/7)),g[t+1]=Math.floor(n/4)})();const w=g[99];function X(n){return n=Math.max(1,Math.min(99,Math.round(n))),g[n]}function v(n){if(n>=w)return 99;for(let t=98;t>=1;t--)if(n>=g[t])return t;return 1}function l(n){return Math.round(n).toLocaleString("en-US")}const p=A.FURS,H=5;function P(n){const t=Math.max(60,Math.min(99,Math.round(n)));return 20+(100+3*(Math.min(t,80)-60)+Math.max(0,t-80))}function B(n,t){return n.isGoat?P(t):n.huntXP}const i={craft:X(60),hunt:X(60),mine:X(50)},L={};p.forEach((n,t)=>L[t]=0);function x(){return document.getElementById("momentum").checked?28:23}function E(n,t,e,s){const r=document.getElementById(t),o=document.getElementById(e),u=document.getElementById(s);function c(){const a=v(i[n]);if(a>=99){u.textContent="Level 99 — maxed";return}const m=g[a+1]-i[n],h=w-i[n];u.textContent=l(m)+" xp to level "+(a+1)+"  ·  "+l(h)+" xp to 99"}r.addEventListener("input",()=>{let a=parseInt(r.value,10);isNaN(a)||(a=Math.max(1,Math.min(99,a)),i[n]=X(a),o.value=i[n],c(),M())}),o.addEventListener("input",()=>{let a=parseInt(o.value,10);isNaN(a)&&(a=0),a=Math.max(0,Math.min(2e8,a)),i[n]=a,r.value=v(a),c(),M()}),c()}function y(n,t,e,s){const r=Math.min(2e8,e+s),o=v(e),u=v(r);let c,a;if(u>=99)c=100,a="99 (max)";else{const h=g[u],b=g[u+1];c=Math.max(0,Math.min(100,(r-h)/(b-h)*100)),a=l(b-r)+" to "+(u+1)}const m=u-o;return'<div class="skillline"><div class="nm"><span class="dot '+t+'"></span>'+n+'</div><div class="prog"><span style="width:'+c.toFixed(1)+'%"></span></div><div class="lv">Lv <b>'+o+"</b> &rarr; <b>"+u+"</b>"+(m>0?" (+"+m+")":"")+" &middot; "+a+"</div></div>"}function I(){const n=document.getElementById("furRows");n.innerHTML=p.map((t,e)=>{const s=t.isGoat?P(v(i.hunt))+" *":l(t.huntXP);return'<tr data-i="'+e+'"><td><span class="furname">'+t.name+'</span><br><span class="furmeta">'+t.creature+" &middot; "+t.method+" &middot; lvl "+t.huntLvl+'</span></td><td class="num">'+l(t.craftXP)+'</td><td class="num">'+s+'</td><td class="num"><input class="qty" type="number" min="0" step="1" value="'+(L[e]||0)+'" data-i="'+e+'"></td></tr>'}).join(""),n.querySelectorAll("input.qty").forEach(t=>{t.addEventListener("input",()=>{const e=+t.dataset.i;let s=parseInt(t.value,10);(isNaN(s)||s<0)&&(s=0),L[e]=s,S()})})}function S(){const n=v(i.hunt);let t=0,e=0,s=0,r=[];p.forEach((a,m)=>{const h=L[m]||0;if(!h)return;t+=h,e+=h*a.craftXP,s+=h*B(a,n),a.huntLvl>n&&r.push(a);const b=document.querySelector('#furRows tr[data-i="'+m+'"]');b&&b.classList.remove("dim")});const o=t*H,u=o*x();document.getElementById("m1cards").innerHTML=d("Golems / furs",l(t),"")+d("Sunstones to mine",l(o),"5 per golem")+d("Crafting XP","<span class='xpdrop'>+"+l(e)+"</span>","")+d("Hunter XP","<span class='xpdrop'>+"+l(s)+"</span>","if self-caught")+d("Mining XP","<span class='xpdrop'>+"+l(u)+"</span>",x()+" xp / sunstone")+d("Gems rewarded",l(t),"~466 gp avg each"),document.getElementById("m1skills").innerHTML=y("Crafting","craft",i.craft,e)+y("Hunter","hunt",i.hunt,s)+y("Mining","mine",i.mine,u);const c=document.getElementById("m1warn");r.length?c.innerHTML='<div class="warn"><b>Heads up:</b> at Hunter '+n+" you cannot catch: "+r.map(a=>a.creature+" (lvl "+a.huntLvl+")").join(", ")+". Their Hunter XP is only counted if you actually catch them.</div>":c.innerHTML="",document.querySelectorAll("#furRows tr").forEach(a=>{const m=+a.dataset.i;p[m].isGoat&&(a.children[2].textContent=P(n)+" *")})}function d(n,t,e){return'<div class="rcard"><div class="k">'+n+'</div><div class="v'+(t.length>9&&t.indexOf("xpdrop")<0?" small":"")+'">'+t+"</div>"+(e?'<div class="note">'+e+"</div>":"")+"</div>"}function F(){const n=document.getElementById("m2fur");n.innerHTML=p.map((t,e)=>'<option value="'+e+'">'+t.name+"  ("+l(t.craftXP)+" xp/golem)</option>").join(""),n.value="4",n.addEventListener("change",k),document.getElementById("m2target").addEventListener("input",k)}function k(){const n=p[+document.getElementById("m2fur").value];let t=parseInt(document.getElementById("m2target").value,10);const e=document.getElementById("m2cards"),s=document.getElementById("m2skills"),r=document.getElementById("m2msg");if(isNaN(t)){e.innerHTML="",s.innerHTML="",r.innerHTML="";return}t=Math.max(2,Math.min(99,t));const o=X(t)-i.craft;if(o<=0){e.innerHTML="",s.innerHTML="",r.innerHTML='<div class="done">You are already Crafting level '+v(i.craft)+", which is at or above level "+t+". Nothing to do here.</div>";return}const u=v(i.hunt),c=Math.ceil(o/n.craftXP),a=c*H,m=c*n.craftXP,h=c*B(n,u),b=a*x(),T=m/n.xpHr,G=T<1?Math.round(T*60)+" min":T.toFixed(1)+" h";e.innerHTML=d("Golems / furs needed","<span class='xpdrop'>"+l(c)+"</span>","")+d("Sunstones to mine",l(a),"5 per golem")+d("Crafting XP needed",l(o),"to level "+t)+d("Hunter XP gained","+"+l(h),"if self-caught")+d("Mining XP gained","+"+l(b),x()+" xp / sunstone")+d("Est. crafting time","~"+G,"at "+l(n.xpHr)+" xp/hr"),s.innerHTML=y("Crafting","craft",i.craft,m)+y("Hunter","hunt",i.hunt,h)+y("Mining","mine",i.mine,b),r.innerHTML=n.huntLvl>u?'<div class="warn">To catch <b>'+n.creature+"</b> you need Hunter "+n.huntLvl+" (you are "+u+"). You can still buy the furs, but then you gain no Hunter XP.</div>":""}let f={key:"craftXP",dir:-1};function C(){const n=v(i.hunt),t=p.map((e,s)=>{const r=e.isGoat?P(n):e.huntXP;return Object.assign({},e,{idx:s,huntSort:r})});t.sort((e,s)=>{let r=e[f.key],o=s[f.key];return typeof r=="string"?f.dir*r.localeCompare(o):f.dir*(r-o)}),document.getElementById("refRows").innerHTML=t.map(e=>{const s=e.huntLvl<=n,r=e.isGoat?P(n)+' <span class="pill">scales</span>':l(e.huntXP);return'<tr class="'+(s?"canhunt":"")+'"><td><b>'+e.name.replace(" fur","")+'</b><br><span class="furmeta">'+e.creature+'</span></td><td class="num">'+l(e.craftXP)+'</td><td class="num">'+r+'</td><td class="num">'+e.huntLvl+"</td><td>"+e.method+'</td><td class="num">'+l(e.xpHr)+"</td></tr>"}).join("")}document.querySelectorAll("#refTable th[data-sort]").forEach(n=>{n.addEventListener("click",()=>{const t=n.dataset.sort;f.key===t?f.dir*=-1:f={key:t,dir:t==="method"?1:-1},document.querySelectorAll("#refTable th .ar").forEach(e=>e.innerHTML=""),n.querySelector(".ar").innerHTML=f.dir<0?"&#9662;":"&#9652;",C()})}),document.querySelectorAll(".tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected","false")),n.setAttribute("aria-selected","true"),document.querySelectorAll(".tabpanel").forEach(t=>t.classList.remove("on")),document.getElementById(n.dataset.tab).classList.add("on")})});function M(){document.getElementById("mineRate").textContent="= "+H*x()+" Mining XP per golem",S(),k(),C()}E("craft","craftLvl","craftXp","craftNote"),E("hunt","huntLvl","huntXp","huntNote"),E("mine","mineLvl","mineXp","mineNote"),document.getElementById("momentum").addEventListener("change",M),document.getElementById("clearBtn").addEventListener("click",()=>{p.forEach((n,t)=>L[t]=0),document.querySelectorAll("input.qty").forEach(n=>n.value=0),S()}),I(),F(),document.querySelector('#refTable th[data-sort="craftXP"] .ar').innerHTML="&#9662;",M()}const W="Furs and sunstone into golems",j=["<b>60</b> Crafting","<b>50</b> Mining","<b>5</b> sunstones a golem"],Y=`<div id="view-golem" class="legacy">${R}</div>`;function _(){D(),N({craftXp:"crafting",huntXp:"hunter",mineXp:"mining"})}export{Y as html,_ as mount,j as reqs,W as subtitle};
