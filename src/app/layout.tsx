import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Lora, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import { glowroraClerkAppearance } from "@/lib/clerk-appearance";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Glowrora",
  description: "Testimonial collector and Wall of Love",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={glowroraClerkAppearance}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html
        lang="en"
        className={`${inter.variable} ${plusJakarta.variable} ${playfair.variable} ${lora.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-on-surface">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
