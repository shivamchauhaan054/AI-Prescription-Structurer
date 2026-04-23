"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-200/60 bg-blue-500/10 p-4 text-blue-50 backdrop-blur">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200/70 border-t-cyan-300" />
      <p className="text-sm font-medium">
        Running AI extraction and validating structured output...
      </p>
    </div>
  );
}
