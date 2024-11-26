import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "imgxLab - An open-source lab for photographers, built by photographers.",
  description:
    "An open-source lab offering straightforward tools like metadata analysis, shutter count checks, and format conversion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
    lang="en"
    suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 px-2`}
      >
        {/* Grid background applied here */}
        <div className="bg-zinc-950 bg-grid-white/[0.10] relative items-center justify-center">
          {/* Radial gradient overlay */}
          <div className="absolute pointer-events-none inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>
          
          {/* Page-specific content */}
          <div className="relative z-10">
            <NextTopLoader
              color="#fb923c"
              height={4}
              showSpinner={false}
              speed={200}
              easing="ease"
            />
            <Header />
            {children}
            <Analytics />
            <Toaster
              position="bottom-center"
              duration={8000}
              richColors
              expand
              closeButton
            />
          </div>
        </div>
      </body>
    </html>
  );
}
