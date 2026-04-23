"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import PrescriptionInput from "@/app/components/PrescriptionInput";
import { extractPrescription } from "@/app/lib/api";

export default function Home() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter prescription text before extracting.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await extractPrescription({ text: inputText });
      sessionStorage.setItem("structuredPrescriptionResult", JSON.stringify(response));
      setInputText("");
      router.push("/result");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail =
          typeof err.response?.data?.detail === "string"
            ? err.response.data.detail
            : null;
        setError(detail ?? "Failed to extract prescription data. Please try again.");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setError(null);
    sessionStorage.removeItem("structuredPrescriptionResult");
  };

  const scrollToWorkspace = () => {
    const workspace = document.getElementById("workspace");
    if (!workspace) return;
    workspace.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(16,185,129,0.2),_transparent_35%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float-delayed" />

      <main className="relative mx-auto w-full max-w-6xl space-y-6">
        <header className="animate-fade-up-delayed rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl md:p-9">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Prescription Text Analyzer
            </h1>
            <p className="max-w-3xl text-sm text-slate-300 md:text-base">
              Upload raw prescription text, extract structured clinical fields,
              and review clean output in an app-style workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToWorkspace}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-cyan-600"
              >
                Open Analyzer
              </button>
            </div>
          </div>
        </header>

        <section id="workspace" className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Analyzer Workspace</h2>
              <p className="text-sm text-slate-300">
                Enter text, run extraction, and view structured result.
              </p>
            </div>
          </div>

          {!isLoading && (
            <PrescriptionInput
              value={inputText}
              isLoading={isLoading}
              onChange={setInputText}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          )}

          {isLoading && <LoadingSpinner />}

          {error && (
            <div className="rounded-xl border border-red-300/50 bg-red-500/10 p-4 text-sm text-red-100 backdrop-blur">
              {error}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
