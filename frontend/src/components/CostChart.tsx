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
import { DollarSign, PieChart } from "lucide-react";

interface CostData {
  hosting: number;
  cdn: number;
  database: number;
  analytics: number;
  total: number;
  currency: string;
}

export default function CostChart({ data }: { data: CostData }) {
  const chartData = [
    { name: "Hosting", value: data.hosting, color: "#00ff41" },
    { name: "CDN", value: data.cdn, color: "#0096ff" },
    { name: "Database", value: data.database, color: "#ff6b35" },
    { name: "Analytics", value: data.analytics, color: "#ffffff" },
  ].filter(d => d.value > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-gray-800 rounded-xl p-6 md:p-10 flex flex-col items-center group relative overflow-hidden"
    >
        {/* Glow background effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <DollarSign className="w-6 h-6 text-accent" />
                 <h2 className="text-2xl font-header font-bold text-white tracking-widest uppercase">
                    Monthly Infrastructure Estimator
                  </h2>
              </div>
              <p className="text-gray-500 font-code text-sm">
                Based on detected stack and estimated 100k visits
              </p>
            </div>
            <div className="bg-black/50 border border-gray-800 rounded-lg p-4 flex flex-col items-end min-w-[200px] glow-accent">
               <span className="text-gray-600 font-code text-xs">ESTIMATED TOTAL</span>
               <span className="text-4xl font-header font-bold text-accent tracking-tighter">
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
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                contentStyle={{ 
                    backgroundColor: '#111', 
                    border: '1px solid #333', 
                    borderRadius: '8px', 
                    fontFamily: 'JetBrains Mono' 
                }}
                labelStyle={{ color: '#fff', marginBottom: '4px' }}
                itemStyle={{ color: '#00ff41' }}
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

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-3 bg-black/40 p-4 rounded-lg border border-gray-800">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-xs font-code">{d.name}</span>
                        <span className="text-white font-bold">${d.value}</span>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
  );
}
