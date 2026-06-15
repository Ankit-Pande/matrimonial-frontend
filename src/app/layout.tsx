import type { Metadata } from "next";
import { Fraunces, Mukta } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});
const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

// SEO defaults — har public page apna title override kar sakta hai.
export const metadata: Metadata = {
  title: "Var Kanya Parichay Kendra — Find Your Life Partner",
  description:
    "Trusted marriage bureau with verified matrimonial profiles, complete privacy, and personal matchmaking. Register free.",
  keywords: ["matrimony", "marriage bureau", "shaadi", "life partner", "rishta"],
  openGraph: {
    title: "Var Kanya Parichay Kendra — Find Your Life Partner",
    description: "Verified profiles, complete privacy, trusted matchmaking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${mukta.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
