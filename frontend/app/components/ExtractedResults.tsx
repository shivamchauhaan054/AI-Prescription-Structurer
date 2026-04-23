"use client";

import type { ExtractResponse } from "@/app/types/prescription";

type ExtractedResultsProps = {
  data: ExtractResponse;
  onViewJson: () => void;
};

function SectionCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-600/40 bg-slate-900/60 p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">No data found.</p>
      ) : (
        <ul className="mt-2 space-y-2 text-sm text-slate-100">
          {items.map((item) => (
            <li
              key={`${title}-${item}`}
              className="rounded-md border border-slate-700/60 bg-slate-800/70 px-2 py-1"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ExtractedResults({
  data,
  onViewJson,
}: ExtractedResultsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-900/85 to-slate-800/80 p-6 shadow-2xl shadow-blue-950/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-100">Structured Results</h2>
        <button
          type="button"
          onClick={onViewJson}
          className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-teal-600"
        >
          View JSON
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Chief Complaints" items={data.chief_complaints} />
        <SectionCard title="Diagnosis" items={data.diagnosis} />
        <SectionCard title="Lab Tests" items={data.lab_tests} />
        <SectionCard title="Radiology Tests" items={data.radiology_tests} />
      </div>

      <SectionCard title="Advice" items={data.advice} />

      <div className="rounded-xl border border-slate-600/40 bg-slate-900/60 p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
          Medications
        </h3>
        {data.medications.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No medications found.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {data.medications.map((medication, index) => (
              <div
                key={`${medication.name ?? "unknown"}-${index}`}
                className="rounded-xl border border-slate-700/60 bg-slate-800/70 p-4 text-sm text-slate-100"
              >
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {medication.name ?? "null"}
                </p>
                <p>
                  <span className="font-semibold">Dosage:</span>{" "}
                  {medication.dosage ?? "null"}
                </p>
                <p>
                  <span className="font-semibold">Frequency:</span>{" "}
                  {medication.frequency ?? "null"}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {medication.duration ?? "null"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
