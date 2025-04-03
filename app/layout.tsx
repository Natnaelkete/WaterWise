import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import QueryProviders from "@/components/QueryProvider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeReport - Anonymous Crime Reporting App",
  description: "Securely and anonymously report crimes to law enforcement",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative min-h-screen bg-black selection:bg-sky-50">
          <div className="fixed inset-0 -z-10 min-h-screen">
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
            <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
          </div>
          <Providers>
            <Navbar />

            <main className="pt-16">
              <QueryProviders>{children}</QueryProviders>
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
