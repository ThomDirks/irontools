import{f as ae}from"./legacy-CvrGhUVW.js";import"./app-Dyv7qYUi.js";const oe=`
<section class="card">
  <h2>What this run comes to</h2>
  <div class="statrow" id="sum"></div>
  <p class="foot" id="sum-note"></p>
</section>

<section class="card">
  <h2>Your Fletching</h2>
  <div class="grid g4">
    <div class="field"><label>Level</label><input id="vt-lvl" type="number" min="1" max="99" value="75"></div>
    <div class="field"><label>XP</label><input id="vt-xp" type="number" min="0" value="1210421"></div>
    <div class="field"><label>Goal</label>
      <select id="vt-goaltype">
        <option value="level">Level</option>
        <option value="xp">XP</option>
        <option value="logs">Use up my logs</option>
        <option value="offerings">Offerings</option>
        <option value="points">Research points</option>
      </select></div>
    <div class="field"><label>Target</label><input id="vt-goal" type="number" min="0" value="99"></div>
  </div>
  <p class="hint" id="vt-note" style="margin-top:9px"></p>
</section>

<section class="card">
  <h2>Logs and kit</h2>
  <div class="grid g3">
    <div class="field"><label>Log type</label><select id="vt-log"></select>
      <span class="hint" id="vt-logh"></span></div>
    <div class="field"><label>Logs in your bank</label><input id="vt-have" type="number" min="0" value="0">
      <span class="hint" id="vt-haveh"></span></div>
    <div class="field"><label>Decoration</label><select id="vt-dec"></select>
      <span class="hint" id="vt-dech"></span></div>
  </div>
  <div class="chips" style="margin-top:14px">
    <button class="chip" id="vt-knife" aria-pressed="false" type="button">
      <span class="tick">&#10003;</span><span>Fletching knife<em>one tick off every fletch</em></span></button>
    <button class="chip" id="vt-basket" aria-pressed="false" type="button">
      <span class="tick">&#10003;</span><span>Log basket<em>a full round without banking</em></span></button>
    <button class="chip" id="vt-fletch" aria-pressed="true" type="button">
      <span class="tick">&#10003;</span><span>Fletch as you run<em>decorations made between sites</em></span></button>
    <button class="chip" id="vt-house" aria-pressed="false" type="button">
      <span class="tick">&#10003;</span><span>I own a house<em>Construction xp per build</em></span></button>
  </div>
  <div class="grid g3" style="margin-top:14px">
    <div class="field"><label>Wrong carvings a totem</label>
      <select id="vt-wrong">
        <option value="0">None, all three right</option>
        <option value="1">One wrong</option>
        <option value="2">Two wrong</option>
        <option value="3">All three wrong</option>
      </select><span class="hint">each wrong spirit costs 25% of the totem's xp</span></div>
    <div class="field"><label>Totems an hour</label><input id="vt-rate" type="number" min="10" max="200" value="104">
      <span class="hint" id="vt-rateh"></span></div>
    <div class="field"><label>Construction level</label><input id="vt-con" type="number" min="1" max="99" value="70">
      <span class="hint">1 xp per level, per totem built</span></div>
  </div>
  <div id="vt-warn"></div>
</section>

<section class="card">
  <h2>The round <span class="sub">eight sites, start and finish at the Auburnvale bank</span></h2>
  <div class="statrow" id="round-stats"></div>
  <div id="round-lines" style="margin-top:16px"></div>
  <p class="foot" id="round-foot"></p>
</section>

<section class="card">
  <h2>What the ents leave you</h2>
  <div class="statrow" id="off-stats"></div>
  <details class="how"><summary>More detail</summary><p>Offerings are set by the totem's log type alone, not by what you decorate it with. Rummaging them
  is what yields research points and the drops: the <strong>Fletching knife</strong> at roughly 1 in 333 and the
  <strong>Greenman's mask</strong> at about 1 in 500, alongside ent branches and bow string spools. A hundred
  offerings is worth one research point at Ranulph, so the two currencies move together.</p></details>
  <div id="off-drops"></div>
</section>

<section class="card">
  <h2>Every log type <span class="sub">at your level and kit</span></h2>
  <div class="tablewrap"><table>
    <thead><tr><th class="l">Totem</th><th>Fletching</th><th>XP each</th><th>Offerings</th>
      <th>Durability</th><th>XP an hour</th><th>Logs an hour</th></tr></thead>
    <tbody id="tier-rows"></tbody>
  </table></div>
  <details class="how"><summary>More detail</summary><p>Experience per totem is the build, three carvings and four decorations together, straight from the
  wiki's table. Durability is how many ent visits a totem survives before it collapses, so higher tiers stand longer
  and need rebuilding less often.</p></details>
</section>
`,se=[{id:"oak",name:"Oak",lvl:20,carve:12.5,dec:51.2,total:254.8,off:20,durab:2},{id:"willow",name:"Willow",lvl:35,carve:31.7,dec:126.9,total:634.4,off:30,durab:3},{id:"maple",name:"Maple",lvl:50,carve:50.8,dec:201,total:1007.2,off:40,durab:4},{id:"yew",name:"Yew",lvl:65,carve:82.6,dec:326.2,total:1635.2,off:65,durab:5},{id:"magic",name:"Magic",lvl:80,carve:156.1,dec:619.8,total:3103.6,off:90,durab:6},{id:"redwood",name:"Redwood",lvl:90,carve:221.3,dec:725.5,total:3787.2,off:105,durab:7}],re={oak:[["Shortbow (u)",1,20,16.5],["Stock",1,24,16],["Longbow (u)",1,25,25],["Shield",2,27,50]],willow:[["Shortbow (u)",1,35,33.3],["Stock",1,39,22],["Longbow (u)",1,40,41.5],["Shield",2,42,83]],maple:[["Shortbow (u)",1,50,50],["Stock",1,54,32],["Longbow (u)",1,55,58.3],["Shield",2,57,116.5]],yew:[["Shortbow (u)",1,65,67.5],["Stock",1,69,50],["Longbow (u)",1,70,75],["Shield",2,72,150]],magic:[["Shortbow (u)",1,80,83.3],["Stock",1,80,70],["Longbow (u)",1,85,91.5],["Shield",2,87,183]],redwood:[["Hiking staff",1,90,0],["Shield",2,92,216]]},W={TIERS:se,DECS:re};function ie(){function n(e){return document.getElementById(e)}function d(e){var t=parseFloat(String(e).replace(/[^0-9.\-]/g,""));return isNaN(t)?0:t}function a(e){return Math.round(e).toLocaleString("en-GB")}function j(e){if(e<=0)return"—";if(e<1)return Math.round(e*60)+" min";var t=Math.floor(e),o=Math.round((e-t)*60);return o===60&&(t++,o=0),t+"h"+(o?" "+o+"m":"")}var E=[0,0];(function(){for(var e=0,t=1;t<99;t++)e+=Math.floor(t+300*Math.pow(2,t/7)),E[t+1]=Math.floor(e/4)})();function F(e){return E[Math.max(1,Math.min(99,e))]||0}function w(e){for(var t=1;t<99&&E[t+1]<=e;)t++;return t}var H=2e8,x=W.TIERS,C=W.DECS,h=8,A=!1;function $(e){return x.filter(function(t){return t.id===e})[0]||x[0]}function q(){x.forEach(function(e){var t=document.createElement("option");t.value=e.id,t.textContent=e.name+" · "+e.lvl+" Fletching",n("vt-log").appendChild(t)}),n("vt-log").value="yew",R()}function R(){var e=n("vt-log").value,t=n("vt-dec"),o=t.value;t.innerHTML="",(C[e]||[]).forEach(function(s){var v=document.createElement("option");v.value=s[0],v.textContent=s[0]+" · "+s[1]+" log"+(s[1]>1?"s":"")+" · lvl "+s[2],t.appendChild(v)}),[].slice.call(t.options).some(function(s){return s.value===o})&&(t.value=o)}function K(){var e=Math.max(1,Math.min(99,d(n("vt-lvl").value)||1)),t=d(n("vt-xp").value),o=$(n("vt-log").value),s=C[o.id]||[],v=s.filter(function(ne){return ne[0]===n("vt-dec").value})[0]||s[0],p=n("vt-knife").getAttribute("aria-pressed")==="true",l=n("vt-basket").getAttribute("aria-pressed")==="true",u=n("vt-fletch").getAttribute("aria-pressed")==="true",y=n("vt-house").getAttribute("aria-pressed")==="true",k=d(n("vt-wrong").value),M=Math.max(1,d(n("vt-con").value)),f=d(n("vt-have").value),g=1+4*v[1],D=Math.max(0,1-.25*k),N=o.total*D,I=u?4*v[3]:0,T=N+I,U=y?M:0,L=104,S=[];u&&(L*=.95,S.push("fletching as you run, 5% slower")),u&&!p&&(L*=.88,S.push("no fletching knife, 12% slower again")),l||(L*=.95,S.push("no log basket, an extra bank stop"));var P=Math.round(L);!A&&d(n("vt-rate").value)!==P&&(n("vt-rate").value=P);var O=Math.max(1,d(n("vt-rate").value)),b=n("vt-goaltype").value,X=d(n("vt-goal").value),r;if(b==="logs")r=Math.floor(f/g);else if(b==="offerings")r=Math.ceil(X/o.off);else if(b==="points")r=Math.ceil(X/(o.off/100));else{var V=b==="level"?F(Math.round(X)):X,z=Math.max(0,Math.min(H,V)-t);r=T>0?Math.ceil(z/T):0}r=Math.max(0,r);var J=r/h,G=r*g,Q=Math.max(0,G-f),Z=r/O,Y=r*o.off,_=Y/100,B=r*T,ee=Math.min(H,t+B),te=Math.ceil(r/(l?h:h/2));return{level:e,curXp:t,tier:o,dec:v,decs:s,knife:p,basket:l,fletch:u,house:y,wrong:k,mult:D,logsPerTotem:g,totemXp:N,fletchXp:I,xpPerTotem:T,conXp:U,totems:r,rounds:J,logsNeeded:G,have:f,logsShort:Q,hours:Z,rate:O,suggested:P,mods:S,offerings:Y,points:_,totalXp:B,endXp:ee,bankTrips:te,goalType:b}}function i(e,t,o){return'<div class="stat '+(o||"")+'"><span class="sv">'+e+'</span><span class="sl">'+t+"</span></div>"}function c(e,t,o){return'<div class="line'+(o?" strong":"")+'"><span>'+e+"</span><b>"+t+"</b></div>"}function m(){var e=K();n("sum").innerHTML=i(a(e.logsNeeded),"logs needed","big")+i(j(e.hours),"time to run it","accent")+i(a(Math.ceil(e.rounds)),"rounds of eight","accent")+i(a(e.totems),"totems","leaf"),n("sum-note").innerHTML=e.logsShort>0?"You have <strong>"+a(e.have)+"</strong> "+e.tier.name.toLowerCase()+" logs, so you are <strong>"+a(e.logsShort)+"</strong> short. That is "+a(Math.floor(e.have/e.logsPerTotem))+" totems' worth on hand.":e.have>0?"Your <strong>"+a(e.have)+"</strong> logs cover the whole thing with "+a(e.have-e.logsNeeded)+" to spare.":"Each totem takes <strong>"+e.logsPerTotem+"</strong> logs: one for the base and four for decorations.",n("vt-note").textContent="Level "+w(e.curXp)+" · "+a(Math.max(0,F(Math.min(99,w(e.curXp)+1))-e.curXp))+" xp to the next level",n("vt-logh").textContent=e.tier.total.toLocaleString("en-GB")+" xp and "+e.tier.off+" offerings a totem",n("vt-haveh").textContent=e.have>0?Math.floor(e.have/e.logsPerTotem)+" totems' worth":"leave at 0 if buying as you go",n("vt-dech").textContent=e.dec[1]+" log"+(e.dec[1]>1?"s":"")+" each"+(e.fletch?" · "+e.dec[3]+" fletching xp each":" · pre-made, no extra xp"),n("vt-rateh").innerHTML="wiki compares at 104 an hour"+(e.mods.length?" · your kit suggests "+e.suggested:"");var t="";e.level<e.tier.lvl?t="You need "+e.tier.lvl+" Fletching for "+e.tier.name.toLowerCase()+" totems and you are "+e.level+".":e.level<e.dec[2]&&(t=e.tier.name+" "+e.dec[0].toLowerCase()+" needs "+e.dec[2]+" Fletching. Decorating with one needs the same level as making it."),n("vt-warn").innerHTML=t?'<div class="warn">'+t+"</div>":"",n("round-stats").innerHTML=i(a(e.logsPerTotem*h),"logs a round")+i(a(h*e.xpPerTotem),"xp a round","accent")+i(a(h*e.tier.off),"offerings a round","leaf")+i(a(e.bankTrips),"bank stops in total");var o=c("Totem experience",a(e.totemXp)+" each"+(e.wrong?" ("+Math.round(e.mult*100)+"% after "+e.wrong+" wrong)":""))+(e.fletch?c("Fletching the four decorations","+"+a(e.fletchXp)+" each"):"")+c("Experience a totem",a(e.xpPerTotem)+"",!0)+c("Experience an hour",a(e.xpPerTotem*e.rate))+(e.house?c("Construction experience","+"+a(e.conXp*e.totems)+" over the run"):"")+c("Total Fletching experience","+"+a(e.totalXp))+c("Level you land on",String(w(e.endXp)),!0);n("round-lines").innerHTML=o;var s=[];s.push("A round is all eight sites, "+(e.basket?"and the log basket carries enough to finish one without banking.":"and without a log basket you reset at Nemus Retreat halfway, so two stops a round.")),e.mods.length&&s.push("Rate suggestion accounts for: "+e.mods.join("; ")+"."),s.push("Building a totem restores 15% run energy, and admiring scenery alongside an ent gives 20% more, so run energy is rarely the limit. Stepping on both halves of an ent trail gives 15% more experience for the next four build and carve actions and doubles that ent's next offering."),n("round-foot").innerHTML=s.join(" "),n("off-stats").innerHTML=i(a(e.offerings),"vale offerings","big")+i(a(e.points),"research points","leaf")+i(a(e.tier.off*e.rate),"offerings an hour")+i(e.tier.durab,"ent visits a totem","accent");var v=e.offerings/333,p=e.offerings/500;n("off-drops").innerHTML='<div style="margin-top:14px">'+c("Fletching knife at ~1/333",v>=1?a(v)+" expected":(v*100).toFixed(1)+"% chance")+c("Greenman's mask at ~1/500",p>=1?a(p)+" expected":(p*100).toFixed(1)+"% chance")+"</div>",n("tier-rows").innerHTML=x.map(function(l){var u=(C[l.id]||[])[0],y=1+4*u[1],k=e.fletch?4*u[3]:0,M=l.total*e.mult+k,f=e.level<l.lvl,g=l.id===e.tier.id?"best":f?"locked":"";return"<tr"+(g?' class="'+g+'"':"")+'><td class="l">'+l.name+(f?" — locked":"")+"</td><td>"+l.lvl+"</td><td>"+a(M)+"</td><td>"+l.off+"</td><td>"+l.durab+"</td><td>"+a(M*e.rate)+"</td><td>"+a(y*e.rate)+"</td></tr>"}).join("")}q(),["vt-lvl","vt-xp","vt-goal","vt-have","vt-rate","vt-con"].forEach(function(e){n(e).addEventListener("input",function(){e==="vt-rate"&&(A=!0),e==="vt-lvl"&&(n("vt-xp").value=F(Math.round(d(n("vt-lvl").value)))),e==="vt-xp"&&(n("vt-lvl").value=w(d(n("vt-xp").value))),m()})}),["vt-goaltype","vt-dec","vt-wrong"].forEach(function(e){n(e).addEventListener("change",m)}),n("vt-log").addEventListener("change",function(){R(),m()}),["vt-knife","vt-basket","vt-fletch","vt-house"].forEach(function(e){n(e).addEventListener("click",function(){var t=n(e),o=t.getAttribute("aria-pressed")==="true";t.setAttribute("aria-pressed",o?"false":"true"),m()})}),m()}const de="Logs into rounds, offerings and research points",ce=["<b>20</b> Fletching","Vale Totems","<b>5</b> logs a totem"],ue=`<div id="view-vale" class="legacy">${oe}</div>`;function he(){ie(),ae({"vt-xp":"fletching"})}export{ue as html,he as mount,ce as reqs,de as subtitle};
