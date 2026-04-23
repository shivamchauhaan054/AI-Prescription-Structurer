"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import PrescriptionInput from "@/app/components/PrescriptionInput";
import { extractPrescription } from "@/app/lib/api";

export default function WorkspacePage() {
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#020617_0%,#040a1f_46%,#050f2b_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:100%_44px]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] [background-size:72px_100%]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_62%)]" />

      <main className="relative mx-auto w-full max-w-6xl space-y-6">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-white">Analyzer Workspace</h1>
              <p className="text-sm text-slate-300">
                Enter text, run extraction, and view structured result.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Back
            </Link>
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
