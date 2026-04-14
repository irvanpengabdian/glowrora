"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Props = {
  slug: string;
  campaignName?: string | null;
  withVideo: boolean;
};

type Dot = {
  id: string;
  leftPct: number;
  sizePx: number;
  color: string;
  durationSec: number;
  delaySec: number;
  opacity: number;
};

const CONFETTI_COLORS = ["#4DE0B0", "#A3F0D3", "#1A3A4F", "#E8E3D8", "#F59E0B"];

function encodeQuery(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

function buildShareUrls(opts: { url: string; campaignName?: string | null }) {
  const name = opts.campaignName?.trim() ? opts.campaignName.trim() : "this campaign";
  const baseText = `I just left a testimonial for ${name}.`;
  const fullText = `${baseText} ${opts.url}`;

  return {
    whatsapp: `https://wa.me/?${encodeQuery({ text: fullText })}`,
    twitter: `https://twitter.com/intent/tweet?${encodeQuery({ text: fullText })}`,
    instagram: opts.url, // Instagram doesn't support direct web share intents reliably
  };
}

export function ThankYouCelebration({ slug, campaignName, withVideo }: Props) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const dots = useMemo<Dot[]>(() => {
    const res: Dot[] = [];
    for (let i = 0; i < 22; i++) {
      const size = Math.random() * 6 + 3;
      res.push({
        id: `${i}-${Math.random().toString(16).slice(2)}`,
        leftPct: Math.random() * 100,
        sizePx: size,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        durationSec: Math.random() * 3 + 2,
        delaySec: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    return res;
  }, []);

  const collectUrl = origin ? `${origin}/collect/${encodeURIComponent(slug)}` : "";
  const share = collectUrl ? buildShareUrls({ url: collectUrl, campaignName }) : null;

  return (
    <div className="relative flex min-h-[580px] items-center justify-center overflow-hidden bg-[#FDFBF8] px-6 py-12">
      <div
        className="pointer-events-none absolute right-[-100px] top-[-80px] h-[400px] w-[400px]"
        style={{
          background:
            "radial-gradient(circle, rgba(77,224,176,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-60px] left-[-60px] h-[300px] w-[300px]"
        style={{
          background:
            "radial-gradient(circle, rgba(26,58,79,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dots.map((d) => (
          <div
            key={d.id}
            className="tf-confetti-dot"
            style={{
              width: `${d.sizePx}px`,
              height: `${d.sizePx}px`,
              background: d.color,
              left: `${d.leftPct}%`,
              animationDuration: `${d.durationSec}s`,
              animationDelay: `${d.delaySec}s`,
              opacity: d.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[520px] rounded-[20px] border border-[#E8E3D8] bg-white px-7 py-10 text-center shadow-[0_12px_40px_rgba(27,28,26,0.05)] sm:px-12 sm:py-12">
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-[#A3F0D3] bg-[#E8FFF6]">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
            <circle cx="18" cy="18" r="17" stroke="#A3F0D3" strokeWidth="1" />
            <path
              d="M10 18L15.5 23.5L26 13"
              stroke="#0F6E56"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.09em] text-secondary">
          Thank you
        </p>
        <h1 className="text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] text-primary-container">
          We received your
          <br />
          testimonial!
        </h1>
        <p className="mt-4 text-sm leading-[1.7] text-[#7A756B]">
          {campaignName ? (
            <>
              Your submission for{" "}
              <span className="font-semibold text-primary-container">
                {campaignName}
              </span>{" "}
              {withVideo ? "— including your video —" : ""} is pending review.
              <br />
              We'll feature it soon — your words truly matter.
            </>
          ) : (
            <>
              Your submission is pending review.
              <br />
              We'll feature it soon — your words truly matter.
            </>
          )}
        </p>

        <div className="my-7 h-px w-full bg-[#E8E3D8]" />

        <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C4BFB3]">
          Enjoyed the experience? Spread the word
        </p>

        <div className="mb-7 flex flex-wrap justify-center gap-2.5">
          <a
            href={share?.whatsapp ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!share}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8E3D8] bg-[#FDFBF8] px-4 py-2 text-[13px] font-medium text-primary-container transition hover:bg-[#E8FFF6] hover:text-secondary disabled:opacity-60"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <rect width="15" height="15" rx="3" fill="#25D366" />
              <path
                d="M7.5 2.5C4.74 2.5 2.5 4.74 2.5 7.5c0 .88.23 1.71.63 2.43L2.5 12.5l2.67-.62A5 5 0 0 0 7.5 12.5c2.76 0 5-2.24 5-5s-2.24-5-5-5zm2.4 6.67c-.1.28-.58.54-.8.57-.2.03-.46.04-.74-.05-.17-.05-.39-.13-.67-.25-1.18-.51-1.95-1.7-2.01-1.78-.06-.08-.49-.65-.49-1.24 0-.59.31-.88.42-.99.11-.11.24-.14.32-.14h.23c.07 0 .17-.03.26.2l.37.9c.03.08.05.17.01.26-.04.09-.06.15-.12.23l-.18.21c-.06.07-.13.14-.06.27.07.13.32.53.69.86.47.42 1.00 .67 1.14.74.14.07.22.06.3-.04.08-.1.34-.4.43-.54.09-.14.18-.11.3-.07l.97.46c.14.06.23.09.26.15.03.06.03.34-.07.62z"
                fill="white"
              />
            </svg>
            WhatsApp
          </a>

          <a
            href={share?.twitter ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!share}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8E3D8] bg-[#FDFBF8] px-4 py-2 text-[13px] font-medium text-primary-container transition hover:bg-[#E6F1FB] hover:text-[#185FA5]"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <rect width="15" height="15" rx="3" fill="#1D9BF0" />
              <path
                d="M11.5 4.5s-.8.4-1.2.5c-.5-.6-1.3-.6-1.8-.1-.5.4-.7 1.1-.5 1.7C6.5 6.5 5 5.5 4 4.5c-.5.8-.3 1.8.5 2.4-.3 0-.6-.1-.8-.3 0 .9.6 1.7 1.5 1.9-.3.1-.6.1-.8 0 .2.8 1 1.3 1.8 1.3C5.5 10.4 4.5 10.7 3.5 10.7c.9.6 2 .9 3 .8 3.7-.2 5.8-3 5.7-5.8 0-.1 0-.2 0-.2.4-.3.7-.7 1-.1-.4.2-.8.3-1.1.3.4-.2.7-.6.8-1l-.4.4z"
                fill="white"
              />
            </svg>
            Twitter / X
          </a>

          <a
            href={share?.instagram ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!share}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8E3D8] bg-[#FDFBF8] px-4 py-2 text-[13px] font-medium text-primary-container transition hover:bg-[#E8F0F5] hover:text-primary-container"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path
                d="M10 2H5a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z"
                stroke="#E4405F"
                strokeWidth="1.2"
              />
              <circle cx="7.5" cy="7.5" r="2" stroke="#E4405F" strokeWidth="1.2" />
              <circle cx="10.8" cy="4.2" r="0.5" fill="#E4405F" />
            </svg>
            Instagram
          </a>
        </div>

        <Link
          href={`/collect/${slug}`}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#C4BFB3] transition hover:text-primary-container"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M8.5 3L5 7l3.5 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to collection page
        </Link>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-2 text-[11px] text-[#C4BFB3]">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-primary-container">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5L4.5 7.5L8.5 3"
              stroke="#4DE0B0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>
          Powered by{" "}
          <span className="font-semibold text-[#7A756B]">Glowrora</span>
        </span>
      </div>
    </div>
  );
}

