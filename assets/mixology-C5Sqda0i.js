import{f as _e}from"./legacy-m-yHzgrc.js";import{f as Ve,b as Ze}from"./app-KCR0G2o4.js";import{h as $e}from"./herbs-DHo3Ndt3.js";const Je=`<div class="hide" aria-hidden="true"><span id="hdr-level"></span><span id="hdr-cap"></span></div>

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
`,Ke=[{id:"guam",name:"Guam leaf",paste:"mox",qty:10},{id:"marrentill",name:"Marrentill",paste:"mox",qty:13},{id:"tarromin",name:"Tarromin",paste:"mox",qty:15},{id:"harralander",name:"Harralander",paste:"mox",qty:20},{id:"ranarr",name:"Ranarr weed",paste:"lye",qty:26},{id:"toadflax",name:"Toadflax",paste:"lye",qty:32},{id:"irit",name:"Irit leaf",paste:"aga",qty:30},{id:"avantoe",name:"Avantoe",paste:"lye",qty:30},{id:"kwuarm",name:"Kwuarm",paste:"lye",qty:33},{id:"huasca",name:"Huasca",paste:"aga",qty:20},{id:"snapdragon",name:"Snapdragon",paste:"lye",qty:40},{id:"cadantine",name:"Cadantine",paste:"aga",qty:34},{id:"lantadyme",name:"Lantadyme",paste:"aga",qty:40},{id:"dwarfweed",name:"Dwarf weed",paste:"aga",qty:42},{id:"torstol",name:"Torstol",paste:"aga",qty:44}],We={guam:[{id:"attack",name:"Attack potion",lvl:3,xp:25,sec:[{name:"Eye of newt",qty:1,save:!0}]},{id:"guamtar",name:"Guam tar",lvl:19,xp:30,sec:[{name:"Swamp tar",qty:15,save:!1}]}],marrentill:[{id:"antipoison",name:"Antipoison",lvl:5,xp:37.5,sec:[{name:"Unicorn horn dust",qty:1,save:!0}]},{id:"marrtar",name:"Marrentill tar",lvl:31,xp:42.5,sec:[{name:"Swamp tar",qty:15,save:!1}]}],tarromin:[{id:"strength",name:"Strength potion",lvl:12,xp:50,sec:[{name:"Limpwurt root",qty:1,save:!0}]},{id:"serum",name:"Serum 207",lvl:15,xp:50,sec:[{name:"Ashes",qty:1,save:!1}]},{id:"tarrtar",name:"Tarromin tar",lvl:39,xp:55,sec:[{name:"Swamp tar",qty:15,save:!1}]}],harralander:[{id:"compost",name:"Compost potion",lvl:21,xp:60,sec:[{name:"Volcanic ash",qty:1,save:!0}]},{id:"restore",name:"Restore potion",lvl:22,xp:62.5,sec:[{name:"Red spiders' eggs",qty:1,save:!0}]},{id:"energy",name:"Energy potion",lvl:26,xp:67.5,sec:[{name:"Chocolate dust",qty:1,save:!0}]},{id:"combat",name:"Combat potion",lvl:36,xp:84,sec:[{name:"Goat horn dust",qty:1,save:!0}]},{id:"harrtar",name:"Harralander tar",lvl:44,xp:72.5,sec:[{name:"Swamp tar",qty:15,save:!1}]}],ranarr:[{id:"defence",name:"Defence potion",lvl:30,xp:75,sec:[{name:"White berries",qty:1,save:!0}]},{id:"prayer",name:"Prayer potion",lvl:38,xp:87.5,sec:[{name:"Snape grass",qty:1,save:!0}]}],toadflax:[{id:"agility",name:"Agility potion",lvl:34,xp:80,sec:[{name:"Toad's legs",qty:1,save:!0}]},{id:"antidoteplus",name:"Antidote+",lvl:68,xp:155,sec:[{name:"Coconut milk",qty:1,save:!0},{name:"Yew roots",qty:1,save:!0}]},{id:"sarabrew",name:"Saradomin brew",lvl:81,xp:180,sec:[{name:"Crushed nest",qty:1,save:!0}]}],irit:[{id:"superattack",name:"Super attack",lvl:45,xp:100,sec:[{name:"Eye of newt",qty:1,save:!0}]},{id:"superantipoison",name:"Superantipoison",lvl:48,xp:106.3,sec:[{name:"Unicorn horn dust",qty:1,save:!0}]},{id:"antidotepp",name:"Antidote++",lvl:79,xp:177.5,sec:[{name:"Coconut milk",qty:1,save:!0},{name:"Magic roots",qty:1,save:!0}]}],avantoe:[{id:"fishing",name:"Fishing potion",lvl:50,xp:112.5,sec:[{name:"Snape grass",qty:1,save:!0}]},{id:"superenergy",name:"Super energy",lvl:52,xp:117.5,sec:[{name:"Mort myre fungus",qty:1,save:!0}]},{id:"hunter",name:"Hunter potion",lvl:53,xp:120,sec:[{name:"Kebbit teeth dust",qty:1,save:!0}]}],kwuarm:[{id:"superstrength",name:"Super strength",lvl:55,xp:125,sec:[{name:"Limpwurt root",qty:1,save:!0}]},{id:"weaponpoison",name:"Weapon poison",lvl:60,xp:137.5,sec:[{name:"Dragon scale dust",qty:1,save:!0}]}],huasca:[{id:"prayerregen",name:"Prayer regeneration",lvl:84,xp:132,sec:[{name:"Aldarium",qty:1,save:!0}]}],snapdragon:[{id:"superrestore",name:"Super restore",lvl:63,xp:142.5,sec:[{name:"Red spiders' eggs",qty:1,save:!0}]}],cadantine:[{id:"superdefence",name:"Super defence",lvl:66,xp:150,sec:[{name:"White berries",qty:1,save:!0}]}],lantadyme:[{id:"antifire",name:"Antifire potion",lvl:69,xp:157.5,sec:[{name:"Dragon scale dust",qty:1,save:!0}]},{id:"magic",name:"Magic potion",lvl:76,xp:172.5,sec:[{name:"Potato cactus",qty:1,save:!0}]}],dwarfweed:[{id:"ranging",name:"Ranging potion",lvl:72,xp:162.5,sec:[{name:"Wine of Zamorak",qty:1,save:!0}]}],torstol:[{id:"zamorakbrew",name:"Zamorak brew",lvl:78,xp:175,sec:[{name:"Jangerberries",qty:1,save:!0}]}]},Qe=[{id:"MMM",name:"Mammoth-might mix",mox:30,aga:0,lye:0,xp:190,rm:20,ra:0,rl:0,lvl:60,w:5},{id:"AAA",name:"Alco-augmentator",mox:0,aga:30,lye:0,xp:190,rm:0,ra:20,rl:0,lvl:60,w:5},{id:"LLL",name:"Liplack liquor",mox:0,aga:0,lye:30,xp:190,rm:0,ra:0,rl:20,lvl:60,w:5},{id:"MMA",name:"Mystic mana amalgam",mox:20,aga:10,lye:0,xp:215,rm:20,ra:10,rl:0,lvl:63,w:4},{id:"MML",name:"Marley's moonlight",mox:20,aga:0,lye:10,xp:240,rm:20,ra:0,rl:10,lvl:66,w:4},{id:"AAM",name:"Azure aura mix",mox:10,aga:20,lye:0,xp:265,rm:10,ra:20,rl:0,lvl:69,w:4},{id:"ALA",name:"Aqualux amalgam",mox:0,aga:20,lye:10,xp:290,rm:0,ra:20,rl:10,lvl:72,w:4},{id:"MLL",name:"Megalite liquid",mox:10,aga:0,lye:20,xp:315,rm:10,ra:0,rl:20,lvl:75,w:4},{id:"ALL",name:"Anti-leech lotion",mox:0,aga:10,lye:20,xp:340,rm:0,ra:10,rl:20,lvl:78,w:4},{id:"MAL",name:"Mixalot",mox:10,aga:10,lye:10,xp:365,rm:20,ra:20,rl:20,lvl:81,w:3}],ea={guam:"paste",marrentill:"paste",tarromin:"paste",harralander:"paste",ranarr:"prayer",toadflax:"sarabrew",irit:"superattack",avantoe:"superenergy",kwuarm:"superstrength",huasca:"paste",snapdragon:"superrestore",cadantine:"superdefence",lantadyme:"antifire",dwarfweed:"ranging",torstol:"zamorakbrew"},ge={HERBS:Ke,POTIONS:We,BASES:Qe,RECOMMENDED:ea};function aa(){var B=(function(){for(var e=[0,0],l=0,d=1;d<126;d++)l+=Math.floor(d+300*Math.pow(2,d/7)),e[d+1]=Math.floor(l/4);return e})();function S(e){return B[Math.max(1,Math.min(126,e))]||0}function R(e){for(var l=126;l>=1;l--)if(e>=B[l])return l;return 1}var D=2e8,de=ge.HERBS,O=ge.POTIONS,U=ge.BASES,pe=ge.RECOMMENDED,q={mox:{label:"Mox",colour:"green",css:"var(--mox)"},aga:{label:"Aga",colour:"blue",css:"var(--aga)"},lye:{label:"Lye",colour:"red",css:"var(--lye)"}};function o(e){var l=parseFloat(String(e).replace(/[^0-9.\-]/g,""));return isFinite(l)&&l>0?l:0}function t(e,l){l=l||0;var d=Math.pow(10,l);return(Math.round(e*d)/d).toLocaleString("en-GB",{minimumFractionDigits:l,maximumFractionDigits:l})}function a(e){return document.getElementById(e)}function _(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function K(e){return e.getAttribute("aria-pressed")==="true"}function u(e,l,d){return d=d||{},'<div class="line'+(d.sub?" sub":"")+(d.strong?" strong":"")+'"><span>'+_(e)+'</span><span class="mono"'+(d.c?' style="color:'+d.c+'"':"")+">"+l+"</span></div>"}var j=[];(function(){var l=a("herb-rows");de.forEach(function(i){var p=document.createElement("tr"),N='<option value="paste">Refine to '+q[i.paste].label+" paste</option>";(O[i.id]||[]).forEach(function(E){N+='<option value="'+E.id+'">'+_(E.name)+" (lvl "+E.lvl+")</option>"}),N+='<option value="keep">Leave in the bank</option>',p.innerHTML='<td class="l herbname"><span class="dot" style="background:'+q[i.paste].css+'"></span>'+_(i.name)+'<span class="pasteqty">'+i.qty+" "+q[i.paste].label.toLowerCase()+'</span></td><td><input inputmode="numeric" placeholder="0"></td><td><input inputmode="numeric" placeholder="0"></td><td class="mono">-</td><td class="mono held">-</td><td class="l"><select>'+N+'</select><span class="lock hide"></span></td><td class="r mono out">-</td>',l.appendChild(p);var Y=p.querySelectorAll("input"),L={herb:i,tr:p,seeds:Y[0],stock:Y[1],total:p.children[3],held:p.children[4],select:p.querySelector("select"),lock:p.querySelector(".lock"),out:p.children[6]};L.select.value=pe[i.id],[L.seeds,L.stock].forEach(function(E){E.addEventListener("input",C)}),L.select.addEventListener("change",C),j.push(L)});var d=a("vials");["mox","aga","lye"].forEach(function(i){var p=document.createElement("div");p.className="vial",p.innerHTML='<div class="tube"><div class="capline"><span>hopper 3,000</span></div><div class="fill" style="background:'+q[i].css+'"></div></div><div class="vlabel"><strong style="color:'+q[i].css+'">0</strong><span>'+q[i].label+" &middot; "+q[i].colour+'</span><span class="tiny">0 hopper fills</span></div>',d.appendChild(p),p.refs={fill:p.querySelector(".fill"),cap:p.querySelector(".capline"),val:p.querySelector("strong"),tiny:p.querySelector(".tiny")}})})();function Ge(){var e=Math.min(D,o(a("xp").value)),l=R(e),d=o(a("yield").value),i=K(a("t-goggles")),p=K(a("t-scp")),N=K(a("t-triple")),Y=K(a("t-cleanup")),L=a("amulet").value,E=a("strategy").value,V=o(a("speedxp").value),f={};j.forEach(function(n){f[n.herb.id]=o(n.seeds.value)*d+o(n.stock.value)});var g=3+(L==="alch"?.15:L==="chem"?.05:0),m=4/g,Z=i?.9:1,A={att:o(a("bk-att").value),str:o(a("bk-str").value),def:o(a("bk-def").value),shard:o(a("bk-shard").value),dust:o(a("bk-dust").value),amyl:o(a("bk-amyl").value),energy:o(a("bk-energy").value),senergy:o(a("bk-senergy").value),stam:o(a("bk-stam").value)},s={att:Math.floor(A.att/4),str:Math.floor(A.str/4),def:Math.floor(A.def/4)},r={made:0,supers:0,torstol:0,irit:0,kwuarm:0,cadantine:0,xp:0,limiter:"",fromBank:0,fromHerbs:0,usedBank:{att:0,str:0,def:0}};if(p){var c=function(n,w){return n+w/m},h=Math.min(f.torstol/Z,c(s.att,f.irit),c(s.str,f.kwuarm),c(s.def,f.cadantine)),v=o(a("scptarget").value);v>0&&(h=Math.min(h,v)),r.made=Math.max(0,Math.floor(h));var x=function(n){return Math.max(0,r.made-n)},P=x(s.att),b=x(s.str),I=x(s.def);r.usedBank={att:Math.min(s.att,r.made)*4,str:Math.min(s.str,r.made)*4,def:Math.min(s.def,r.made)*4},r.fromBank=Math.min(s.att,s.str,s.def,r.made),r.fromHerbs=r.made-r.fromBank,r.supers=(P+b+I)*m/3,r.torstol=Math.ceil(r.made*Z),r.irit=Math.ceil(P*m),r.kwuarm=Math.ceil(b*m),r.cadantine=Math.ceil(I*m),r.xp=P*m*100+b*m*125+I*m*150+r.made*150;var W=Math.min(c(s.att,f.irit),c(s.str,f.kwuarm),c(s.def,f.cadantine));r.limiter=f.torstol/Z<=W?"Torstol":"Irit / Kwuarm / Cadantine"}var $=A.dust+A.shard*10,H={doses:Math.min($,r.made*4),pots:0,xp:0,dustLeft:0};H.pots=H.doses/4,H.xp=H.doses*.5,H.dustLeft=$-H.doses;var ce={doses:Math.min(A.amyl,A.senergy),xp:0};ce.xp=ce.doses*(76.5/4);var Xe={torstol:r.torstol,irit:r.irit,kwuarm:r.kwuarm,cadantine:r.cadantine},be={};de.forEach(function(n){be[n.id]=Math.max(0,f[n.id]-(Xe[n.id]||0))});var z={mox:o(a("paste-mox").value),aga:o(a("paste-aga").value),lye:o(a("paste-lye").value)},ye=0,xe=0,Be=0,Re=[],ke={};function ue(n,w){ke[n]=(ke[n]||0)+w}if(j.forEach(function(n){var w=n.herb,y=be[w.id];if(n.route=n.select.value,!(y<=0)){if(n.route==="paste")z[w.paste]+=y*w.qty,ye+=y;else if(n.route!=="keep"){for(var oe=null,Pe=O[w.id]||[],fe=0;fe<Pe.length;fe++)Pe[fe].id===n.route&&(oe=Pe[fe]);if(!oe)return;Re.push({herb:w,potion:oe,count:y}),xe+=y*oe.xp,Be+=y,oe.sec.forEach(function(Te){ue(Te.name,y*Te.qty*(i&&Te.save?.9:1))})}}}),r.made>0){var Me=i?.9:1;ue("Eye of newt",r.supers*Me),ue("Limpwurt root",r.supers*Me),ue("White berries",r.supers*Me)}for(var De=ye*6,je=Be+Math.ceil(r.supers)*3,me={mox:z.mox,aga:z.aga,lye:z.lye},Q=z.mox,ee=z.aga,ae=z.lye,k=Math.min(D,e+De+xe+r.xp+H.xp+ce.xp),ve=0,we=0,Oe=0,Ye=0,M={mox:0,aga:0,lye:0};Ye++<400;){var te=R(k);if(te<60)break;var Le=U.filter(function(n){return n.lvl<=te});if(E==="mixalot"){var Fe=U.filter(function(n){return n.id==="MAL"&&n.lvl<=te});Fe.length&&(Le=Fe)}if(!Le.length)break;var G=0,se=0,ne=0,re=0,J=0,Se=0,qe=0,Ee=0;Le.forEach(function(n){G+=n.w,se+=n.w*n.mox,ne+=n.w*n.aga,re+=n.w*n.lye,J+=n.w*n.xp,Se+=n.w*n.rm,qe+=n.w*n.ra,Ee+=n.w*n.rl}),se/=G,ne/=G,re/=G,Se/=G,qe/=G,Ee/=G,J=J/G+V;var T=1/0;if(se>0&&(T=Math.min(T,Q/se)),ne>0&&(T=Math.min(T,ee/ne)),re>0&&(T=Math.min(T,ae/re)),!isFinite(T)||T<1)break;var Ne=1/0;te<126&&(Ne=Math.ceil((S(te+1)-k)/J));var X=Math.max(1,Math.floor(Math.min(T,Math.max(1,Ne))));Q-=X*se,ee-=X*ne,ae-=X*re,ve+=X,we+=X*J,k=Math.min(D,k+X*J),M.mox+=X*Se,M.aga+=X*qe,M.lye+=X*Ee}if(Y&&R(k)>=60){var Ae=function(n,w){var y=Math.floor(n/30);return y<=0?0:(Oe+=y,ve+=y,we+=y*(190+V),k=Math.min(D,k+y*(190+V)),M[w]+=y*20,y*30)};Q-=Ae(Q,"mox"),ee-=Ae(ee,"aga"),ae-=Ae(ae,"lye")}var le=o(a("digweed").value),He=0;if(le>0&&ve>0){var ze=R(k),ie=U.filter(function(n){return n.lvl<=ze}).sort(function(n,w){return w.xp-n.xp})[0];ie&&(He=le*ie.xp,k=Math.min(D,k+He),M.mox+=le*ie.rm,M.aga+=le*ie.ra,M.lye+=le*ie.rl)}N&&(M.mox*=1.4,M.aga*=1.4,M.lye*=1.4);var he={mox:Math.max(0,Q),aga:Math.max(0,ee),lye:Math.max(0,ae)},Ue=me.mox-he.mox+(me.aga-he.aga)+(me.lye-he.lye),Ce=Math.max(1,Math.min(126,Math.round(o(a("goal").value))||99));return{startXp:e,startLevel:l,totals:f,free:be,reserved:Xe,scp:r,herbsPerSuper:m,dosesPer:g,goggles:i,scpOn:p,bank:A,haveSup:s,divine:H,stamina:ce,dustTotal:$,startLevel:l,startPaste:me,refinedHerbs:ye,refineXp:De,potionRows:Re,potionXp:xe,secondaries:ke,vials:je,mixPotions:ve,mixXp:we,cleanupPotions:Oe,digXp:He,resin:M,leftover:he,pasteSpent:Math.max(0,Ue),endXp:k,endLevel:R(k),totalXp:k-e,goal:Ce,goalXp:S(Ce),goalRemaining:Math.max(0,S(Ce)-k),aldarium:Math.floor(Math.min(M.mox/80,M.aga/60,M.lye/90))}}function C(){var e=Ge();a("hdr-level").textContent=e.endLevel>99?99:e.endLevel,a("hdr-cap").textContent=e.endLevel>99?"virtual "+e.endLevel:"from "+e.startLevel,a("xp-hint").textContent="Level "+e.startLevel,a("goal-hint").textContent=t(e.goalXp)+" xp",a("amulet-hint").textContent=t(e.dosesPer,2)+" doses per potion",a("warn-60").classList.toggle("hide",e.startLevel>=60);var l=0;if(j.forEach(function(s){var r=s.herb,c=e.totals[r.id],h=e.reserved[r.id]||0,v=e.free[r.id];l+=c,s.tr.classList.toggle("live",c>0),s.total.textContent=c?t(c):"-",s.held.textContent=h?t(h):"-";for(var x=null,P=O[r.id]||[],b=0;b<P.length;b++)P[b].id===s.select.value&&(x=P[b]);var I=x&&e.startLevel<x.lvl;s.lock.classList.toggle("hide",!I),I&&(s.lock.textContent="needs "+x.lvl),s.out.textContent=v<=0?"-":s.select.value==="paste"?t(v*r.qty)+" "+q[r.paste].label.toLowerCase():s.select.value==="keep"?t(v)+" kept":t(v)+" × "+(x?x.name.toLowerCase():"")}),a("herb-foot").innerHTML=t(l)+" herbs total. Held back = pulled out for the super combat chain before anything else happens.",(function(){var s=e.bank,r=e.haveSup,c=e.divine,h=e.stamina,v="";function x(I,W,$){var H=a(I);H&&(H.innerHTML=W>0?t(W)+" full potion"+(W===1?"":"s")+($>0?" &middot; "+t($)+" doses used":""):"&mdash;")}x("bk-att-h",r.att,e.scp.usedBank.att),x("bk-str-h",r.str,e.scp.usedBank.str),x("bk-def-h",r.def,e.scp.usedBank.def);var P=s.att||s.str||s.def||s.shard||s.dust||s.amyl||s.energy||s.senergy||s.stam;if(!P){a("bank-body").innerHTML='<p class="empty">Nothing entered yet. Anything you list here is used before your herbs are.</p>';return}v+='<div class="statrow" style="margin-top:16px">',v+=F(t(e.scp.fromBank),"super combats off bank stock",!0,!1),v+=F(t(e.scp.fromHerbs),"still made from herbs"),e.dustTotal>0&&(v+=F(t(c.pots%1?c.pots.toFixed(2):c.pots),"divine super combat (4)",!1,!0)),h.doses>0&&(v+=F(t(h.doses),"stamina doses you can mix")),v+="</div>";var b=[];e.scp.fromBank>0&&b.push("Bank supers covered <strong>"+t(e.scp.fromBank)+"</strong> super combats, so that many irit, kwuarm and cadantine never get touched."),e.dustTotal>0&&b.push("You hold <strong>"+t(e.dustTotal)+"</strong> crystal dust (shards crush 10 each). Divine takes one per dose, so "+t(c.doses)+" doses go divine and "+t(c.dustLeft)+" dust is left over."+(e.startLevel<97?" <strong>Divine needs 97 Herblore</strong> and you are "+e.startLevel+".":"")),h.doses>0&&b.push("Amylase on super energy makes <strong>"+t(h.doses)+"</strong> stamina doses at 77 Herblore."),(s.energy||s.stam)&&b.push("Run supplies on hand: "+t(s.energy)+" energy and "+t(s.stam)+" stamina doses."),b.length&&(v+='<p class="foot">'+b.join(" ")+"</p>"),a("bank-body").innerHTML=v})(),a("scp-card").classList.toggle("hide",!e.scpOn),e.scpOn)if(e.scp.made>0){var d=e.startLevel<90?'<p class="warn">Super combats need 90 Herblore. You are '+(90-e.startLevel)+" levels short right now.</p>":"";a("scp-body").innerHTML='<div class="statrow">'+F(t(e.scp.made),"super combat (4)",!0,!1)+F(t(e.scp.torstol),"torstol used")+F(t(e.scp.irit)+" / "+t(e.scp.kwuarm)+" / "+t(e.scp.cadantine),"irit / kwuarm / cadantine")+F(t(e.scp.xp),"xp from the whole chain",!1,!0)+'</div><p class="foot">A super combat wants 4 doses of each super, so one torstol pulls roughly '+t(e.herbsPerSuper,2)+" of each herb behind it. "+(e.goggles?"Goggles save the torstol 10% of the time, so 0.9 torstol per potion. ":"")+"Your bottleneck: <strong>"+e.scp.limiter+"</strong>.</p>"+d}else a("scp-body").innerHTML='<p class="empty">Add torstol plus irit, kwuarm and cadantine and the chain fills itself in.</p>';var i=Math.max(1,e.startPaste.mox,e.startPaste.aga,e.startPaste.lye),p=a("vials").children;["mox","aga","lye"].forEach(function(s,r){var c=e.startPaste[s],h=p[r].refs;h.fill.style.height=Math.min(100,c/i*100)+"%",h.val.textContent=t(c);var v=Math.ceil(c/3e3)||0;h.tiny.textContent=v+" hopper fill"+(v===1?"":"s"),i>3e3?(h.cap.style.display="block",h.cap.style.bottom=Math.min(100,3e3/i*100)+"%"):h.cap.style.display="none"});var N=e.startPaste.mox+e.startPaste.aga+e.startPaste.lye;a("paste-foot").innerHTML=N>0?t(N)+" paste in hand. Refining these herbs alone pays <strong>"+t(e.refineXp)+" xp</strong> before you mix anything.":"",a("s-xp").textContent="+"+t(e.totalXp),a("s-level").textContent=e.endLevel>99?"99 (+"+(e.endLevel-99)+")":e.endLevel,a("s-total").textContent=t(e.endXp);var Y=Math.min(126,e.endLevel+1),L=S(e.endLevel),E=S(Y);a("s-next").textContent=e.endLevel>=126?"-":t(E-e.endXp),a("s-nextlabel").textContent="xp to "+Y;var V=E>L?Math.min(100,(e.endXp-L)/(E-L)*100):100;a("bar-fill").style.width=V+"%",a("bar-label").textContent=t(V,1)+"% through level "+e.endLevel;var f=a("goal-foot");e.goalRemaining>0?(f.className="foot",f.innerHTML="Level "+e.goal+" is another <strong>"+t(e.goalRemaining)+" xp</strong> past where this lands you."):(f.className="foot good",f.innerHTML="This clears level "+e.goal+" with "+t(e.endXp-e.goalXp)+" xp to spare.");var g="";g+=u("Herbs refined",t(e.refinedHerbs)),g+=u("Refining xp (6 each)",t(e.refineXp)),g+=u("Potion bases mixed",t(e.mixPotions)),e.cleanupPotions>0&&(g+=u("of which leftover burns",t(e.cleanupPotions),{sub:!0})),g+=u("Mixing xp",t(e.mixXp)),g+=u("Xp per paste",e.pasteSpent>0?t(e.mixXp/e.pasteSpent,2):"-",{sub:!0}),e.digXp>0&&(g+=u("Digweed xp",t(e.digXp))),g+=u("Mox resin",t(e.resin.mox),{c:"var(--mox)"}),g+=u("Aga resin",t(e.resin.aga),{c:"var(--aga)"}),g+=u("Lye resin",t(e.resin.lye),{c:"var(--lye)"}),g+=u("Aldarium affordable",t(e.aldarium),{strong:!0}),g+=u("Paste left stranded",t(e.leftover.mox)+" / "+t(e.leftover.aga)+" / "+t(e.leftover.lye),{sub:!0}),a("mix-lines").innerHTML=g;var m="";e.scp.made>0&&(m+=u("Super combat (4)",t(e.scp.made),{strong:!0})),e.scp.fromBank>0&&(m+=u("&nbsp;&nbsp;of which from bank supers",t(e.scp.fromBank))),e.divine.doses>0&&(m+=u("Divine super combat doses",t(e.divine.doses))),e.stamina.doses>0&&(m+=u("Stamina doses",t(e.stamina.doses))),e.potionRows.length===0&&e.scp.made===0&&(m+='<p class="empty">Everything is going to paste.</p>'),e.potionRows.forEach(function(s){m+=u(s.potion.name,t(s.count))}),m+=u("Potion xp (incl. supers)",t(e.potionXp+e.scp.xp+e.divine.xp+e.stamina.xp),{strong:!0}),m+=u("Vials of water",t(e.vials),{sub:!0}),a("potion-lines").innerHTML=m;var Z=Object.keys(e.secondaries).sort(function(s,r){return e.secondaries[r]-e.secondaries[s]});a("sec-block").classList.toggle("hide",Z.length===0),a("secs").innerHTML=Z.map(function(s){return'<span class="sec"><strong>'+t(Math.ceil(e.secondaries[s]))+"</strong> "+_(s)+"</span>"}).join(""),a("sec-foot").textContent=e.goggles?"Savable secondaries already have the goggles' 10% shaved off.":"";var A=U.filter(function(s){return s.lvl>e.startLevel&&s.lvl<=e.endLevel});a("mile-block").classList.toggle("hide",A.length===0),a("miles").innerHTML=A.map(function(s){return'<span class="sec"><strong>'+s.lvl+"</strong> "+_(s.name)+"</span>"}).join("")}function F(e,l,d,i){return'<div class="stat'+(d?" big":"")+(i?" accent":"")+'"><span class="sv">'+e+'</span><span class="sl">'+_(l)+"</span></div>"}["xp","yield","goal","speedxp","digweed","scptarget","paste-mox","paste-aga","paste-lye","bk-att","bk-str","bk-def","bk-shard","bk-dust","bk-amyl","bk-energy","bk-senergy","bk-stam"].forEach(function(e){a(e).addEventListener("input",C)}),["amulet","strategy"].forEach(function(e){a(e).addEventListener("change",C)}),["t-goggles","t-scp","t-triple","t-cleanup"].forEach(function(e){a(e).addEventListener("click",function(){this.setAttribute("aria-pressed",K(this)?"false":"true"),C()})}),a("adv-toggle").addEventListener("click",function(){var e=a("adv"),l=e.classList.toggle("hide");this.textContent=l?"Show extras":"Hide extras"}),a("b-paste").addEventListener("click",function(){j.forEach(function(e){e.select.value="paste"}),C()}),a("b-rec").addEventListener("click",function(){j.forEach(function(e){e.select.value=pe[e.herb.id]}),C()}),a("b-clear").addEventListener("click",function(){j.forEach(function(e){e.seeds.value="",e.stock.value=""}),C()}),C()}function Ie(B,S){B.value=S||"",B.dispatchEvent(new Event("input",{bubbles:!0}))}const ra="Seeds and bank herbs into paste, potions and resin",la=["<b>60</b> Herblore for Mixology"],ia=`<div id="view-mixology" class="legacy">${Je}</div>`;function oa(){aa(),_e({xp:"herblore"});const B=document.getElementById("view-mixology");document.getElementById("b-clear").insertAdjacentHTML("beforebegin",Ve()),Ze(B,S=>{let R=0;for(const D of B.querySelectorAll("#herb-rows tr")){const de=D.querySelector(".herbname").textContent,O=$e.herbs.find(t=>de.startsWith(t.name));if(!O)continue;const[U,pe]=D.querySelectorAll("input"),q=S(O.seed),o=S(O.name)+S("Grimy "+O.name.toLowerCase());Ie(U,q),Ie(pe,o),R+=q+o}return R})}export{ia as html,oa as mount,la as reqs,ra as subtitle};
