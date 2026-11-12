import{f as Ue}from"./legacy-CvrGhUVW.js";import"./app-Dyv7qYUi.js";const _e=`<div class="hide" aria-hidden="true"><span id="hdr-level"></span><span id="hdr-cap"></span></div>

<section class="card">
  <h2>Your Herblore</h2>
  <div class="grid3">
    <label class="field"><span class="flabel">Current Herblore xp</span>
      <input id="xp" inputmode="numeric" value="273742"><span class="fhint" id="xp-hint"></span></label>
    <label class="field"><span class="flabel">Herbs per seed</span>
      <input id="yield" inputmode="numeric" value="10"><span class="fhint">Flat multiplier on every seed</span></label>
    <label class="field"><span class="flabel">Goal level</span>
      <input id="goal" inputmode="numeric" value="99"><span class="fhint" id="goal-hint"></span></label>
  </div>
  <p class="warn hide" id="warn-60">Mixology needs 60 Herblore. Below that, refining herbs is off the table.</p>
</section>

<section class="card">
  <h2>Gear and play style</h2>
  <div class="chips">
    <button class="chip" id="t-goggles" aria-pressed="true"><span class="tick">&#10003;</span><span>Prescription goggles<em>10% secondary save</em></span></button>
    <button class="chip" id="t-scp" aria-pressed="true"><span class="tick">&#10003;</span><span>Reserve for super combats<em>torstol drives it</em></span></button>
    <button class="chip" id="t-triple" aria-pressed="true"><span class="tick">&#10003;</span><span>Hand in 3 orders at once<em>+40% resin</em></span></button>
    <button class="chip" id="t-cleanup" aria-pressed="true"><span class="tick">&#10003;</span><span>Burn leftover paste<em>MMM / AAA / LLL</em></span></button>
  </div>
  <div class="grid3 spaced">
    <label class="field"><span class="flabel">Amulet</span>
      <select id="amulet">
        <option value="none">None</option>
        <option value="chem">Amulet of chemistry (5%)</option>
        <option value="alch">Alchemist's amulet (15%)</option>
      </select><span class="fhint" id="amulet-hint"></span></label>
    <label class="field"><span class="flabel">Order strategy</span>
      <select id="strategy">
        <option value="orders">Fill whatever is ordered</option>
        <option value="mixalot">Mixalot only (81+)</option>
      </select><span class="fhint">Mixalot is the best xp per paste</span></label>
    <label class="field"><span class="flabel">Speed-up xp per potion</span>
      <input id="speedxp" inputmode="numeric" value="14"><span class="fhint">14 agitator, 16 double click, 0 afk</span></label>
  </div>
  <p style="margin-top:14px"><button class="ghost" id="adv-toggle">Show extras</button></p>
  <div class="grid3 spaced hide" id="adv">
    <label class="field"><span class="flabel">Digweed used</span>
      <input id="digweed" inputmode="numeric" placeholder="0"><span class="fhint">~1 per 7 min at 81+, doubles that potion</span></label>
    <label class="field"><span class="flabel">Super combat cap</span>
      <input id="scptarget" inputmode="numeric" placeholder="max"><span class="fhint">Blank = make as many as possible</span></label>
  </div>
</section>

<section class="card">
  <div class="cardhead">
    <h2>Herbs</h2>
    <div class="btnrow">
      <button class="ghost" id="b-paste">All to paste</button>
      <button class="ghost" id="b-rec">Recommended</button>
      <button class="ghost" id="b-clear">Clear counts</button>
    </div>
  </div>
  <div class="tablewrap">
    <table>
      <thead><tr>
        <th class="l">Herb</th><th>Seeds</th><th>In bank</th><th>Total</th>
        <th>Held back</th><th class="l">What it becomes</th><th class="r">Output</th>
      </tr></thead>
      <tbody id="herb-rows"></tbody>
    </table>
  </div>
  <p class="foot" id="herb-foot"></p>
</section>

<section class="card" id="bank-card">
  <h2>Already in your bank</h2>
  <p class="foot" style="margin:0 0 12px">Doses you already own. Supers are spent on the super combat chain before a single herb is touched, so this pulls your herb bill down.</p>
  <div class="grid3">
    <label class="field"><span class="flabel">Super attack doses</span>
      <input id="bk-att" inputmode="numeric" placeholder="0"><span class="fhint" id="bk-att-h">&mdash;</span></label>
    <label class="field"><span class="flabel">Super strength doses</span>
      <input id="bk-str" inputmode="numeric" placeholder="0"><span class="fhint" id="bk-str-h">&mdash;</span></label>
    <label class="field"><span class="flabel">Super defence doses</span>
      <input id="bk-def" inputmode="numeric" placeholder="0"><span class="fhint" id="bk-def-h">&mdash;</span></label>
  </div>
  <div class="grid3" style="margin-top:12px">
    <label class="field"><span class="flabel">Crystal shards</span>
      <input id="bk-shard" inputmode="numeric" placeholder="0"><span class="fhint">10 dust each</span></label>
    <label class="field"><span class="flabel">Crystal dust</span>
      <input id="bk-dust" inputmode="numeric" placeholder="0"><span class="fhint">1 per dose of divine</span></label>
    <label class="field"><span class="flabel">Amylase crystals</span>
      <input id="bk-amyl" inputmode="numeric" placeholder="0"><span class="fhint">1 per dose of stamina</span></label>
  </div>
  <div class="grid3" style="margin-top:12px">
    <label class="field"><span class="flabel">Energy potion doses</span>
      <input id="bk-energy" inputmode="numeric" placeholder="0"><span class="fhint">run supplies</span></label>
    <label class="field"><span class="flabel">Super energy doses</span>
      <input id="bk-senergy" inputmode="numeric" placeholder="0"><span class="fhint">turns into stamina</span></label>
    <label class="field"><span class="flabel">Stamina doses</span>
      <input id="bk-stam" inputmode="numeric" placeholder="0"><span class="fhint">run supplies</span></label>
  </div>
  <div id="bank-body"></div>
</section>

<section class="card hide" id="scp-card">
  <h2>Super combat chain</h2>
  <div id="scp-body"></div>
</section>

<section class="card">
  <h2>Paste</h2>
  <div class="grid3">
    <label class="field"><span class="flabel">Mox paste already banked</span>
      <input id="paste-mox" inputmode="numeric" placeholder="0" style="border-bottom-color:var(--mox)"><span class="fhint">green</span></label>
    <label class="field"><span class="flabel">Aga paste already banked</span>
      <input id="paste-aga" inputmode="numeric" placeholder="0" style="border-bottom-color:var(--aga)"><span class="fhint">blue</span></label>
    <label class="field"><span class="flabel">Lye paste already banked</span>
      <input id="paste-lye" inputmode="numeric" placeholder="0" style="border-bottom-color:var(--lye)"><span class="fhint">red</span></label>
  </div>
  <div class="vials" id="vials"></div>
  <p class="foot" id="paste-foot"></p>
</section>

<section class="card result">
  <h2>What you get</h2>
  <div class="statrow">
    <div class="stat big accent"><span class="sv" id="s-xp">+0</span><span class="sl">Herblore xp</span></div>
    <div class="stat big"><span class="sv" id="s-level">60</span><span class="sl">level you land on</span></div>
    <div class="stat"><span class="sv" id="s-total">0</span><span class="sl">total xp after</span></div>
    <div class="stat"><span class="sv" id="s-next">0</span><span class="sl" id="s-nextlabel">xp to next</span></div>
  </div>
  <div class="bar"><div class="barfill" id="bar-fill"></div><span class="barlabel" id="bar-label"></span></div>
  <p class="foot" id="goal-foot"></p>

  <div class="split">
    <div><h3>Mixology</h3><div id="mix-lines"></div></div>
    <div><h3>Potions made</h3><div id="potion-lines"></div></div>
  </div>

  <div id="sec-block" class="hide">
    <h3 class="secheader">Secondaries to gather</h3>
    <div class="secs" id="secs"></div>
    <p class="foot" id="sec-foot"></p>
  </div>

  <div id="mile-block" class="hide">
    <h3 class="secheader">Unlocked along the way</h3>
    <div class="secs" id="miles"></div>
  </div>
</section>

<details class="how"><summary>How it\\'s worked out</summary><p>
  Order xp is modelled on the wiki's order weights for every base you have unlocked, and the sim re-checks your level
  as xp comes in, so unlocking Mixalot mid-grind is accounted for. Multi-step potions (stamina, extended antifire,
  divine, sanfew) are not modelled. Goggles also save the toadflax in antidote+ (unf) and the irit in antidote++ (unf),
  which is not counted here.
</p></details>
`,Ve=[{id:"guam",name:"Guam leaf",paste:"mox",qty:10},{id:"marrentill",name:"Marrentill",paste:"mox",qty:13},{id:"tarromin",name:"Tarromin",paste:"mox",qty:15},{id:"harralander",name:"Harralander",paste:"mox",qty:20},{id:"ranarr",name:"Ranarr weed",paste:"lye",qty:26},{id:"toadflax",name:"Toadflax",paste:"lye",qty:32},{id:"irit",name:"Irit leaf",paste:"aga",qty:30},{id:"avantoe",name:"Avantoe",paste:"lye",qty:30},{id:"kwuarm",name:"Kwuarm",paste:"lye",qty:33},{id:"huasca",name:"Huasca",paste:"aga",qty:20},{id:"snapdragon",name:"Snapdragon",paste:"lye",qty:40},{id:"cadantine",name:"Cadantine",paste:"aga",qty:34},{id:"lantadyme",name:"Lantadyme",paste:"aga",qty:40},{id:"dwarfweed",name:"Dwarf weed",paste:"aga",qty:42},{id:"torstol",name:"Torstol",paste:"aga",qty:44}],Ze={guam:[{id:"attack",name:"Attack potion",lvl:3,xp:25,sec:[{name:"Eye of newt",qty:1,save:!0}]},{id:"guamtar",name:"Guam tar",lvl:19,xp:30,sec:[{name:"Swamp tar",qty:15,save:!1}]}],marrentill:[{id:"antipoison",name:"Antipoison",lvl:5,xp:37.5,sec:[{name:"Unicorn horn dust",qty:1,save:!0}]},{id:"marrtar",name:"Marrentill tar",lvl:31,xp:42.5,sec:[{name:"Swamp tar",qty:15,save:!1}]}],tarromin:[{id:"strength",name:"Strength potion",lvl:12,xp:50,sec:[{name:"Limpwurt root",qty:1,save:!0}]},{id:"serum",name:"Serum 207",lvl:15,xp:50,sec:[{name:"Ashes",qty:1,save:!1}]},{id:"tarrtar",name:"Tarromin tar",lvl:39,xp:55,sec:[{name:"Swamp tar",qty:15,save:!1}]}],harralander:[{id:"compost",name:"Compost potion",lvl:21,xp:60,sec:[{name:"Volcanic ash",qty:1,save:!0}]},{id:"restore",name:"Restore potion",lvl:22,xp:62.5,sec:[{name:"Red spiders' eggs",qty:1,save:!0}]},{id:"energy",name:"Energy potion",lvl:26,xp:67.5,sec:[{name:"Chocolate dust",qty:1,save:!0}]},{id:"combat",name:"Combat potion",lvl:36,xp:84,sec:[{name:"Goat horn dust",qty:1,save:!0}]},{id:"harrtar",name:"Harralander tar",lvl:44,xp:72.5,sec:[{name:"Swamp tar",qty:15,save:!1}]}],ranarr:[{id:"defence",name:"Defence potion",lvl:30,xp:75,sec:[{name:"White berries",qty:1,save:!0}]},{id:"prayer",name:"Prayer potion",lvl:38,xp:87.5,sec:[{name:"Snape grass",qty:1,save:!0}]}],toadflax:[{id:"agility",name:"Agility potion",lvl:34,xp:80,sec:[{name:"Toad's legs",qty:1,save:!0}]},{id:"antidoteplus",name:"Antidote+",lvl:68,xp:155,sec:[{name:"Coconut milk",qty:1,save:!0},{name:"Yew roots",qty:1,save:!0}]},{id:"sarabrew",name:"Saradomin brew",lvl:81,xp:180,sec:[{name:"Crushed nest",qty:1,save:!0}]}],irit:[{id:"superattack",name:"Super attack",lvl:45,xp:100,sec:[{name:"Eye of newt",qty:1,save:!0}]},{id:"superantipoison",name:"Superantipoison",lvl:48,xp:106.3,sec:[{name:"Unicorn horn dust",qty:1,save:!0}]},{id:"antidotepp",name:"Antidote++",lvl:79,xp:177.5,sec:[{name:"Coconut milk",qty:1,save:!0},{name:"Magic roots",qty:1,save:!0}]}],avantoe:[{id:"fishing",name:"Fishing potion",lvl:50,xp:112.5,sec:[{name:"Snape grass",qty:1,save:!0}]},{id:"superenergy",name:"Super energy",lvl:52,xp:117.5,sec:[{name:"Mort myre fungus",qty:1,save:!0}]},{id:"hunter",name:"Hunter potion",lvl:53,xp:120,sec:[{name:"Kebbit teeth dust",qty:1,save:!0}]}],kwuarm:[{id:"superstrength",name:"Super strength",lvl:55,xp:125,sec:[{name:"Limpwurt root",qty:1,save:!0}]},{id:"weaponpoison",name:"Weapon poison",lvl:60,xp:137.5,sec:[{name:"Dragon scale dust",qty:1,save:!0}]}],huasca:[{id:"prayerregen",name:"Prayer regeneration",lvl:84,xp:132,sec:[{name:"Aldarium",qty:1,save:!0}]}],snapdragon:[{id:"superrestore",name:"Super restore",lvl:63,xp:142.5,sec:[{name:"Red spiders' eggs",qty:1,save:!0}]}],cadantine:[{id:"superdefence",name:"Super defence",lvl:66,xp:150,sec:[{name:"White berries",qty:1,save:!0}]}],lantadyme:[{id:"antifire",name:"Antifire potion",lvl:69,xp:157.5,sec:[{name:"Dragon scale dust",qty:1,save:!0}]},{id:"magic",name:"Magic potion",lvl:76,xp:172.5,sec:[{name:"Potato cactus",qty:1,save:!0}]}],dwarfweed:[{id:"ranging",name:"Ranging potion",lvl:72,xp:162.5,sec:[{name:"Wine of Zamorak",qty:1,save:!0}]}],torstol:[{id:"zamorakbrew",name:"Zamorak brew",lvl:78,xp:175,sec:[{name:"Jangerberries",qty:1,save:!0}]}]},$e=[{id:"MMM",name:"Mammoth-might mix",mox:30,aga:0,lye:0,xp:190,rm:20,ra:0,rl:0,lvl:60,w:5},{id:"AAA",name:"Alco-augmentator",mox:0,aga:30,lye:0,xp:190,rm:0,ra:20,rl:0,lvl:60,w:5},{id:"LLL",name:"Liplack liquor",mox:0,aga:0,lye:30,xp:190,rm:0,ra:0,rl:20,lvl:60,w:5},{id:"MMA",name:"Mystic mana amalgam",mox:20,aga:10,lye:0,xp:215,rm:20,ra:10,rl:0,lvl:63,w:4},{id:"MML",name:"Marley's moonlight",mox:20,aga:0,lye:10,xp:240,rm:20,ra:0,rl:10,lvl:66,w:4},{id:"AAM",name:"Azure aura mix",mox:10,aga:20,lye:0,xp:265,rm:10,ra:20,rl:0,lvl:69,w:4},{id:"ALA",name:"Aqualux amalgam",mox:0,aga:20,lye:10,xp:290,rm:0,ra:20,rl:10,lvl:72,w:4},{id:"MLL",name:"Megalite liquid",mox:10,aga:0,lye:20,xp:315,rm:10,ra:0,rl:20,lvl:75,w:4},{id:"ALL",name:"Anti-leech lotion",mox:0,aga:10,lye:20,xp:340,rm:0,ra:10,rl:20,lvl:78,w:4},{id:"MAL",name:"Mixalot",mox:10,aga:10,lye:10,xp:365,rm:20,ra:20,rl:20,lvl:81,w:3}],Je={guam:"paste",marrentill:"paste",tarromin:"paste",harralander:"paste",ranarr:"prayer",toadflax:"sarabrew",irit:"superattack",avantoe:"superenergy",kwuarm:"superstrength",huasca:"paste",snapdragon:"superrestore",cadantine:"superdefence",lantadyme:"antifire",dwarfweed:"ranging",torstol:"zamorakbrew"},me={HERBS:Ve,POTIONS:Ze,BASES:$e,RECOMMENDED:Je};function Ke(){var Pe=(function(){for(var e=[0,0],l=0,o=1;o<126;o++)l+=Math.floor(o+300*Math.pow(2,o/7)),e[o+1]=Math.floor(l/4);return e})();function U(e){return Pe[Math.max(1,Math.min(126,e))]||0}function _(e){for(var l=126;l>=1;l--)if(e>=Pe[l])return l;return 1}var V=2e8,Ce=me.HERBS,ve=me.POTIONS,le=me.BASES,Te=me.RECOMMENDED,T={mox:{label:"Mox",colour:"green",css:"var(--mox)"},aga:{label:"Aga",colour:"blue",css:"var(--aga)"},lye:{label:"Lye",colour:"red",css:"var(--lye)"}};function c(e){var l=parseFloat(String(e).replace(/[^0-9.\-]/g,""));return isFinite(l)&&l>0?l:0}function s(e,l){l=l||0;var o=Math.pow(10,l);return(Math.round(e*o)/o).toLocaleString("en-GB",{minimumFractionDigits:l,maximumFractionDigits:l})}function a(e){return document.getElementById(e)}function G(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Z(e){return e.getAttribute("aria-pressed")==="true"}function u(e,l,o){return o=o||{},'<div class="line'+(o.sub?" sub":"")+(o.strong?" strong":"")+'"><span>'+G(e)+'</span><span class="mono"'+(o.c?' style="color:'+o.c+'"':"")+">"+l+"</span></div>"}var O=[];(function(){var l=a("herb-rows");Ce.forEach(function(i){var d=document.createElement("tr"),B='<option value="paste">Refine to '+T[i.paste].label+" paste</option>";(ve[i.id]||[]).forEach(function(S){B+='<option value="'+S.id+'">'+G(S.name)+" (lvl "+S.lvl+")</option>"}),B+='<option value="keep">Leave in the bank</option>',d.innerHTML='<td class="l herbname"><span class="dot" style="background:'+T[i.paste].css+'"></span>'+G(i.name)+'<span class="pasteqty">'+i.qty+" "+T[i.paste].label.toLowerCase()+'</span></td><td><input inputmode="numeric" placeholder="0"></td><td><input inputmode="numeric" placeholder="0"></td><td class="mono">-</td><td class="mono held">-</td><td class="l"><select>'+B+'</select><span class="lock hide"></span></td><td class="r mono out">-</td>',l.appendChild(d);var F=d.querySelectorAll("input"),L={herb:i,tr:d,seeds:F[0],stock:F[1],total:d.children[3],held:d.children[4],select:d.querySelector("select"),lock:d.querySelector(".lock"),out:d.children[6]};L.select.value=Te[i.id],[L.seeds,L.stock].forEach(function(S){S.addEventListener("input",A)}),L.select.addEventListener("change",A),O.push(L)});var o=a("vials");["mox","aga","lye"].forEach(function(i){var d=document.createElement("div");d.className="vial",d.innerHTML='<div class="tube"><div class="capline"><span>hopper 3,000</span></div><div class="fill" style="background:'+T[i].css+'"></div></div><div class="vlabel"><strong style="color:'+T[i].css+'">0</strong><span>'+T[i].label+" &middot; "+T[i].colour+'</span><span class="tiny">0 hopper fills</span></div>',o.appendChild(d),d.refs={fill:d.querySelector(".fill"),cap:d.querySelector(".capline"),val:d.querySelector("strong"),tiny:d.querySelector(".tiny")}})})();function Ge(){var e=Math.min(V,c(a("xp").value)),l=_(e),o=c(a("yield").value),i=Z(a("t-goggles")),d=Z(a("t-scp")),B=Z(a("t-triple")),F=Z(a("t-cleanup")),L=a("amulet").value,S=a("strategy").value,I=c(a("speedxp").value),f={};O.forEach(function(n){f[n.herb.id]=c(n.seeds.value)*o+c(n.stock.value)});var g=3+(L==="alch"?.15:L==="chem"?.05:0),m=4/g,Y=i?.9:1,q={att:c(a("bk-att").value),str:c(a("bk-str").value),def:c(a("bk-def").value),shard:c(a("bk-shard").value),dust:c(a("bk-dust").value),amyl:c(a("bk-amyl").value),energy:c(a("bk-energy").value),senergy:c(a("bk-senergy").value),stam:c(a("bk-stam").value)},t={att:Math.floor(q.att/4),str:Math.floor(q.str/4),def:Math.floor(q.def/4)},r={made:0,supers:0,torstol:0,irit:0,kwuarm:0,cadantine:0,xp:0,limiter:"",fromBank:0,fromHerbs:0,usedBank:{att:0,str:0,def:0}};if(d){var p=function(n,w){return n+w/m},h=Math.min(f.torstol/Y,p(t.att,f.irit),p(t.str,f.kwuarm),p(t.def,f.cadantine)),v=c(a("scptarget").value);v>0&&(h=Math.min(h,v)),r.made=Math.max(0,Math.floor(h));var x=function(n){return Math.max(0,r.made-n)},H=x(t.att),b=x(t.str),R=x(t.def);r.usedBank={att:Math.min(t.att,r.made)*4,str:Math.min(t.str,r.made)*4,def:Math.min(t.def,r.made)*4},r.fromBank=Math.min(t.att,t.str,t.def,r.made),r.fromHerbs=r.made-r.fromBank,r.supers=(H+b+R)*m/3,r.torstol=Math.ceil(r.made*Y),r.irit=Math.ceil(H*m),r.kwuarm=Math.ceil(b*m),r.cadantine=Math.ceil(R*m),r.xp=H*m*100+b*m*125+R*m*150+r.made*150;var $=Math.min(p(t.att,f.irit),p(t.str,f.kwuarm),p(t.def,f.cadantine));r.limiter=f.torstol/Y<=$?"Torstol":"Irit / Kwuarm / Cadantine"}var j=q.dust+q.shard*10,E={doses:Math.min(j,r.made*4),pots:0,xp:0,dustLeft:0};E.pots=E.doses/4,E.xp=E.doses*.5,E.dustLeft=j-E.doses;var ie={doses:Math.min(q.amyl,q.senergy),xp:0};ie.xp=ie.doses*(76.5/4);var Xe={torstol:r.torstol,irit:r.irit,kwuarm:r.kwuarm,cadantine:r.cadantine},he={};Ce.forEach(function(n){he[n.id]=Math.max(0,f[n.id]-(Xe[n.id]||0))});var N={mox:c(a("paste-mox").value),aga:c(a("paste-aga").value),lye:c(a("paste-lye").value)},fe=0,ge=0,Be=0,Re=[],be={};function oe(n,w){be[n]=(be[n]||0)+w}if(O.forEach(function(n){var w=n.herb,y=he[w.id];if(n.route=n.select.value,!(y<=0)){if(n.route==="paste")N[w.paste]+=y*w.qty,fe+=y;else if(n.route!=="keep"){for(var re=null,Ae=ve[w.id]||[],ue=0;ue<Ae.length;ue++)Ae[ue].id===n.route&&(re=Ae[ue]);if(!re)return;Re.push({herb:w,potion:re,count:y}),ge+=y*re.xp,Be+=y,re.sec.forEach(function(He){oe(He.name,y*He.qty*(i&&He.save?.9:1))})}}}),r.made>0){var ye=i?.9:1;oe("Eye of newt",r.supers*ye),oe("Limpwurt root",r.supers*ye),oe("White berries",r.supers*ye)}for(var De=fe*6,Ie=Be+Math.ceil(r.supers)*3,de={mox:N.mox,aga:N.aga,lye:N.lye},J=N.mox,K=N.aga,Q=N.lye,k=Math.min(V,e+De+ge+r.xp+E.xp+ie.xp),pe=0,xe=0,Oe=0,Ye=0,M={mox:0,aga:0,lye:0};Ye++<400;){var W=_(k);if(W<60)break;var ke=le.filter(function(n){return n.lvl<=W});if(S==="mixalot"){var Fe=le.filter(function(n){return n.id==="MAL"&&n.lvl<=W});Fe.length&&(ke=Fe)}if(!ke.length)break;var D=0,ee=0,ae=0,se=0,z=0,Me=0,we=0,Le=0;ke.forEach(function(n){D+=n.w,ee+=n.w*n.mox,ae+=n.w*n.aga,se+=n.w*n.lye,z+=n.w*n.xp,Me+=n.w*n.rm,we+=n.w*n.ra,Le+=n.w*n.rl}),ee/=D,ae/=D,se/=D,Me/=D,we/=D,Le/=D,z=z/D+I;var P=1/0;if(ee>0&&(P=Math.min(P,J/ee)),ae>0&&(P=Math.min(P,K/ae)),se>0&&(P=Math.min(P,Q/se)),!isFinite(P)||P<1)break;var Ne=1/0;W<126&&(Ne=Math.ceil((U(W+1)-k)/z));var C=Math.max(1,Math.floor(Math.min(P,Math.max(1,Ne))));J-=C*ee,K-=C*ae,Q-=C*se,pe+=C,xe+=C*z,k=Math.min(V,k+C*z),M.mox+=C*Me,M.aga+=C*we,M.lye+=C*Le}if(F&&_(k)>=60){var Se=function(n,w){var y=Math.floor(n/30);return y<=0?0:(Oe+=y,pe+=y,xe+=y*(190+I),k=Math.min(V,k+y*(190+I)),M[w]+=y*20,y*30)};J-=Se(J,"mox"),K-=Se(K,"aga"),Q-=Se(Q,"lye")}var te=c(a("digweed").value),qe=0;if(te>0&&pe>0){var je=_(k),ne=le.filter(function(n){return n.lvl<=je}).sort(function(n,w){return w.xp-n.xp})[0];ne&&(qe=te*ne.xp,k=Math.min(V,k+qe),M.mox+=te*ne.rm,M.aga+=te*ne.ra,M.lye+=te*ne.rl)}B&&(M.mox*=1.4,M.aga*=1.4,M.lye*=1.4);var ce={mox:Math.max(0,J),aga:Math.max(0,K),lye:Math.max(0,Q)},ze=de.mox-ce.mox+(de.aga-ce.aga)+(de.lye-ce.lye),Ee=Math.max(1,Math.min(126,Math.round(c(a("goal").value))||99));return{startXp:e,startLevel:l,totals:f,free:he,reserved:Xe,scp:r,herbsPerSuper:m,dosesPer:g,goggles:i,scpOn:d,bank:q,haveSup:t,divine:E,stamina:ie,dustTotal:j,startLevel:l,startPaste:de,refinedHerbs:fe,refineXp:De,potionRows:Re,potionXp:ge,secondaries:be,vials:Ie,mixPotions:pe,mixXp:xe,cleanupPotions:Oe,digXp:qe,resin:M,leftover:ce,pasteSpent:Math.max(0,ze),endXp:k,endLevel:_(k),totalXp:k-e,goal:Ee,goalXp:U(Ee),goalRemaining:Math.max(0,U(Ee)-k),aldarium:Math.floor(Math.min(M.mox/80,M.aga/60,M.lye/90))}}function A(){var e=Ge();a("hdr-level").textContent=e.endLevel>99?99:e.endLevel,a("hdr-cap").textContent=e.endLevel>99?"virtual "+e.endLevel:"from "+e.startLevel,a("xp-hint").textContent="Level "+e.startLevel,a("goal-hint").textContent=s(e.goalXp)+" xp",a("amulet-hint").textContent=s(e.dosesPer,2)+" doses per potion",a("warn-60").classList.toggle("hide",e.startLevel>=60);var l=0;if(O.forEach(function(t){var r=t.herb,p=e.totals[r.id],h=e.reserved[r.id]||0,v=e.free[r.id];l+=p,t.tr.classList.toggle("live",p>0),t.total.textContent=p?s(p):"-",t.held.textContent=h?s(h):"-";for(var x=null,H=ve[r.id]||[],b=0;b<H.length;b++)H[b].id===t.select.value&&(x=H[b]);var R=x&&e.startLevel<x.lvl;t.lock.classList.toggle("hide",!R),R&&(t.lock.textContent="needs "+x.lvl),t.out.textContent=v<=0?"-":t.select.value==="paste"?s(v*r.qty)+" "+T[r.paste].label.toLowerCase():t.select.value==="keep"?s(v)+" kept":s(v)+" × "+(x?x.name.toLowerCase():"")}),a("herb-foot").innerHTML=s(l)+" herbs total. Held back = pulled out for the super combat chain before anything else happens.",(function(){var t=e.bank,r=e.haveSup,p=e.divine,h=e.stamina,v="";function x(R,$,j){var E=a(R);E&&(E.innerHTML=$>0?s($)+" full potion"+($===1?"":"s")+(j>0?" &middot; "+s(j)+" doses used":""):"&mdash;")}x("bk-att-h",r.att,e.scp.usedBank.att),x("bk-str-h",r.str,e.scp.usedBank.str),x("bk-def-h",r.def,e.scp.usedBank.def);var H=t.att||t.str||t.def||t.shard||t.dust||t.amyl||t.energy||t.senergy||t.stam;if(!H){a("bank-body").innerHTML='<p class="empty">Nothing entered yet. Anything you list here is used before your herbs are.</p>';return}v+='<div class="statrow" style="margin-top:16px">',v+=X(s(e.scp.fromBank),"super combats off bank stock",!0,!1),v+=X(s(e.scp.fromHerbs),"still made from herbs"),e.dustTotal>0&&(v+=X(s(p.pots%1?p.pots.toFixed(2):p.pots),"divine super combat (4)",!1,!0)),h.doses>0&&(v+=X(s(h.doses),"stamina doses you can mix")),v+="</div>";var b=[];e.scp.fromBank>0&&b.push("Bank supers covered <strong>"+s(e.scp.fromBank)+"</strong> super combats, so that many irit, kwuarm and cadantine never get touched."),e.dustTotal>0&&b.push("You hold <strong>"+s(e.dustTotal)+"</strong> crystal dust (shards crush 10 each). Divine takes one per dose, so "+s(p.doses)+" doses go divine and "+s(p.dustLeft)+" dust is left over."+(e.startLevel<97?" <strong>Divine needs 97 Herblore</strong> and you are "+e.startLevel+".":"")),h.doses>0&&b.push("Amylase on super energy makes <strong>"+s(h.doses)+"</strong> stamina doses at 77 Herblore."),(t.energy||t.stam)&&b.push("Run supplies on hand: "+s(t.energy)+" energy and "+s(t.stam)+" stamina doses."),b.length&&(v+='<p class="foot">'+b.join(" ")+"</p>"),a("bank-body").innerHTML=v})(),a("scp-card").classList.toggle("hide",!e.scpOn),e.scpOn)if(e.scp.made>0){var o=e.startLevel<90?'<p class="warn">Super combats need 90 Herblore. You are '+(90-e.startLevel)+" levels short right now.</p>":"";a("scp-body").innerHTML='<div class="statrow">'+X(s(e.scp.made),"super combat (4)",!0,!1)+X(s(e.scp.torstol),"torstol used")+X(s(e.scp.irit)+" / "+s(e.scp.kwuarm)+" / "+s(e.scp.cadantine),"irit / kwuarm / cadantine")+X(s(e.scp.xp),"xp from the whole chain",!1,!0)+'</div><p class="foot">A super combat wants 4 doses of each super, so one torstol pulls roughly '+s(e.herbsPerSuper,2)+" of each herb behind it. "+(e.goggles?"Goggles save the torstol 10% of the time, so 0.9 torstol per potion. ":"")+"Your bottleneck: <strong>"+e.scp.limiter+"</strong>.</p>"+o}else a("scp-body").innerHTML='<p class="empty">Add torstol plus irit, kwuarm and cadantine and the chain fills itself in.</p>';var i=Math.max(1,e.startPaste.mox,e.startPaste.aga,e.startPaste.lye),d=a("vials").children;["mox","aga","lye"].forEach(function(t,r){var p=e.startPaste[t],h=d[r].refs;h.fill.style.height=Math.min(100,p/i*100)+"%",h.val.textContent=s(p);var v=Math.ceil(p/3e3)||0;h.tiny.textContent=v+" hopper fill"+(v===1?"":"s"),i>3e3?(h.cap.style.display="block",h.cap.style.bottom=Math.min(100,3e3/i*100)+"%"):h.cap.style.display="none"});var B=e.startPaste.mox+e.startPaste.aga+e.startPaste.lye;a("paste-foot").innerHTML=B>0?s(B)+" paste in hand. Refining these herbs alone pays <strong>"+s(e.refineXp)+" xp</strong> before you mix anything.":"",a("s-xp").textContent="+"+s(e.totalXp),a("s-level").textContent=e.endLevel>99?"99 (+"+(e.endLevel-99)+")":e.endLevel,a("s-total").textContent=s(e.endXp);var F=Math.min(126,e.endLevel+1),L=U(e.endLevel),S=U(F);a("s-next").textContent=e.endLevel>=126?"-":s(S-e.endXp),a("s-nextlabel").textContent="xp to "+F;var I=S>L?Math.min(100,(e.endXp-L)/(S-L)*100):100;a("bar-fill").style.width=I+"%",a("bar-label").textContent=s(I,1)+"% through level "+e.endLevel;var f=a("goal-foot");e.goalRemaining>0?(f.className="foot",f.innerHTML="Level "+e.goal+" is another <strong>"+s(e.goalRemaining)+" xp</strong> past where this lands you."):(f.className="foot good",f.innerHTML="This clears level "+e.goal+" with "+s(e.endXp-e.goalXp)+" xp to spare.");var g="";g+=u("Herbs refined",s(e.refinedHerbs)),g+=u("Refining xp (6 each)",s(e.refineXp)),g+=u("Potion bases mixed",s(e.mixPotions)),e.cleanupPotions>0&&(g+=u("of which leftover burns",s(e.cleanupPotions),{sub:!0})),g+=u("Mixing xp",s(e.mixXp)),g+=u("Xp per paste",e.pasteSpent>0?s(e.mixXp/e.pasteSpent,2):"-",{sub:!0}),e.digXp>0&&(g+=u("Digweed xp",s(e.digXp))),g+=u("Mox resin",s(e.resin.mox),{c:"var(--mox)"}),g+=u("Aga resin",s(e.resin.aga),{c:"var(--aga)"}),g+=u("Lye resin",s(e.resin.lye),{c:"var(--lye)"}),g+=u("Aldarium affordable",s(e.aldarium),{strong:!0}),g+=u("Paste left stranded",s(e.leftover.mox)+" / "+s(e.leftover.aga)+" / "+s(e.leftover.lye),{sub:!0}),a("mix-lines").innerHTML=g;var m="";e.scp.made>0&&(m+=u("Super combat (4)",s(e.scp.made),{strong:!0})),e.scp.fromBank>0&&(m+=u("&nbsp;&nbsp;of which from bank supers",s(e.scp.fromBank))),e.divine.doses>0&&(m+=u("Divine super combat doses",s(e.divine.doses))),e.stamina.doses>0&&(m+=u("Stamina doses",s(e.stamina.doses))),e.potionRows.length===0&&e.scp.made===0&&(m+='<p class="empty">Everything is going to paste.</p>'),e.potionRows.forEach(function(t){m+=u(t.potion.name,s(t.count))}),m+=u("Potion xp (incl. supers)",s(e.potionXp+e.scp.xp+e.divine.xp+e.stamina.xp),{strong:!0}),m+=u("Vials of water",s(e.vials),{sub:!0}),a("potion-lines").innerHTML=m;var Y=Object.keys(e.secondaries).sort(function(t,r){return e.secondaries[r]-e.secondaries[t]});a("sec-block").classList.toggle("hide",Y.length===0),a("secs").innerHTML=Y.map(function(t){return'<span class="sec"><strong>'+s(Math.ceil(e.secondaries[t]))+"</strong> "+G(t)+"</span>"}).join(""),a("sec-foot").textContent=e.goggles?"Savable secondaries already have the goggles' 10% shaved off.":"";var q=le.filter(function(t){return t.lvl>e.startLevel&&t.lvl<=e.endLevel});a("mile-block").classList.toggle("hide",q.length===0),a("miles").innerHTML=q.map(function(t){return'<span class="sec"><strong>'+t.lvl+"</strong> "+G(t.name)+"</span>"}).join("")}function X(e,l,o,i){return'<div class="stat'+(o?" big":"")+(i?" accent":"")+'"><span class="sv">'+e+'</span><span class="sl">'+G(l)+"</span></div>"}["xp","yield","goal","speedxp","digweed","scptarget","paste-mox","paste-aga","paste-lye","bk-att","bk-str","bk-def","bk-shard","bk-dust","bk-amyl","bk-energy","bk-senergy","bk-stam"].forEach(function(e){a(e).addEventListener("input",A)}),["amulet","strategy"].forEach(function(e){a(e).addEventListener("change",A)}),["t-goggles","t-scp","t-triple","t-cleanup"].forEach(function(e){a(e).addEventListener("click",function(){this.setAttribute("aria-pressed",Z(this)?"false":"true"),A()})}),a("adv-toggle").addEventListener("click",function(){var e=a("adv"),l=e.classList.toggle("hide");this.textContent=l?"Show extras":"Hide extras"}),a("b-paste").addEventListener("click",function(){O.forEach(function(e){e.select.value="paste"}),A()}),a("b-rec").addEventListener("click",function(){O.forEach(function(e){e.select.value=Te[e.herb.id]}),A()}),a("b-clear").addEventListener("click",function(){O.forEach(function(e){e.seeds.value="",e.stock.value=""}),A()}),A()}const ea="Seeds and bank herbs into paste, potions and resin",aa=["<b>60</b> Herblore for Mixology"],sa=`<div id="view-mixology" class="legacy">${_e}</div>`;function ta(){Ke(),Ue({xp:"herblore"})}export{sa as html,ta as mount,aa as reqs,ea as subtitle};
