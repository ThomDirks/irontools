// Copy the built site from dist/ to the repo root for GitHub Pages.
import fs from "node:fs";

if (!fs.existsSync("dist/app.html")) throw new Error("Run `npm run build` first.");
fs.rmSync("assets", { recursive: true, force: true });
fs.cpSync("dist/assets", "assets", { recursive: true });
fs.copyFileSync("dist/app.html", "index.html");
fs.copyFileSync("dist/favicon.png", "favicon.png");
fs.writeFileSync(".nojekyll", "");
console.log("Site written to index.html and assets/");
