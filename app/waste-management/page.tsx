"use client";

import { useState } from "react";
import { getAIResult } from "./action";

type outputProps = {
  general_description: string;
  waste_analysis: wasteAnalysisProps[];
  environmental_assessment: environmentalAssessmentProps;
};

type wasteAnalysisProps = {
  item_type: string;
  disposal_instructions: string;
  recyclable: boolean;
  reuse_suggestions: string;
};

type environmentalAssessmentProps = {
  health_status: string;
  justification: string;
};

type ResultState<T> = {
  success: boolean;
  message: T;
};

export default function WasteManagementPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResultState<outputProps | string>>({
    success: false,
    message: {
      general_description: "",
      waste_analysis: [
        {
          item_type: "",
          disposal_instructions: "",
          recyclable: false,
          reuse_suggestions: "",
        },
      ],
      environmental_assessment: {
        health_status: "",
        justification: "",
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      setImage(base64 as string);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const aiResult = await getAIResult(image as string);
      setResult(aiResult);
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative px-6 pt-32 pb-20 min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <div className="mx-auto max-w-4xl">
        {/* Upload Section */}
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 mb-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`block w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all duration-200 ${
                  image
                    ? "border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-500/5"
                    : "border-gray-600 hover:border-sky-500/50 bg-gray-700/20"
                }`}
              >
                {image ? (
                  <div className="space-y-4">
                    <div className="w-full h-48 relative rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-400">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-sky-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Drop an image here or click to upload
                    </p>
                  </div>
                )}
              </label>
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="animate-spin h-5 w-5 text-sky-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sky-400 font-medium">
                      Analyzing image...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !image}
              className={`w-full relative group overflow-hidden rounded-xl px-4 py-3.5 text-sm font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                image
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <div className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Waste</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Results Section */}

        {result.success && typeof result.message !== "string" && (
          <div className="space-y-8 animate-fade-in">
            {/* General Description */}
            <div className="bg-gray-800/70 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Scene Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {result.message.general_description}
              </p>
            </div>

            {/* Waste Analysis */}
            <div className="bg-gray-800/70 rounded-2xl border border-gray-700 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-amber-400 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Waste Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.message.waste_analysis.map((item, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border ${
                      item.recyclable
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {item.item_type}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.recyclable
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {item.recyclable ? "Recyclable" : "Not Recyclable"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Disposal Instructions
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {item.disposal_instructions}
                        </p>
                      </div>

                      {item.reuse_suggestions && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-1 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Reuse Suggestions
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {item.reuse_suggestions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Assessment */}
            <div
              className={`rounded-2xl border p-6 backdrop-blur-sm ${
                result.message.environmental_assessment.health_status ===
                "Unhealthy and Hazardous"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-gray-800/70 border-gray-700"
              }`}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                {result.message.environmental_assessment.health_status ===
                "Unhealthy and Hazardous" ? (
                  <>
                    <svg
                      className="w-6 h-6 mr-2 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-red-400">Environmental Alert</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-blue-400">
                      Environmental Assessment
                    </span>
                  </>
                )}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.message.environmental_assessment.health_status ===
                      "Unhealthy and Hazardous"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {result.message.environmental_assessment.health_status}
                  </span>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Detailed Assessment
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {result.message.environmental_assessment.justification}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {result.success === false && typeof result.message === "string" && (
          <div className="bg-red-900/30 rounded-2xl border border-red-700/50 p-6 backdrop-blur-sm animate-fade-in">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-red-200">{result.message}</p>
                <button
                  onClick={() => setResult({ success: false, message: "" })}
                  className="mt-4 text-sm text-red-300 hover:text-white underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
