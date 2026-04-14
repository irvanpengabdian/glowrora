"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  collectionUrl: string;
  open: boolean;
  onClose: () => void;
  campaignName: string;
};

export function ShareCampaignModal({
  collectionUrl,
  open,
  onClose,
  campaignName,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(collectionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [collectionUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 tf-modal-backdrop backdrop-blur-md"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-surface p-10 shadow-[0_32px_80px_rgba(0,36,56,0.15)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-campaign-title"
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h3
              id="share-campaign-title"
              className="font-headline text-2xl font-extrabold tracking-tight text-primary"
            >
              Share campaign
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              Send this link to your customers
            </p>
            <p className="mt-0.5 text-xs text-on-surface-variant/80">
              {campaignName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/10 bg-surface-container-high p-5">
            <code className="min-w-0 flex-1 truncate text-sm font-medium text-secondary">
              {collectionUrl}
            </code>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg p-2 text-primary transition-colors hover:text-secondary"
              aria-label="Copy link"
            >
              {copied ? (
                <span className="text-xs font-bold text-secondary">OK</span>
              ) : (
                <span className="text-xs font-semibold">Copy</span>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-secondary py-4 text-sm font-bold text-on-secondary shadow-lg shadow-secondary/20 transition hover:opacity-90"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent("Share your experience")}&body=${encodeURIComponent(`Hi,\n\nWe would love your feedback: ${collectionUrl}`)}`}
            className="flex w-full items-center justify-center rounded-full bg-surface-container-low py-4 text-sm font-bold text-primary transition hover:bg-surface-container-high"
          >
            Send via email
          </a>
        </div>

        <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">
          Calm authority · Security guaranteed
        </p>
      </div>
    </div>
  );
}
