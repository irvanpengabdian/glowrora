import { renderCarousel, renderGrid } from "./render";
import { EMBED_CSS } from "./styles";
import type { TrustifyApiV1 } from "./types";

const SCRIPT_SELECTOR = 'script[src*="trustify-embed.js"][data-trustify-campaign]';

function scriptOrigin(script: HTMLScriptElement): string {
  const o = script.dataset.trustifyOrigin?.trim();
  if (o) return o.replace(/\/+$/, "");
  try {
    return new URL(script.src).origin;
  } catch {
    return "";
  }
}

async function fetchPayload(
  base: string,
  slug: string,
): Promise<TrustifyApiV1> {
  const url = `${base}/api/public/campaigns/${encodeURIComponent(slug)}/testimonials`;
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      typeof (err as { error?: string }).error === "string"
        ? (err as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json() as Promise<TrustifyApiV1>;
}

function mount(script: HTMLScriptElement): void {
  if (script.dataset.trustifyBootstrapped === "1") return;
  script.dataset.trustifyBootstrapped = "1";

  const slug = script.dataset.trustifyCampaign?.trim();
  if (!slug) return;

  const layout =
    script.dataset.trustifyLayout === "carousel" ? "carousel" : "grid";

  const host = document.createElement("div");
  host.className = "trustify-embed-host";
  script.insertAdjacentElement("afterend", host);

  const shadow = host.attachShadow({ mode: "open" });
  const styleEl = document.createElement("style");
  styleEl.textContent = EMBED_CSS;
  shadow.appendChild(styleEl);

  const wrap = document.createElement("div");
  wrap.className = "tf-wrap";
  shadow.appendChild(wrap);
  wrap.innerHTML =
    '<p style="margin:0;color:#42474c;font-size:13px;">Loading testimonials…</p>';

  const base = scriptOrigin(script);
  if (!base) {
    wrap.innerHTML =
      '<p class="tf-err">Could not resolve script URL. Set <code>data-trustify-origin</code> to your Trustify site (e.g. https://app.example.com).</p>';
    return;
  }

  void (async () => {
    try {
      const data = await fetchPayload(base, slug);
      wrap.innerHTML = "";
      if (layout === "carousel") renderCarousel(wrap, data);
      else renderGrid(wrap, data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      wrap.replaceChildren();
      const p = document.createElement("p");
      p.className = "tf-err";
      p.textContent = msg;
      wrap.appendChild(p);
    }
  })();
}

function boot(): void {
  document.querySelectorAll<HTMLScriptElement>(SCRIPT_SELECTOR).forEach(mount);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
