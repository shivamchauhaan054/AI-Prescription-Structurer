"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type ActivityChartProps = {
  data: { name: string; prescriptions: number }[];
};

export default function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-bold text-white">Processing Volume</h3>
          <p className="text-xs text-slate-400">Prescriptions processed over the last 7 days</p>
        </div>
        <div className="flex h-full items-center justify-center text-slate-500">
          <p>No activity data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div>
        <h3 className="text-lg font-bold text-white">Processing Volume</h3>
        <p className="text-xs text-slate-400">Prescriptions processed over the last 7 days</p>
      </div>
      
      <div className="h-full w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12 }} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
              itemStyle={{ color: "#22d3ee" }}
            />
            <Area 
              type="monotone" 
              dataKey="prescriptions" 
              stroke="#06b6d4" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVolume)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
