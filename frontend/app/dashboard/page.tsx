"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, ShieldAlert, Clock, Activity, Loader2 } from "lucide-react";
import StatCard from "@/app/components/Dashboard/StatCard";
import DiagnosesChart from "@/app/components/Dashboard/DiagnosesChart";
import ActivityChart from "@/app/components/Dashboard/ActivityChart";
import { 
  getHistory, 
  calculateKPIs, 
  aggregateDiagnoses, 
  aggregateActivity,
  type ExtractionHistoryItem 
} from "@/app/lib/analyticsUtils";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<ExtractionHistoryItem[]>([]);
  const [kpis, setKpis] = useState({ totalProcessed: 0, interactionsPrevented: 0, avgProcessingTime: "0s", accuracyRate: "0%" });
  const [diagnoses, setDiagnoses] = useState<{name: string, count: number}[]>([]);
  const [activity, setActivity] = useState<{name: string, prescriptions: number}[]>([]);

  useEffect(() => {
    // Load data from localStorage only on the client side
    const data = getHistory();
    setHistory(data);
    setKpis(calculateKPIs(data));
    setDiagnoses(aggregateDiagnoses(data));
    setActivity(aggregateActivity(data));
    setIsLoading(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-8">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#020617_0%,#040a1f_46%,#050f2b_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:100%_44px]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] [background-size:72px_100%]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_62%)]" />

      <main className="relative mx-auto w-full max-w-7xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clinic Analytics</h1>
            <p className="text-slate-400">Enterprise overview of your local prescription processing.</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </header>

        {isLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-400" />
            <p className="text-slate-400">Loading your search analytics...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <FileText className="mb-4 h-16 w-16 text-slate-600" />
            <h2 className="text-2xl font-bold text-white">No Analytics Data Yet</h2>
            <p className="mt-2 max-w-md text-slate-400">
              Your dashboard is currently empty. Go to the Workspace and extract some prescriptions to see your personal statistics populate here!
            </p>
            <Link
              href="/workspace"
              className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500"
            >
              Go to Workspace
            </Link>
          </div>
        ) : (
          <>
            {/* KPIs Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Processed" 
                value={kpis.totalProcessed} 
                icon={<FileText size={20} />} 
              />
              <StatCard 
                title="Interactions Prevented" 
                value={kpis.interactionsPrevented} 
                icon={<ShieldAlert size={20} />} 
              />
              <StatCard 
                title="Avg Processing Time" 
                value={kpis.avgProcessingTime} 
                icon={<Clock size={20} />} 
              />
              <StatCard 
                title="Extraction Accuracy" 
                value={kpis.accuracyRate} 
                icon={<Activity size={20} />} 
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ActivityChart data={activity} />
              <DiagnosesChart data={diagnoses} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
