import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "UI", "itrustify-landing dual.html");
const outPath = path.join(root, "src", "app", "itrustify-landing.css");

const html = fs.readFileSync(htmlPath, "utf8");
const m = html.match(/<style>([\s\S]*?)<\/style>/);
if (!m) throw new Error("No <style> block found");
let css = m[1];
css = css
  .replace(/:root\s*\{/g, ":scope {")
  .replace(/\*\{/g, ":scope * {")
  .replace(/html\{scroll-behavior:smooth;\}/g, "")
  .replace(/body\.lang-en/g, ":scope.lang-en")
  .replace(/body::before/g, ":scope::before")
  .replace(/body\{/g, ":scope {");

css = css
  .replace(/'Plus Jakarta Sans',sans-serif/g, "var(--font-jakarta),ui-sans-serif,sans-serif")
  .replace(/'Lora',serif/g, "var(--font-lora),ui-serif,Georgia,serif")
  .replace(/font-family:'Lora'/g, "font-family:var(--font-lora)")
  .replace(/font-family:\"Lora\"/g, "font-family:var(--font-lora)");

const out = `html {
  scroll-behavior: smooth;
}

@scope (.itrustify-root) {
${css}
  :scope {
    min-height: 100vh;
    width: 100%;
    flex: 1;
  }
}
`;
fs.writeFileSync(outPath, out);
console.log("Wrote", outPath);
