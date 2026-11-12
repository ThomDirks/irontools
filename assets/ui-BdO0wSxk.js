import{e as c,a as $,l as v,g as f}from"./app-BxcXR2hJ.js";function b({fromXp:t,toXp:e,skill:a,cap:r=99}){const l=v(t,r),o=v(e,r),n=Math.round(f(e,r)*100);return`<div class="landing">
    <div class="landing-lv">
      <span class="landing-from">${l}</span>
      <svg class="landing-arrow" viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1l5 5-5 5"/></svg>
      <span class="landing-to">${o}</span>
    </div>
    <div class="landing-meta">
      <span>${c(a)}</span>
      <b>+${$(e-t)} xp</b>
    </div>
    <div class="landing-bar" title="${n}% through level ${o}"><i style="width:${o>=r?100:n}%"></i></div>
  </div>`}function g(t,e,a=""){return`<div class="tile ${a}"><b>${t}</b><span>${c(e)}</span></div>`}function w(t){return`<div class="tiles">${t.join("")}</div>`}function h(t,e,a=""){return`<div class="row ${a}"><span>${t}</span><b>${e}</b></div>`}function x(t,e=""){return`<p class="note ${e}">${t}</p>`}function y(t){return t.length?`<ol class="timeline">${t.map(e=>`<li class="${e.tone||""}"><span class="tl-when">${e.when}</span><span class="tl-what">${e.what}</span>${e.sub?`<span class="tl-sub">${e.sub}</span>`:""}</li>`).join("")}</ol>`:""}function L(t,e,a=""){return`<section class="out-sec">${t?`<h3>${c(t)}${a}</h3>`:""}${e}</section>`}function E(t,e,a={}){return`<div class="tablewrap"><table class="grid-table">
    <thead><tr>${t.map((r,l)=>`<th class="${l?"n":""}">${r}</th>`).join("")}</tr></thead>
    <tbody>${e.map(r=>`<tr class="${r.cls||""}">${r.cells.map((l,o)=>`<td class="${o?"n":""}">${l}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>${a.foot?`<p class="fine">${a.foot}</p>`:""}`}function j(t,e={}){return`<div class="rewards" data-rewards>
    <input type="hidden" name="rw-order" value="${t.map(a=>a.id).join(",")}">
    ${t.map(a=>{const r=e[a.id]||"skip",l=n=>`<label><input type="radio" name="rw-${a.id}" value="${n}"${r===n?" checked":""}><span>${n==="skip"?"Skip":n==="want"?"Want":"Have"}</span></label>`,o=a.xpBoost?`+${(a.xpBoost*100).toFixed(1)}% xp`:a.effect||"";return`<div class="rw" data-id="${a.id}">
        <span class="rw-grip" draggable="true" title="Drag to reorder" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="rw-name">${c(a.name)}<small>${c(o)}</small></span>
        <span class="rw-cost">${$(a.cost)}</span>
        <span class="rw-state" role="radiogroup" aria-label="${c(a.name)}">${l("skip")}${l("want")}${l("have")}</span>
        <span class="rw-move"><button type="button" data-move="-1" aria-label="Move ${c(a.name)} up">▲</button><button type="button" data-move="1" aria-label="Move ${c(a.name)} down">▼</button></span>
      </div>`}).join("")}
  </div>`}function B(t){const e=t.querySelector("[data-rewards]");if(!e)return;const a=e.querySelector('[name="rw-order"]'),r=()=>[...e.querySelectorAll(".rw")],l=()=>{a.value=r().map(i=>i.dataset.id).join(","),a.dispatchEvent(new Event("input",{bubbles:!0}))},o=a.value.split(",").filter(Boolean);for(const i of o){const s=e.querySelector(`.rw[data-id="${i}"]`);s&&e.appendChild(s)}l(),e.addEventListener("click",i=>{const s=i.target.closest("[data-move]");if(!s)return;const d=s.closest(".rw"),u=+s.dataset.move,p=u<0?d.previousElementSibling:d.nextElementSibling;!p||!p.classList.contains("rw")||(u<0?e.insertBefore(d,p):e.insertBefore(p,d),d.classList.add("moved"),setTimeout(()=>d.classList.remove("moved"),400),s.focus(),l())});let n=null;e.addEventListener("dragstart",i=>{const s=i.target.closest(".rw");s&&(n=s,s.classList.add("dragging"),i.dataTransfer.effectAllowed="move",i.dataTransfer.setData("text/plain",s.dataset.id),i.dataTransfer.setDragImage(s,20,20))}),e.addEventListener("dragover",i=>{if(!n)return;i.preventDefault();const s=i.target.closest(".rw");if(!s||s===n)return;const d=s.getBoundingClientRect();e.insertBefore(n,i.clientY<d.top+d.height/2?s:s.nextSibling)}),e.addEventListener("drop",i=>i.preventDefault()),e.addEventListener("dragend",()=>{n&&(n.classList.remove("dragging"),n=null,l())})}function S(t,e){const a=String(e["rw-order"]||"").split(",").filter(Boolean),r=[...t].sort((n,i)=>{const s=a.indexOf(n.id),d=a.indexOf(i.id);return(s<0?999:s)-(d<0?999:d)}),l=[],o=[];for(const n of r){const i=e["rw-"+n.id];i==="have"?l.push(n.id):i==="want"&&o.push(n.id)}return{owned:l,wishlist:o}}function k(t,e,a){return`<div class="seg" role="radiogroup">${e.map(([r,l])=>`<label><input type="radio" name="${t}" value="${r}"${r===a?" checked":""}><span>${c(l)}</span></label>`).join("")}</div>`}function D(t,e,a){return`<div class="pair">
    <label class="field"><span>Level</span><input name="${t}Lvl" type="number" min="1" max="99" value="${e}" inputmode="numeric" data-nosave></label>
    <label class="field"><span>Experience</span><input name="${t}Xp" type="number" min="0" max="200000000" value="${a}" inputmode="numeric"></label>
  </div>`}export{S as a,B as b,b as c,g as d,E as e,h as f,L as g,y as h,D as l,x as n,j as r,k as s,w as t};
