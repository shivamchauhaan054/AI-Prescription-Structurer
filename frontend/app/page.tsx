"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#020617_0%,#040a1f_46%,#050f2b_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:100%_44px]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] [background-size:72px_100%]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_62%)]" />

      <main className="relative mx-auto flex w-full max-w-7xl">
        <header className="animate-fade-up-delayed flex min-h-[calc(100vh-4rem)] w-full flex-col overflow-hidden rounded-3xl border border-indigo-300/20 bg-[linear-gradient(180deg,rgba(2,6,23,0.98)_0%,rgba(3,8,28,0.95)_45%,rgba(4,13,35,0.95)_100%)] shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-indigo-300/15 px-5 py-4 md:px-10">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-slate-100">
                Prescription Structurer
              </span>
              <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-200">
                AI
              </span>
            </div>
            <span className="rounded-lg border border-indigo-300/20 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300">
              FastAPI + Next.js
            </span>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-5 py-12 text-center md:px-10 md:py-20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(129,140,248,0.24),transparent_46%)]" />
            <div className="relative mx-auto max-w-4xl space-y-5">
              <p className="mx-auto w-fit rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1 text-xs font-medium tracking-wide text-violet-100">
                Structured Clinical Extraction
              </p>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                Prescription Text{" "}
                <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Analyzer
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-base text-slate-300 md:text-2xl">
                Convert unstructured doctor notes into validated, clean JSON
                output for clinical fields.
              </p>
              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 transition hover:from-violet-500 hover:to-fuchsia-400"
              >
                Open Workspace
              </button>
            </div>
          </div>
        </header>
      </main>
    </div>
  );
}
