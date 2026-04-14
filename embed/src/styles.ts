/** Scoped inside shadow root — class prefix avoids clashes. */
export const EMBED_CSS = `
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
`;
