"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, Home, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 backdrop-blur-sm bg-gray-900/50 border border-gray-800 rounded-xl p-8 shadow-2xl shadow-black/50">
        <div className="flex justify-center">
          <div className="relative">
            <Ghost className="h-20 w-20 text-purple-500 animate-float" />
            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-md -z-10" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-200">
            Page Not Found
          </h2>
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-gradient-to-br from-gray-900 to-gray-950 gap-2 hover:text-white"
          >
            <Link href="/dashboard" className="text-white">
              <Rocket className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
