"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ExtractedResults from "@/app/components/ExtractedResults";
import type { ExtractResponse } from "@/app/types/prescription";

export default function ResultPage() {
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("structuredPrescriptionResult");
    if (!raw) return;
    try {
      setResult(JSON.parse(raw) as ExtractResponse);
    } catch {
      setResult(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <main className="mx-auto w-full max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {showJson ? "Structured JSON Output" : "Structured Results"}
          </h1>
          <div className="flex gap-2">
            {showJson && (
              <button
                type="button"
                onClick={() => setShowJson(false)}
                className="rounded-xl border border-cyan-600 bg-cyan-600/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-600/30"
              >
                Back to Structured Results
              </button>
            )}
            <Link
              href="/"
              className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Back to Extractor
            </Link>
          </div>
        </div>

        {result ? (
          showJson ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
                {JSON.stringify(result, null, 2)}
              </pre>
            </section>
          ) : (
            <ExtractedResults data={result} onViewJson={() => setShowJson(true)} />
          )
        ) : (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
              No extracted result found. Please go back and extract prescription data
              first.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
