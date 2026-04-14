"use client";

import { useCallback, useState } from "react";

type Props = {
  label: string;
  snippet: string;
};

export function CopyEmbedSnippet({ label, snippet }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [snippet]);

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-surface-container-low px-3 py-2 text-[11px] leading-relaxed text-primary-container">
        {snippet}
      </pre>
      <button type="button" onClick={copy} className="tf-btn-outline text-xs">
        {copied ? "Copied" : "Copy snippet"}
      </button>
    </div>
  );
}
