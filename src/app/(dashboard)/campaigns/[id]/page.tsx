import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { CampaignDefaultQuestions } from "@/components/campaigns/campaign-default-questions";
import { CopyCollectionLink } from "@/components/campaigns/copy-collection-link";
import { RestoreCampaignForm } from "@/components/campaigns/restore-campaign-form";
import { getAppOrigin } from "@/lib/site-url";
import { getOwnedCampaign } from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

import { CampaignEditForm } from "./campaign-edit-form";
import { CustomQuestionsEditor } from "./custom-questions-editor";
import { DeleteCampaignForm } from "./delete-campaign-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await ensureDbUserId();
  const campaign = await getOwnedCampaign(userId, id);
  if (!campaign) {
    notFound();
  }

  const origin = await getAppOrigin();
  const collectionUrl = origin
    ? `${origin}/collect/${campaign.publicSlug}`
    : `/collect/${campaign.publicSlug}`;
  const wallUrl = origin
    ? `${origin}/love/${campaign.publicSlug}`
    : `/love/${campaign.publicSlug}`;

  const formKey = campaign.updatedAt.toISOString();
  const previewLine =
    campaign.description?.trim().slice(0, 120) ??
    "Share what went well working with us.";

  return (
    <div className="space-y-10">
      <nav aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
          <Link href="/campaigns" className="transition hover:text-primary">
            Campaigns
          </Link>
          <ChevronRight className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          <span className="font-bold text-primary">Configuration</span>
        </div>
        <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-primary">
          {campaign.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          Customize how this collection link appears to clients and manage the
          shareable URL.
        </p>
      </nav>

      {campaign.archivedAt ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-headline text-sm font-bold text-primary">
              This campaign is archived
            </p>
            <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
              The public link shows an archived message and does not accept new
              submissions. Restore when you are ready to collect again.
            </p>
          </div>
          <RestoreCampaignForm
            campaignId={campaign.id}
            campaignName={campaign.name}
            variant="emphasized"
          />
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-10 lg:gap-12">
        <div className="col-span-12 space-y-10 lg:col-span-7">
          <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
            <CampaignDefaultQuestions />
          </section>

          <CustomQuestionsEditor
            campaignId={campaign.id}
            campaignName={campaign.name}
            initialQuestions={(campaign.customQuestions ?? []) as any}
          />

          <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
            <h2 className="mb-2 font-headline text-lg font-bold text-primary">
              Campaign details
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Update the name or internal description. The public collection URL
              does not change.
            </p>
            <CampaignEditForm
              key={formKey}
              campaignId={campaign.id}
              defaultName={campaign.name}
              defaultDescription={campaign.description}
            />
          </section>

          <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
            <h2 className="mb-2 font-headline text-lg font-bold text-primary">
              Collection link
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Anyone with this link can submit a testimonial (no login required).
            </p>
            <CopyCollectionLink collectionUrl={collectionUrl} />
          </section>

          <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
            <h2 className="mb-2 font-headline text-lg font-bold text-primary">
              Wall of Love
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Public page showing approved testimonials only — safe to share after
              you moderate submissions.
            </p>
            <CopyCollectionLink collectionUrl={wallUrl} />
          </section>

          <section className="rounded-2xl border border-error-container/40 bg-error-container/15 p-6 md:p-8">
            <h2 className="text-sm font-semibold text-on-error-container">
              Danger zone
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Deleting removes this campaign from your dashboard and disables the
              collection link. Existing testimonial rows remain in the database.
            </p>
            <div className="mt-4">
              <DeleteCampaignForm
                campaignId={campaign.id}
                campaignName={campaign.name}
              />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-5" />
      </div>
    </div>
  );
}
