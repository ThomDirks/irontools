// Every calculator, in sidebar order. x/y are pixels on the map image's own
// 3000 x 2125 grid: open the site with #calibrate and click to read them off.

const ICONS = {
  construction: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  cooking: '<path d="M4 11h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-2z"/><path d="M2 11h20"/><path d="M9 7c0-1.5 1-2 1-3.5M13 7c0-1.5 1-2 1-3.5"/>',
  crafting: '<rect x="7" y="8" width="10" height="9" rx="1.5"/><path d="M10 8V5.5A2 2 0 0 1 12 3.5a2 2 0 0 1 2 2V8"/><path d="M7 11H4.5M19.5 11H17M9.5 17v3.5M14.5 17v3.5"/><path d="M10.5 12h3"/>',
  farming: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7z"/><path d="M12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5z"/>',
  fletching: '<path d="M12 21V9"/><path d="M12 9L7.5 5.5 12 3l4.5 2.5L12 9z"/><path d="M12 13l-4-2.5M12 13l4-2.5M12 17l-3.5-2M12 17l3.5-2"/><path d="M8.5 21h7"/>',
  herblore: '<path d="M9 2h6M10 2v6.2L5.6 17a3 3 0 0 0 2.7 4.3h7.4A3 3 0 0 0 18.4 17L14 8.2V2"/><path d="M7.2 14.5h9.6"/>',
  herbs: '<path d="M7 20c0-6 3-11 10-14-1 7-4 12-10 14z"/><path d="M7 20c2-4 5-7 8-9"/>',
  prayer: '<path d="M12 3v18"/><path d="M6 8h12"/><path d="M8 21h8"/>',
  furnace: '<path d="M5 21V9l7-5 7 5v12z"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/><path d="M11 13c0-1.2 1-1.6 1-3 1 1 2 1.8 2 3.2"/>',
  kingdom: '<path d="M4 18h16l1-10-5 4-4-6-4 6-5-4z"/><path d="M4 21h16"/>',
  runecraft: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/><path d="M12 4v4.5M12 15.5V20M4 12h4.5M15.5 12H20"/>',
  blood: '<path d="M12 3.5c3.2 4.2 6 7.4 6 10.7a6 6 0 0 1-12 0c0-3.3 2.8-6.5 6-10.7z"/><path d="M9.2 14.5a2.9 2.9 0 0 0 2.8 2.6"/>',
  salvage: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M3.5 13H6.5M17.5 13h3M9 10.5h6"/>',
  bank: '<path d="M3 9.5 12 4l9 5.5"/><path d="M4.5 10v8M9 10v8M15 10v8M19.5 10v8"/><path d="M3 20.5h18"/>',
  alch: '<circle cx="12" cy="13.5" r="6.5"/><path d="M12 10.5v6M10 12h3.2a1.3 1.3 0 0 1 0 2.6H10.8"/><path d="M9.5 3.5c.8 1 1.5 1.5 2.5 1.5s1.7-.5 2.5-1.5"/>',
  smithing: '<path d="M3 17h8l2.5-2.5"/><path d="M13.5 14.5l5-5a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0l-5 5"/><path d="M3 20.5h9"/><path d="M6.5 17v3.5"/><path d="M15 5.5l3.5 3.5"/>'
};

// Sidebar sections, in order. A tool without a group sits under Skills.
export const GROUPS = [
  { id: "skills", title: "Skills" },
  { id: "bank", title: "Bank" }
];

// Tools with no x/y have no marker on the map.
export const TOOLS = [
  { id: "mahogany", title: "Mahogany Homes", skill: "construction", skillName: "Construction", place: "Falador", x: 1972, y: 857, labelBelow: true,
    load: () => import("./mahogany/index.js") },
  { id: "cooking", title: "Hosidius Kitchen", skill: "cooking", skillName: "Cooking", place: "Cooking", x: 699, y: 592,
    load: () => import("./cooking/index.js") },
  { id: "golem", title: "Golem crafting", skill: "crafting", skillName: "Crafting", place: "Wyrmscraig", x: 1496, y: 1882,
    load: () => import("./golem/index.js") },
  { id: "tithe", title: "Tithe Farm", skill: "farming", skillName: "Farming", place: "Hosidius", x: 835, y: 707,
    load: () => import("./tithe/index.js") },
  { id: "herbs", title: "Herb runs", skill: "farming", icon: "herbs", skillName: "Farming", place: "Catherby", x: 1812, y: 753,
    load: () => import("./herbs/index.js") },
  { id: "vale", title: "Vale Totems", skill: "fletching", skillName: "Fletching", place: "Auburnvale", x: 443, y: 884,
    load: () => import("./vale/index.js") },
  { id: "mixology", title: "Mixology", skill: "herblore", skillName: "Herblore", place: "Aldarin", x: 421, y: 1255,
    load: () => import("./mixology/index.js") },
  { id: "prayer", title: "Prayer", skill: "prayer", skillName: "Prayer", place: "Ectofuntus", x: 2600, y: 720,
    spots: [
      { place: "Ectofuntus", x: 2600, y: 720, preset: { method: "ecto" } },
      { place: "Chaos altar", x: 1974, y: 515, preset: { method: "chaos" } },
      { place: "Libation bowl", x: 471, y: 1028, preset: { method: "libation" } }
    ],
    load: () => import("./prayer/index.js") },
  { id: "smithing", title: "Giants' Foundry", skill: "smithing", skillName: "Smithing", place: "Giants' Plateau", x: 2365, y: 1022,
    load: () => import("./smithing/index.js") },
  { id: "blastfurnace", title: "Blast Furnace", skill: "smithing", icon: "furnace", skillName: "Smithing", place: "Keldagrim", x: 1743, y: 565,
    load: () => import("./blastfurnace/index.js") },
  { id: "gotr", title: "Guardians of the Rift", skill: "runecrafting", icon: "runecraft", skillName: "Runecraft", place: "Wizards' Tower", x: 2085, y: 1030, labelBelow: true, isNew: true,
    load: () => import("./gotr/index.js") },
  { id: "arceuus", title: "Blood & soul runes", skill: "runecrafting", icon: "blood", skillName: "Runecraft", place: "Arceuus", x: 745, y: 390, isNew: true,
    load: () => import("./arceuus/index.js") },
  { id: "salvage", title: "Salvaging", skill: "sailing", icon: "salvage", skillName: "Sailing", place: "Shipwrecks", x: 1700, y: 1110, isNew: true,
    load: () => import("./salvage/index.js") },
  { id: "kingdom", title: "Miscellania", skill: "kingdom", icon: "kingdom", skillName: "Kingdom", place: "Managing the kingdom", x: 1561, y: 348, group: "bank",
    load: () => import("./kingdom/index.js") },
  { id: "bankxp", title: "Bank xp", skill: "bank", icon: "bank", skillName: "Xp in your bank", group: "bank", isNew: true,
    load: () => import("./bankxp/index.js") },
  { id: "alch", title: "High alch planner", skill: "magic", icon: "alch", skillName: "Magic", group: "bank", isNew: true,
    load: () => import("./alch/index.js") }
];

export function icon(skill) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[skill] || ""}</svg>`;
}
