// Every calculator, in sidebar order. x/y are pixels on the map image's own
// 3000 x 2125 grid: open the site with #calibrate and click to read them off.

const ICONS = {
  construction: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  cooking: '<path d="M4 11h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-2z"/><path d="M2 11h20"/><path d="M9 7c0-1.5 1-2 1-3.5M13 7c0-1.5 1-2 1-3.5"/>',
  crafting: '<rect x="7" y="8" width="10" height="9" rx="1.5"/><path d="M10 8V5.5A2 2 0 0 1 12 3.5a2 2 0 0 1 2 2V8"/><path d="M7 11H4.5M19.5 11H17M9.5 17v3.5M14.5 17v3.5"/><path d="M10.5 12h3"/>',
  farming: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/>',
  fletching: '<path d="M12 21V9"/><path d="M12 9L7.5 5.5 12 3l4.5 2.5L12 9z"/><path d="M12 13l-4-2.5M12 13l4-2.5M12 17l-3.5-2M12 17l3.5-2"/><path d="M8.5 21h7"/>',
  herblore: '<path d="M9 2h6M10 2v6.2L5.6 17a3 3 0 0 0 2.7 4.3h7.4A3 3 0 0 0 18.4 17L14 8.2V2"/><path d="M7.2 14.5h9.6"/>',
  smithing: '<path d="M3 17h8l2.5-2.5"/><path d="M13.5 14.5l5-5a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0l-5 5"/><path d="M3 20.5h9"/><path d="M6.5 17v3.5"/><path d="M15 5.5l3.5 3.5"/>'
};

export const TOOLS = [
  { id: "mahogany", title: "Mahogany Homes", skill: "construction", skillName: "Construction", place: "Falador", x: 1820, y: 760, isNew: true,
    load: () => import("./mahogany/index.js") },
  { id: "cooking", title: "Hosidius Kitchen", skill: "cooking", skillName: "Cooking", place: "Cooking", x: 650, y: 575, isNew: true,
    load: () => import("./cooking/index.js") },
  { id: "golem", title: "Golem crafting", skill: "crafting", skillName: "Crafting", place: "Wyrmscraig", x: 1515, y: 1612,
    load: () => import("./golem/index.js") },
  { id: "tithe", title: "Tithe Farm", skill: "farming", skillName: "Farming", place: "Hosidius", x: 780, y: 650, isNew: true,
    load: () => import("./tithe/index.js") },
  { id: "vale", title: "Vale Totems", skill: "fletching", skillName: "Fletching", place: "Auburnvale", x: 443, y: 884,
    load: () => import("./vale/index.js") },
  { id: "mixology", title: "Mixology", skill: "herblore", skillName: "Herblore", place: "Aldarin", x: 421, y: 1255,
    load: () => import("./mixology/index.js") },
  { id: "smithing", title: "Giants' Foundry", skill: "smithing", skillName: "Smithing", place: "Giants' Plateau", x: 2350, y: 1031,
    load: () => import("./smithing/index.js") }
];

export function icon(skill) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[skill] || ""}</svg>`;
}
