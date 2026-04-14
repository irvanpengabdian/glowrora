import { CopyEmbedSnippet } from "@/components/embed/copy-embed-snippet";
import { getAppOrigin } from "@/lib/site-url";
import { listCampaignsForUser } from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

function buildSnippet(
  scriptBase: string,
  slug: string,
  layout: "grid" | "carousel",
): string {
  const src = `${scriptBase.replace(/\/+$/, "")}/embed/trustify-embed.js`;
  return `<script src="${src}" data-trustify-campaign="${slug}" data-trustify-layout="${layout}" defer></script>`;
}

export default async function EmbedPage() {
  const userId = await ensureDbUserId();
  const campaigns = await listCampaignsForUser(userId);
  const origin = await getAppOrigin();
  const scriptBase = origin || "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="tf-page-title">Embed widget</h1>
        <p className="tf-page-lead max-w-2xl">
          Paste a single script on any site (Webflow, WordPress, Framer, plain
          HTML). It loads approved testimonials from the public API and renders
          them inside a shadow root so styles stay isolated.
        </p>
      </div>

      {!scriptBase ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Could not detect your site URL from this request. Use your production
          origin in the script <code className="text-xs">src</code>, or add{" "}
          <code className="text-xs">data-trustify-origin=&quot;https://your-app.com&quot;</code>{" "}
          on the tag.
        </p>
      ) : null}

      <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
        <h2 className="font-headline text-lg font-bold text-primary">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-on-surface-variant">
          <li>Approve testimonials on the Testimonials page.</li>
          <li>
            Choose <strong>Grid</strong> (responsive cards) or{" "}
            <strong>Carousel</strong> (horizontal scroll + prev/next).
          </li>
          <li>
            Copy the snippet for your campaign slug and place it before{" "}
            <code className="rounded bg-surface-container px-1 text-xs">
              &lt;/body&gt;
            </code>
            .
          </li>
        </ol>
      </section>

      {campaigns.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Create a campaign first — then snippets with your public slug will
          appear here.
        </p>
      ) : (
        <div className="space-y-10">
          {campaigns.map((c) => {
            const slug = c.publicSlug;
            const grid =
              scriptBase.length > 0
                ? buildSnippet(scriptBase, slug, "grid")
                : `<script src="https://YOUR-APP.com/embed/trustify-embed.js" data-trustify-campaign="${slug}" data-trustify-layout="grid" defer></script>`;
            const carousel =
              scriptBase.length > 0
                ? buildSnippet(scriptBase, slug, "carousel")
                : `<script src="https://YOUR-APP.com/embed/trustify-embed.js" data-trustify-campaign="${slug}" data-trustify-layout="carousel" defer></script>`;
            return (
              <section
                key={c.id}
                className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8"
              >
                <h2 className="font-headline text-lg font-bold text-primary">
                  {c.name}
                </h2>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Public slug:{" "}
                  <code className="rounded bg-surface-container px-1.5 py-0.5 text-[11px] text-primary-container">
                    {slug}
                  </code>
                </p>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <CopyEmbedSnippet label="Grid layout" snippet={grid} />
                  <CopyEmbedSnippet label="Carousel layout" snippet={carousel} />
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
