import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Syahreza Satria - Portfolio",
    template: "%s | Syahreza Satria",
  },
  description: "A personal portfolio of Syahreza Satria, a software engineer based in Indonesia, showcasing career milestones, certifications, and technical gears.",
  openGraph: {
    title: "Syahreza Satria - Portfolio",
    description: "Personal portfolio of Syahreza Satria, a software engineer crafting premium web experiences.",
    url: "https://syahrezasatria.dev", // Replace with your production domain
    siteName: "Syahreza Satria Portfolio",
    images: [
      {
        url: "/og-image.png", // Put a 1200x630 image at public/og-image.png
        width: 1200,
        height: 630,
        alt: "Syahreza Satria Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syahreza Satria - Portfolio",
    description: "Personal portfolio of Syahreza Satria, a software engineer crafting premium web experiences.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AuthProvider } from "@/lib/auth";
import PageTransitionLoader from "@/components/custom/PageTransitionLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-neutral-950 text-white pt-12 pb-24 md:pb-12 px-0" suppressHydrationWarning>
        <AuthProvider>
          <PageTransitionLoader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
