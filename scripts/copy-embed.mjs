import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "embed", "dist", "trustify-embed.js");
const destDir = path.join(root, "public", "embed");
const dest = path.join(destDir, "trustify-embed.js");

if (!fs.existsSync(src)) {
  console.error("Missing embed bundle:", src);
  process.exit(1);
}
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("Copied", dest);
