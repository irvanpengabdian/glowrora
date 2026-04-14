import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CollectFormPreview } from "@/components/campaigns/collect-form-preview";
import { NewCampaignForm } from "./new-campaign-form";

export default function NewCampaignPage() {
  return (
    <div className="space-y-8">
      <nav className="mb-2" aria-label="Breadcrumb">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
          <Link href="/campaigns" className="transition hover:text-primary">
            Campaigns
          </Link>
          <ChevronRight className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          <span className="font-bold text-primary">New campaign</span>
        </div>
        <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-primary">
          New campaign
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          Name your pipeline and add internal notes. A shareable{" "}
          <code className="rounded-lg bg-surface-container-high px-1.5 py-0.5 text-xs">
            /collect/…
          </code>{" "}
          link is generated automatically.
        </p>
      </nav>

      <div className="grid grid-cols-12 gap-10 lg:gap-12">
        <div className="col-span-12 space-y-10 lg:col-span-7">
          <NewCampaignForm />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <CollectFormPreview
              campaignName="Your campaign name"
              highlightLine="What outcome did we help you achieve?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
