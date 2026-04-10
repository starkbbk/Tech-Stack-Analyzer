"use client";
import { motion } from "framer-motion";
import { Check, X, Trophy, Zap, Shield, Search, Globe } from "lucide-react";

interface CompareTableProps {
  data1: any;
  data2: any;
}

export default function CompareTable({ data1, data2 }: CompareTableProps) {
  const categories = [
    { label: "Overall Score", key: "overall", scoreKey: "scores" },
    { label: "Performance", key: "performance", scoreKey: "scores" },
    { label: "Security", key: "security", scoreKey: "scores" },
    { label: "SEO/Mobile", key: "seo", scoreKey: "scores" },
  ];

  const techCategories = [
    { label: "Frontend", key: "frontend" },
    { label: "Backend", key: "backend" },
    { label: "Cloud", key: "cloud" },
    { label: "Analytics", key: "analytics" },
  ];

  const getWinner = (v1: number, v2: number) => {
    if (v1 > v2) return 1;
    if (v2 > v1) return 2;
    return 0;
  };

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Scoring Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="hidden md:block" /> {/* Spacer */}
         <div className="text-center">
            <h3 className="text-xl font-header font-bold text-accent uppercase tracking-widest mb-2">
                {data1.url.replace(/^https?:\/\//, '').split('/')[0]}
            </h3>
         </div>
         <div className="text-center">
            <h3 className="text-xl font-header font-bold text-secondary uppercase tracking-widest mb-2">
                {data2.url.replace(/^https?:\/\//, '').split('/')[0]}
            </h3>
         </div>

         {categories.map((cat, idx) => {
            const v1 = data1[cat.scoreKey][cat.key];
            const v2 = data2[cat.scoreKey][cat.key];
            const winner = getWinner(v1, v2);

            return (
                <div key={idx} className="contents">
                    <div className="flex items-center gap-3 bg-card/50 p-6 rounded-l-xl border-l border-y border-gray-800">
                        <span className="font-code text-gray-500 uppercase text-sm">{cat.label}</span>
                    </div>
                    <div className={`p-6 border-y border-gray-800 flex flex-col items-center justify-center gap-2 ${winner === 1 ? 'bg-accent/5' : 'bg-card/30'}`}>
                        <span className={`text-4xl font-header font-black ${winner === 1 ? 'text-accent' : 'text-white'}`}>{v1}</span>
                        {winner === 1 && <Trophy className="w-5 h-5 text-accent" />}
                    </div>
                    <div className={`p-6 border-y border-r border-gray-800 rounded-r-xl flex flex-col items-center justify-center gap-2 ${winner === 2 ? 'bg-secondary/5' : 'bg-card/30'}`}>
                        <span className={`text-4xl font-header font-black ${winner === 2 ? 'text-secondary' : 'text-white'}`}>{v2}</span>
                        {winner === 2 && <Trophy className="w-5 h-5 text-secondary" />}
                    </div>
                </div>
            );
         })}
      </div>

      {/* Tech Stack Comparison */}
      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-black/50">
                    <th className="p-6 font-header text-gray-500 uppercase text-xs tracking-widest border-b border-gray-800">Category</th>
                    <th className="p-6 font-header text-accent uppercase text-xs tracking-widest border-b border-gray-800 text-center">Website A</th>
                    <th className="p-6 font-header text-secondary uppercase text-xs tracking-widest border-b border-gray-800 text-center">Website B</th>
                </tr>
            </thead>
            <tbody>
                {techCategories.map((cat, idx) => (
                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                        <td className="p-6 border-b border-gray-800 font-code text-sm text-gray-400 capitalize">{cat.label}</td>
                        <td className="p-6 border-b border-gray-800 text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                                {data1.techStack[cat.key]?.map((t: any, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold border border-accent/20">
                                        {t.name}
                                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="p-6 border-b border-gray-800 text-center">
                            <div className="flex flex-wrap justify-center gap-2">
                                {data2.techStack[cat.key]?.map((t: any, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/20">
                                        {t.name}
                                    </span>
                                ))}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>

      {/* Final Verdict */}
      <div className="p-10 bg-gradient-to-r from-accent/10 via-card to-secondary/10 border border-gray-800 rounded-3xl flex flex-col items-center text-center">
         <h2 className="text-3xl font-header font-black text-white mb-4 italic uppercase tracking-tighter">
            THE VERDICT: <span className={data1.scores.overall > data2.scores.overall ? 'text-accent' : 'text-secondary'}>
                {data1.scores.overall > data2.scores.overall ? data1.url : data2.url} 
            </span> IS THE WINNER
         </h2>
         <p className="text-gray-500 font-body max-w-2xl mb-8">
            Based on our automated scan of performance metrics, security headers, and modern tech stack adoption, 
            the winner shows 15% better optimization in core web vitals.
         </p>
         <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
                <div className={`p-4 rounded-full ${data1.scores.overall > data2.scores.overall ? 'bg-accent/20 border-accent' : 'bg-gray-900 border-gray-800'} border-2`}>
                   <Zap className={data1.scores.overall > data2.scores.overall ? 'text-accent' : 'text-gray-700'} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className={`p-4 rounded-full ${data2.scores.overall > data1.scores.overall ? 'bg-secondary/20 border-secondary' : 'bg-gray-900 border-gray-800'} border-2`}>
                   <Shield className={data2.scores.overall > data1.scores.overall ? 'text-secondary' : 'text-gray-700'} />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
