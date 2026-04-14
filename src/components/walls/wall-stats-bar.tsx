"use client";

import { Eye, LayoutGrid, MessageSquareQuote } from "lucide-react";

type Props = {
  totalWalls: number;
  totalTestimonials: number;
  totalViews: number;
};

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 font-headline text-xl font-extrabold tracking-tight text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}

export function WallStatsBar({ totalWalls, totalTestimonials, totalViews }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat
        label="Total walls"
        value={totalWalls.toLocaleString()}
        Icon={LayoutGrid}
      />
      <Stat
        label="Total testimonials"
        value={totalTestimonials.toLocaleString()}
        Icon={MessageSquareQuote}
      />
      <Stat
        label="Total views"
        value={totalViews.toLocaleString()}
        Icon={Eye}
      />
    </div>
  );
}

