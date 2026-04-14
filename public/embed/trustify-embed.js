(function(){function u(t){const e=Math.min(5,Math.max(1,Math.round(t)));return`<span class="tf-stars">${"★".repeat(e)}<span style="opacity:.28">${"★".repeat(5-e)}</span></span>`}function s(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function p(t){const e=t.videoPlaybackUrl!=null?`<div class="tf-video"><video src="${s(t.videoPlaybackUrl)}" controls playsinline preload="metadata"></video></div>`:t.hasVideoAsset?'<p style="margin:10px 0 0;font-size:12px;color:#42474c;">Video clip (configure public playback URL to show here).</p>':"",o=t.authorTitle?`<div class="tf-role">${s(t.authorTitle)}</div>`:"";return`<article class="tf-card">${u(t.rating)}<p class="tf-body">${s(t.body)}</p>${e}<footer class="tf-foot"><div class="tf-name">${s(t.authorName)}</div>${o}</footer></article>`}function m(t,e){const{campaign:o,testimonials:a}=e,n=o.description?`<p class="tf-sub">${s(o.description)}</p>`:"";if(a.length===0){t.innerHTML=`<h3 class="tf-head">${s(o.name)}</h3>${n}<div class="tf-empty">No approved testimonials yet.</div>`;return}t.innerHTML=`<p class="tf-badge">${a.length} voices</p><h3 class="tf-head">${s(o.name)}</h3>${n}<div class="tf-grid">${a.map(p).join("")}</div>`}function g(t,e){const{campaign:o,testimonials:a}=e,n=o.description?`<p class="tf-sub">${s(o.description)}</p>`:"";if(a.length===0){t.innerHTML=`<h3 class="tf-head">${s(o.name)}</h3>${n}<div class="tf-empty">No approved testimonials yet.</div>`;return}t.innerHTML=`<p class="tf-badge">${a.length} voices · carousel</p><h3 class="tf-head">${s(o.name)}</h3>${n}<div class="tf-caro-nav"><button type="button" data-dir="-1" aria-label="Previous">← Prev</button><button type="button" data-dir="1" aria-label="Next">Next →</button></div><div class="tf-caro" data-tf-caro-track>${a.map(p).join("")}</div>`;const i=t.querySelector("[data-tf-caro-track]");i&&t.querySelectorAll(".tf-caro-nav button").forEach(r=>{r.addEventListener("click",()=>{const d=Number(r.dataset.dir)||0,c=i.clientWidth*.85;i.scrollBy({left:d*c,behavior:"smooth"})})})}var h=`
:host { all: initial; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
.tf-wrap { color: #1b1c1a; font-size: 14px; line-height: 1.5; }
.tf-head { margin: 0 0 12px; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #1a3a4f; }
.tf-sub { margin: 0 0 20px; font-size: 13px; color: #42474c; }
.tf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
.tf-card {
  border: 1px solid rgba(194, 199, 205, 0.55);
  border-radius: 14px;
  padding: 14px 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(26, 58, 79, 0.04);
}
.tf-stars { font-size: 13px; color: #006c50; letter-spacing: 0.02em; }
.tf-body { margin: 10px 0 0; font-size: 13px; color: #1a3a4f; font-weight: 500; white-space: pre-wrap; }
.tf-foot { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(194, 199, 205, 0.35); }
.tf-name { font-size: 13px; font-weight: 600; color: #1a3a4f; }
.tf-role { font-size: 12px; color: #42474c; margin-top: 2px; }
.tf-video { margin-top: 10px; border-radius: 10px; overflow: hidden; background: #0a0a0a; }
.tf-video video { width: 100%; display: block; max-height: 200px; object-fit: contain; }
.tf-empty { padding: 20px; text-align: center; color: #42474c; font-size: 13px; border: 1px dashed rgba(194, 199, 205, 0.8); border-radius: 12px; }
.tf-err { padding: 12px 14px; background: #ffdad6; color: #93000a; border-radius: 10px; font-size: 13px; }
.tf-caro {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 6px;
  scrollbar-width: thin;
}
.tf-caro .tf-card {
  flex: 0 0 min(320px, 85vw);
  scroll-snap-align: start;
}
.tf-caro-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.tf-caro-nav button {
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(194, 199, 205, 0.8);
  background: #fff;
  color: #1a3a4f;
  cursor: pointer;
}
.tf-caro-nav button:hover { background: #f5f3f0; }
.tf-badge { font-size: 11px; color: #42474c; margin-bottom: 8px; }
`,x='script[src*="trustify-embed.js"][data-trustify-campaign]';function b(t){const e=t.dataset.trustifyOrigin?.trim();if(e)return e.replace(/\/+$/,"");try{return new URL(t.src).origin}catch{return""}}async function y(t,e){const o=`${t}/api/public/campaigns/${encodeURIComponent(e)}/testimonials`,a=await fetch(o,{credentials:"omit"});if(!a.ok){const n=await a.json().catch(()=>({})),i=typeof n.error=="string"?n.error:`Request failed (${a.status})`;throw new Error(i)}return a.json()}function v(t){if(t.dataset.trustifyBootstrapped==="1")return;t.dataset.trustifyBootstrapped="1";const e=t.dataset.trustifyCampaign?.trim();if(!e)return;const o=t.dataset.trustifyLayout==="carousel"?"carousel":"grid",a=document.createElement("div");a.className="trustify-embed-host",t.insertAdjacentElement("afterend",a);const n=a.attachShadow({mode:"open"}),i=document.createElement("style");i.textContent=h,n.appendChild(i);const r=document.createElement("div");r.className="tf-wrap",n.appendChild(r),r.innerHTML='<p style="margin:0;color:#42474c;font-size:13px;">Loading testimonials…</p>';const d=b(t);if(!d){r.innerHTML='<p class="tf-err">Could not resolve script URL. Set <code>data-trustify-origin</code> to your Trustify site (e.g. https://app.example.com).</p>';return}(async()=>{try{const c=await y(d,e);r.innerHTML="",o==="carousel"?g(r,c):m(r,c)}catch(c){const w=c instanceof Error?c.message:"Something went wrong.";r.replaceChildren();const l=document.createElement("p");l.className="tf-err",l.textContent=w,r.appendChild(l)}})()}function f(){document.querySelectorAll(x).forEach(v)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})();
