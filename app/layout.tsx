import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import QueryProviders from "@/components/QueryProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | WaterWise`,
    default:
      "WaterWise - Water pipe Leakage Reporting and waste management App",
  },
  description: "Securely report any water pipe leakage to Administrators",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <div className="relative min-h-screen bg-black selection:bg-sky-50">
            <div className="fixed inset-0 -z-10 min-h-screen">
              <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_100%)]" />
              <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_100%)]" />
            </div>
            {session?.user?.role !== "ADMIN" && <Navbar />}

            <main className="">
              <QueryProviders>{children}</QueryProviders>
            </main>
          </div>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
