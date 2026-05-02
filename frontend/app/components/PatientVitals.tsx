"use client";

import { User, Activity, Thermometer, Weight, Hash } from "lucide-react";
import type { ExtractResponse } from "@/app/types/prescription";

interface PatientVitalsProps {
  data: ExtractResponse;
}

export default function PatientVitals({ data }: PatientVitalsProps) {
  const { patient_info, vitals } = data;

  const hasPatientInfo = patient_info && (patient_info.name || patient_info.age || patient_info.gender);
  const hasVitals = vitals && (vitals.bp || vitals.pulse || vitals.temperature || vitals.weight);

  if (!hasPatientInfo && !hasVitals) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Patient Info Card */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2 text-indigo-300">
          <User size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">Patient Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">Full Name</p>
            <p className="text-sm font-medium text-white">{patient_info?.name || "N/A"}</p>
          </div>
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Age</p>
              <p className="text-sm font-medium text-white">{patient_info?.age || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Gender</p>
              <p className="text-sm font-medium text-white capitalize">{patient_info?.gender || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2 text-emerald-300">
          <Activity size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">Clinical Vitals</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Activity size={12} />
              <p className="text-xs">BP</p>
            </div>
            <p className="text-sm font-medium text-white">{vitals?.bp || "--"}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Activity size={12} className="rotate-90" />
              <p className="text-xs">Pulse</p>
            </div>
            <p className="text-sm font-medium text-white">{vitals?.pulse || "--"}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Thermometer size={12} />
              <p className="text-xs">Temp</p>
            </div>
            <p className="text-sm font-medium text-white">{vitals?.temperature || "--"}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Weight size={12} />
              <p className="text-xs">Weight</p>
            </div>
            <p className="text-sm font-medium text-white">{vitals?.weight || "--"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
