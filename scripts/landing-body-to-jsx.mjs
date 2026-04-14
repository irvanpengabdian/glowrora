import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "UI", "itrustify-landing dual.html");
const outPath = path.join(root, "src", "components", "landing", "itrustify-landing-body.tsx");

const html = fs.readFileSync(htmlPath, "utf8");
const bodyStart = html.indexOf("<!-- HERO -->");
const bodyEnd = html.indexOf("<script>");
if (bodyStart === -1 || bodyEnd === -1) throw new Error("Could not find HERO or script");

let chunk = html.slice(bodyStart, bodyEnd).replace(/<!--[\s\S]*?-->/g, "");

chunk = chunk.replace(
  /href="#" class="btn-primary"/g,
  'href="/sign-up" class="btn-primary"',
);
chunk = chunk.replace(
  /href="#" class="btn-secondary"/g,
  'href="#how" class="btn-secondary"',
);
chunk = chunk.replace(
  /href="#" class="btn-plan btn-plan-primary"/g,
  'href="/sign-up" class="btn-plan btn-plan-primary"',
);
chunk = chunk.replace(
  /href="#" class="btn-plan btn-plan-ghost" data-lang="id">Mulai Gratis/g,
  'href="/sign-up" class="btn-plan btn-plan-ghost" data-lang="id">Mulai Gratis',
);
chunk = chunk.replace(
  /href="#" class="btn-plan btn-plan-ghost" data-lang="en">Get Started Free/g,
  'href="/sign-up" class="btn-plan btn-plan-ghost" data-lang="en">Get Started Free',
);

chunk = chunk.replace(/\bclass=/g, "className=");
chunk = chunk.replace(
  /\bonclick="toggleFaq\(this\)"/g,
  "onClick={(e) => toggleFaq(e.currentTarget)}",
);

function styleToObject(str) {
  const o = {};
  for (const part of str.split(";")) {
    const t = part.trim();
    if (!t) continue;
    const ci = t.indexOf(":");
    if (ci === -1) continue;
    const rawKey = t.slice(0, ci).trim();
    const val = t.slice(ci + 1).trim();
    const camel = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[camel] = val;
  }
  return o;
}

chunk = chunk.replace(/style="([^"]*)"/g, (_, inner) => {
  const obj = styleToObject(inner);
  return `style={${JSON.stringify(obj)}}`;
});

chunk = chunk.replace(/\bstroke-width=/g, "strokeWidth=");
chunk = chunk.replace(/\bstroke-linecap=/g, "strokeLinecap=");
chunk = chunk.replace(/\bstroke-linejoin=/g, "strokeLinejoin=");
chunk = chunk.replace(/\bstroke-opacity=/g, "strokeOpacity=");
chunk = chunk.replace(/\bfill-opacity=/g, "fillOpacity=");
chunk = chunk.replace(/\bclip-rule=/g, "clipRule=");
chunk = chunk.replace(/\bfill-rule=/g, "fillRule=");

chunk = chunk.replace(/<br>/gi, "<br />");

/** Footer product anchors → in-page sections */
chunk = chunk.replace(
  /<a href="#" data-lang="id">Fitur<\/a>/g,
  '<a href="#features" data-lang="id">Fitur</a>',
);
chunk = chunk.replace(
  /<a href="#" data-lang="en">Features<\/a>/g,
  '<a href="#features" data-lang="en">Features</a>',
);
chunk = chunk.replace(
  /<a href="#" data-lang="id">Harga<\/a>/g,
  '<a href="#pricing" data-lang="id">Harga</a>',
);
chunk = chunk.replace(
  /<a href="#" data-lang="en">Pricing<\/a>/g,
  '<a href="#pricing" data-lang="en">Pricing</a>',
);

const header = `"use client";

/* eslint-disable react/no-unescaped-entities -- testimonial copy uses straight quotes like the source HTML */
/* eslint-disable @next/next/no-html-link-for-pages -- <a> keeps landing CSS selectors and matches the static mock */

type BodyProps = {
  toggleFaq: (el: HTMLElement) => void;
};

export function ItrustifyLandingBody({ toggleFaq }: BodyProps) {
  return (
    <>
`;

const footer = `
    </>
  );
}
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + chunk.trim() + "\n" + footer);
console.log("Wrote", outPath);
