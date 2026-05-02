"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Code, ChevronLeft, ChevronRight, Share2, Printer } from "lucide-react";

import ExtractedResults from "@/app/components/ExtractedResults";
import type { ExtractResponse } from "@/app/types/prescription";

export default function ResultPage() {
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [originalText, setOriginalText] = useState<string>("");
  const [showJson, setShowJson] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const rawResult = sessionStorage.getItem("structuredPrescriptionResult");
    const rawText = sessionStorage.getItem("originalPrescriptionText");
    
    if (rawResult) {
      try {
        setResult(JSON.parse(rawResult) as ExtractResponse);
      } catch {
        setResult(null);
      }
    }

    if (rawText) {
      setOriginalText(rawText);
    }
  }, []);

  const handleExport = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "prescription_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen flex-col bg-[#020617] text-slate-200 overflow-hidden">
      {/* Top Navbar */}
      <nav className="flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/50 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link 
            href="/workspace" 
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <h1 className="text-sm font-bold tracking-tight text-white md:text-base">
            Analysis Results
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10 md:flex"
          >
            <Printer size={14} /> Print
          </button>
          <button 
            onClick={handleExport}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:bg-white/10 md:flex"
          >
            <Share2 size={14} /> Export
          </button>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link
            href="/"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-500"
          >
            New Extraction
          </Link>
        </div>
      </nav>

      {/* Main Content: Split View */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel: Original Text (Toggleable) */}
        <div 
          className={`relative flex flex-col border-r border-white/10 bg-[#040a1f] transition-all duration-300 ${
            isSidebarOpen ? "w-[400px]" : "w-0"
          }`}
        >
          <div className="flex h-12 items-center justify-between border-b border-white/5 px-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <FileText size={14} />
              Original Text
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md p-1 hover:bg-white/5"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-relaxed text-slate-300">
              {originalText ? (
                <pre className="whitespace-pre-wrap font-sans">
                  {originalText}
                </pre>
              ) : (
                <p className="italic text-slate-500">No original text found in session.</p>
              )}
            </div>
            
            <div className="mt-6 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">How to Review</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                The AI has structured the text on the right. You can compare the extracted fields with this original note to ensure accuracy. If you find any discrepancies, use the "Edit" button to correct them.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button (when closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-20 z-10 flex h-10 w-6 items-center justify-center rounded-r-lg bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Right Panel: Structured Output */}
        <div className="flex-1 overflow-y-auto bg-[#020617] p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-8">
            {result ? (
              showJson ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">JSON Representation</h2>
                    <button 
                      onClick={() => setShowJson(false)}
                      className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      <ArrowLeft size={14} /> Back to Visual View
                    </button>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                    <pre className="overflow-x-auto text-xs text-indigo-300">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <ExtractedResults 
                  data={result} 
                  onViewJson={() => setShowJson(true)} 
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-slate-700">
                  <FileText size={32} />
                </div>
                <h2 className="text-xl font-bold text-white">No Results Found</h2>
                <p className="mt-2 text-slate-400">
                  Please go back to the workspace and enter a prescription to analyze.
                </p>
                <Link
                  href="/workspace"
                  className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
                >
                  Go to Workspace
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="flex h-10 items-center justify-between border-t border-white/10 bg-slate-950/80 px-6 text-[10px] text-slate-500">
        <div className="flex items-center gap-4">
          <span>AI Engine: Llama-3.3-70B</span>
          <span>Status: Verified Clinical Schema 1.2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
        </div>
      </footer>
    </div>
  );
}
