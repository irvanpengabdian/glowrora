import type { TrustifyApiV1 } from "./types";

function stars(n: number): string {
  const r = Math.min(5, Math.max(1, Math.round(n)));
  const filled = "★".repeat(r);
  const empty = "★".repeat(5 - r);
  return `<span class="tf-stars">${filled}<span style="opacity:.28">${empty}</span></span>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cardHtml(t: TrustifyApiV1["testimonials"][0]): string {
  const video =
    t.videoPlaybackUrl != null
      ? `<div class="tf-video"><video src="${esc(t.videoPlaybackUrl)}" controls playsinline preload="metadata"></video></div>`
      : t.hasVideoAsset
        ? `<p style="margin:10px 0 0;font-size:12px;color:#42474c;">Video clip (configure public playback URL to show here).</p>`
        : "";
  const role = t.authorTitle
    ? `<div class="tf-role">${esc(t.authorTitle)}</div>`
    : "";
  return `<article class="tf-card">${stars(t.rating)}<p class="tf-body">${esc(t.body)}</p>${video}<footer class="tf-foot"><div class="tf-name">${esc(t.authorName)}</div>${role}</footer></article>`;
}

export function renderGrid(container: HTMLElement, data: TrustifyApiV1): void {
  const { campaign, testimonials } = data;
  const sub = campaign.description
    ? `<p class="tf-sub">${esc(campaign.description)}</p>`
    : "";
  if (testimonials.length === 0) {
    container.innerHTML = `<h3 class="tf-head">${esc(campaign.name)}</h3>${sub}<div class="tf-empty">No approved testimonials yet.</div>`;
    return;
  }
  container.innerHTML = `<p class="tf-badge">${testimonials.length} voices</p><h3 class="tf-head">${esc(campaign.name)}</h3>${sub}<div class="tf-grid">${testimonials.map(cardHtml).join("")}</div>`;
}

export function renderCarousel(container: HTMLElement, data: TrustifyApiV1): void {
  const { campaign, testimonials } = data;
  const sub = campaign.description
    ? `<p class="tf-sub">${esc(campaign.description)}</p>`
    : "";
  if (testimonials.length === 0) {
    container.innerHTML = `<h3 class="tf-head">${esc(campaign.name)}</h3>${sub}<div class="tf-empty">No approved testimonials yet.</div>`;
    return;
  }
  container.innerHTML = `<p class="tf-badge">${testimonials.length} voices · carousel</p><h3 class="tf-head">${esc(campaign.name)}</h3>${sub}<div class="tf-caro-nav"><button type="button" data-dir="-1" aria-label="Previous">← Prev</button><button type="button" data-dir="1" aria-label="Next">Next →</button></div><div class="tf-caro" data-tf-caro-track>${testimonials.map(cardHtml).join("")}</div>`;

  const track = container.querySelector("[data-tf-caro-track]");
  if (!track) return;
  container.querySelectorAll<HTMLButtonElement>(".tf-caro-nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = Number(btn.dataset.dir) || 0;
      const w = track.clientWidth * 0.85;
      track.scrollBy({ left: dir * w, behavior: "smooth" });
    });
  });
}
