"use client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface RevenueData {
  ads: number;
  subscriptions: number;
  sales: number;
  total: number;
  currency: string;
}

export default function RevenueChart({ data }: { data: RevenueData }) {
  const chartData = [
    { name: "Ads", value: data.ads, color: "#10b981" }, // Emerald 500
    { name: "Subs", value: data.subscriptions, color: "#f59e0b" }, // Amber 500
    { name: "Sales", value: data.sales, color: "#3b82f6" }, // Blue 500
  ].filter(d => d.value > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-gray-800 rounded-xl p-6 md:p-10 flex flex-col items-center group relative overflow-hidden"
    >
        {/* Glow background effect - Emerald */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <TrendingUp className="w-6 h-6 text-emerald-500" />
                 <h2 className="text-2xl font-header font-bold text-white tracking-widest uppercase">
                    Monthly Revenue Estimator
                  </h2>
              </div>
              <p className="text-gray-500 font-code text-sm">
                Speculative AI analysis of monetization potential
              </p>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4 flex flex-col items-end min-w-[200px] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
               <span className="text-emerald-800 font-code text-xs font-bold">ESTIMATED REVENUE</span>
               <span className="text-4xl font-header font-bold text-emerald-400 tracking-tighter">
                  ${data.total.toLocaleString()}
               </span>
               <span className="text-gray-500 text-xs font-code mt-1 italic uppercase">Per Month (USD)</span>
            </div>
        </div>

        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#666", fontFamily: 'JetBrains Mono', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#666", fontFamily: 'JetBrains Mono', fontSize: 12 }} 
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }} 
                contentStyle={{ 
                    backgroundColor: '#111', 
                    border: '1px solid #333', 
                    borderRadius: '8px', 
                    fontFamily: 'JetBrains Mono' 
                }}
                labelStyle={{ color: '#fff', marginBottom: '4px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]} 
                animationDuration={2000}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-3 bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-xs font-code">{d.name}</span>
                        <span className="text-white font-bold">${d.value.toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
  );
}
