"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl border border-gray-700 shadow-lg shadow-black/50 overflow-hidden">
        <div className="bg-red-900/80 p-4 border-b border-red-800">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-300 mr-2" />
            <h2 className="text-xl font-bold text-red-100">Dashboard Error</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">
                  An unexpected error occurred in the dashboard
                </p>
                <p className="text-sm text-red-300 mt-1">
                  Error: check you network and try again
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => reset()}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Dashboard
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-sm font-medium text-red-400 hover:text-red-300 inline-flex items-center"
            >
              <Home className="mr-1 h-4 w-4" />
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
