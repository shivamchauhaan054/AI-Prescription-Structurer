"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type DiagnosesChartProps = {
  data: { name: string; count: number }[];
};

export default function DiagnosesChart({ data }: DiagnosesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-bold text-white">Most Common Diagnoses</h3>
          <p className="text-xs text-slate-400">Top recurring conditions</p>
        </div>
        <div className="flex h-full items-center justify-center text-slate-500">
          <p>No diagnoses data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div>
        <h3 className="text-lg font-bold text-white">Most Common Diagnoses</h3>
        <p className="text-xs text-slate-400">Top recurring conditions</p>
      </div>
      
      <div className="h-full w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12 }} 
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#8b5cf6" : "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
