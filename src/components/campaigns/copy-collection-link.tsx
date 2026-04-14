"use client";

import { useCallback, useState } from "react";

type Props = {
  /** Full URL shown and copied, e.g. `https://app.example/collect/abc`. */
  collectionUrl: string;
};

export function CopyCollectionLink({ collectionUrl }: Props) {
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

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <code className="block flex-1 truncate rounded-xl bg-surface-container-low px-3 py-2 text-xs text-primary-container sm:text-sm">
        {collectionUrl}
      </code>
      <button
        type="button"
        onClick={copy}
        className="tf-btn-outline shrink-0"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
