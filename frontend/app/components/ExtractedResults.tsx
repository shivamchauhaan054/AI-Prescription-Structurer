"use client";

import { useState } from "react";
import { 
  Clipboard, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Pill, 
  Stethoscope, 
  FileText, 
  FlaskConical, 
  Layers, 
  MessageSquare,
  Edit2,
  Save,
  X
} from "lucide-react";
import type { ExtractResponse, Medication } from "@/app/types/prescription";
import PatientVitals from "./PatientVitals";

type ExtractedResultsProps = {
  data: ExtractResponse;
  onViewJson: () => void;
};

export default function ExtractedResults({
  data,
  onViewJson,
}: ExtractedResultsProps) {
  const [editableData, setEditableData] = useState<ExtractResponse>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(editableData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateField = (section: keyof ExtractResponse, index: number, value: string) => {
    const newData = { ...editableData };
    if (Array.isArray(newData[section])) {
      (newData[section] as any)[index] = value;
    }
    setEditableData(newData);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const newData = { ...editableData };
    (newData.medications[index] as any)[field] = value;
    setEditableData(newData);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Extraction Summary</h2>
            <p className="text-xs text-slate-400">Review and verify the structured clinical data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isEditing 
                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30" 
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {isEditing ? <><Save size={16} /> Finish Editing</> : <><Edit2 size={16} /> Edit Data</>}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Clipboard size={16} />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
          <button
            onClick={onViewJson}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/20 transition hover:from-violet-500 hover:to-indigo-500"
          >
            Raw JSON
          </button>
        </div>
      </div>

      {/* Patient & Vitals */}
      <PatientVitals data={editableData} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Complaints & Diagnosis */}
        <div className="space-y-6">
          <Section 
            icon={<MessageSquare size={18} />} 
            title="Chief Complaints" 
            items={editableData.chief_complaints}
            isEditing={isEditing}
            onUpdate={(idx, val) => updateField("chief_complaints", idx, val)}
            color="sky"
          />
          <Section 
            icon={<Stethoscope size={18} />} 
            title="Diagnosis" 
            items={editableData.diagnosis}
            isEditing={isEditing}
            onUpdate={(idx, val) => updateField("diagnosis", idx, val)}
            color="rose"
          />
        </div>

        {/* Right Column: Tests & Advice */}
        <div className="space-y-6">
          <Section 
            icon={<FlaskConical size={18} />} 
            title="Lab Tests" 
            items={editableData.lab_tests}
            isEditing={isEditing}
            onUpdate={(idx, val) => updateField("lab_tests", idx, val)}
            color="emerald"
          />
          <Section 
            icon={<Layers size={18} />} 
            title="Radiology Tests" 
            items={editableData.radiology_tests}
            isEditing={isEditing}
            onUpdate={(idx, val) => updateField("radiology_tests", idx, val)}
            color="amber"
          />
        </div>
      </div>

      {/* Medications (Full Width) */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Pill size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Prescribed Medications</h3>
          </div>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            {editableData.medications.length} Items Found
          </span>
        </div>

        {editableData.medications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-12 text-slate-500">
            <Pill size={40} className="mb-3 opacity-20" />
            <p>No medications identified in this prescription.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {editableData.medications.map((med, idx) => (
              <MedicationCard 
                key={idx} 
                med={med} 
                isEditing={isEditing}
                onUpdate={(field, val) => updateMedication(idx, field, val)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Advice Section */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
            <FileText size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">General Advice & Instructions</h3>
        </div>
        <ul className="space-y-3">
          {editableData.advice.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No specific advice recorded.</p>
          ) : (
            editableData.advice.map((item, idx) => (
              <li key={idx} className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition hover:bg-white/10">
                <ChevronRight size={16} className="mt-0.5 text-teal-500" />
                {isEditing ? (
                  <input 
                    className="w-full bg-transparent text-sm text-slate-200 outline-none focus:text-white"
                    value={item}
                    onChange={(e) => updateField("advice", idx, e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-slate-200">{item}</p>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

function Section({ icon, title, items, isEditing, onUpdate, color }: any) {
  const colorMap: any = {
    sky: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colorMap[color].split(' ').slice(1).join(' ')} ${colorMap[color].split(' ')[0]}`}>
          {icon}
        </div>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 italic">None detected.</p>
        ) : (
          items.map((item: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300">
              {isEditing ? (
                <input 
                  className="w-full bg-transparent outline-none focus:text-white"
                  value={item}
                  onChange={(e) => onUpdate(idx, e.target.value)}
                />
              ) : (
                <span>{item}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MedicationCard({ med, isEditing, onUpdate }: { med: Medication, isEditing: boolean, onUpdate: (field: keyof Medication, val: string) => void }) {
  const confidenceColor = (med.confidence_score || 0) > 0.8 ? "text-emerald-400" : (med.confidence_score || 0) > 0.5 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <div className="flex items-start justify-between">
        {isEditing ? (
          <input 
            className="w-full bg-transparent font-bold text-white outline-none"
            value={med.name || ""}
            onChange={(e) => onUpdate("name", e.target.value)}
          />
        ) : (
          <h4 className="font-bold text-white">{med.name || "Unknown Medicine"}</h4>
        )}
        <div className={`flex items-center gap-1 text-[10px] font-bold ${confidenceColor}`}>
          <AlertCircle size={10} />
          {Math.round((med.confidence_score || 0) * 100)}%
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <p className="text-slate-500">Dosage</p>
          {isEditing ? (
            <input 
              className="w-full bg-transparent text-slate-200 outline-none"
              value={med.dosage || ""}
              onChange={(e) => onUpdate("dosage", e.target.value)}
            />
          ) : (
            <p className="text-slate-200">{med.dosage || "--"}</p>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-slate-500">Frequency</p>
          {isEditing ? (
            <input 
              className="w-full bg-transparent text-slate-200 outline-none"
              value={med.frequency || ""}
              onChange={(e) => onUpdate("frequency", e.target.value)}
            />
          ) : (
            <p className="text-slate-200">{med.frequency || "--"}</p>
          )}
        </div>
        <div className="col-span-2 space-y-1">
          <p className="text-slate-500">Duration</p>
          {isEditing ? (
            <input 
              className="w-full bg-transparent text-slate-200 outline-none"
              value={med.duration || ""}
              onChange={(e) => onUpdate("duration", e.target.value)}
            />
          ) : (
            <p className="text-slate-200">{med.duration || "--"}</p>
          )}
        </div>
      </div>

      {med.evidence && (
        <div className="mt-2 border-t border-white/5 pt-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Evidence from text</p>
          <p className="mt-1 text-[11px] italic text-slate-400">"{med.evidence}"</p>
        </div>
      )}
    </div>
  );
}
