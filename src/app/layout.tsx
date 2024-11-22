import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react"
import NextTopLoader from "nextjs-toploader";
import { Toaster } from 'sonner';

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
  description: "An open-source lab offering straightforward tools like metadata analysis, shutter count checks, and format conversion.",
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
        position='bottom-center' duration={8000} richColors expand closeButton />
      </body>
    </html>
  );
}
