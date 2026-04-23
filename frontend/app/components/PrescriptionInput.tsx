"use client";

type PrescriptionInputProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export default function PrescriptionInput({
  value,
  isLoading,
  onChange,
  onSubmit,
  onClear,
}: PrescriptionInputProps) {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-900/85 to-slate-800/80 p-6 shadow-2xl shadow-blue-950/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">Raw Prescription Text</h2>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Paste • Extract • Validate
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-300">
        Paste doctor notes or prescription content exactly as provided.
      </p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 min-h-56 w-full rounded-xl border border-slate-500/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:bg-slate-950/80 focus:ring-4 focus:ring-cyan-400/20"
        placeholder="Example: Tab Paracetamol 650 mg BD x 5 days..."
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:from-blue-700 hover:to-cyan-600 disabled:cursor-not-allowed disabled:from-blue-300 disabled:to-cyan-300"
        >
          {isLoading ? "Extracting..." : "Get Structured Data"}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="rounded-xl border border-slate-400/60 bg-slate-800/70 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Clear Input
        </button>
      </div>
    </section>
  );
}
