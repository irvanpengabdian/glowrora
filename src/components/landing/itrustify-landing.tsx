"use client";

import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ItrustifyLandingBody } from "@/components/landing/itrustify-landing-body";

const LANG_KEY = "glowrora-lang";

type Lang = "id" | "en";

function toggleFaqItem(el: HTMLElement) {
  const grid = el.closest(".faq-grid");
  if (!grid) return;
  const wasOpen = el.classList.contains("open");
  grid.querySelectorAll(".faq-item").forEach((n) => n.classList.remove("open"));
  if (!wasOpen) el.classList.add("open");
}

export function ItrustifyLanding() {
  const [lang, setLangState] = useState<Lang>("id");
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem(LANG_KEY);
      if (s === "en") {
        // Persisted language; effect avoids SSR/localStorage mismatch on first paint.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount rehydration
        setLangState("en");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    root.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const onScroll = () => {
      navEl.style.boxShadow =
        window.scrollY > 60 ? "0 4px 24px rgba(26,58,79,.06)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rootClass =
    lang === "en" ? "itrustify-root lang-en" : "itrustify-root lang-id";

  return (
    <div ref={rootRef} className={rootClass}>
      <nav id="main-nav" ref={navRef}>
        <Link className="nav-logo" href="/">
          <div className="nav-logo-icon" aria-hidden>
            <img
              src="/brand/logo-mark.png"
              alt=""
              className="nav-logo-img"
              width={28}
              height={28}
              loading="eager"
              decoding="async"
            />
          </div>
          <span className="nav-logo-text">Glowrora</span>
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#how" data-lang="id">
              Cara Kerja
            </a>
            <a href="#how" data-lang="en">
              How It Works
            </a>
          </li>
          <li>
            <a href="#features" data-lang="id">
              Fitur
            </a>
            <a href="#features" data-lang="en">
              Features
            </a>
          </li>
          <li>
            <a href="#pricing" data-lang="id">
              Harga
            </a>
            <a href="#pricing" data-lang="en">
              Pricing
            </a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className="nav-right">
          <div className="lang-switcher">
            <button
              type="button"
              className={`lang-btn${lang === "id" ? " active" : ""}`}
              id="btn-id"
              onClick={() => setLang("id")}
            >
              ID
            </button>
            <button
              type="button"
              className={`lang-btn${lang === "en" ? " active" : ""}`}
              id="btn-en"
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
          <Show when="signed-out">
            <>
              <Link href="/sign-in" className="btn-nav-ghost" data-lang="id">
                Masuk
              </Link>
              <Link href="/sign-in" className="btn-nav-ghost" data-lang="en">
                Log In
              </Link>
              <Link href="/sign-up" className="btn-nav-primary" data-lang="id">
                Mulai Gratis →
              </Link>
              <Link href="/sign-up" className="btn-nav-primary" data-lang="en">
                Start Free →
              </Link>
            </>
          </Show>
          <Show when="signed-in">
            <div
              style={{ display: "flex", alignItems: "center", gap: 12 }}
              className="nav-signed-in"
            >
              <Link href="/dashboard" className="btn-nav-ghost">
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9 ring-1 ring-[#C4BFB3]/40",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </nav>

      <ItrustifyLandingBody toggleFaq={toggleFaqItem} />
    </div>
  );
}
