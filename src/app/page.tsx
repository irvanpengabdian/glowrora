import type { Metadata } from "next";

import { ItrustifyLanding } from "@/components/landing/itrustify-landing";

import "./itrustify-landing.css";

export const metadata: Metadata = {
  title: "Glowrora — Testimonial Platform for Modern Businesses",
  description:
    "Collect text and video testimonials without client sign-up, then embed elegant social proof on any website.",
};

export default function Home() {
  return <ItrustifyLanding />;
}
