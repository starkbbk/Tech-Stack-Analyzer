"use client";
import { useState } from "react";
import axios from "axios";
import MatrixBackground from "@/components/MatrixBackground";
import CompareTable from "@/components/CompareTable";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Loader2, Info } from "lucide-react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";

export default function ComparePage() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1 || !url2) return;

    setLoading(true);
    setError(null);
    setCompareData(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/compare`, { url1, url2 });
      setCompareData(res.data);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      setError(err.response?.data?.error || "Both websites must be scanned separately before comparing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen pb-32 px-6">
      <MatrixBackground />
      
      <div className="max-w-7xl mx-auto pt-24 flex flex-col items-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-accent font-code text-sm transition-colors uppercase group">
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to scanner
            </Link>
            <h1 className="text-4xl md:text-6xl font-header font-black text-white tracking-widest uppercase mb-4 italic">
                S-SIDE <span className="text-accent underline decoration-double">BETA</span> COMPATOR
            </h1>
            <p className="text-gray-400 font-code tracking-tighter">Enter two URLs to analyze technical dominance.</p>
        </motion.div>

        {!compareData && (
            <motion.form 
                onSubmit={handleCompare}
                className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative p-1 pb-12"
            >
                <div className="flex flex-col gap-4">
                    <label className="text-xs font-code text-gray-500 uppercase tracking-widest px-2">Primary Domain (A)</label>
                    <div className="bg-card border border-gray-800 rounded-xl p-6 focus-within:border-accent transition-all glow-accent-hover">
                        <input 
                            type="text" 
                            placeholder="e.g. netflix.com" 
                            value={url1}
                            onChange={(e) => setUrl1(e.target.value)}
                            className="bg-transparent border-none text-white w-full outline-none font-code text-xl placeholder-gray-700" 
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-xs font-code text-gray-500 uppercase tracking-widest px-2">Challenger Domain (B)</label>
                    <div className="bg-card border border-gray-800 rounded-xl p-6 focus-within:border-secondary transition-all glow-accent-hover">
                        <input 
                            type="text" 
                            placeholder="e.g. amazon.com" 
                            value={url2}
                            onChange={(e) => setUrl2(e.target.value)}
                            className="bg-transparent border-none text-white w-full outline-none font-code text-xl placeholder-gray-700" 
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col items-center gap-6 mt-8">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-12 py-5 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center gap-3 font-code group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" /> }
                        {loading ? "INITIALIZING DATA..." : "COMMENCE COMPARISON"}
                    </button>
                    
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-400 text-sm font-code">
                            <Info className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>
            </motion.form>
        )}

        <AnimatePresence>
            {compareData && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                >
                    <div className="flex justify-between items-center mb-12">
                         <h2 className="text-2xl font-header font-black text-white italic uppercase tracking-[0.2em]">Matrix Output: 1.0</h2>
                         <button 
                           onClick={() => setCompareData(null)}
                           className="text-accent underline font-code text-sm uppercase tracking-widest"
                         >
                            RESET_DOMAINS
                         </button>
                    </div>
                    <CompareTable data1={compareData.url1} data2={compareData.url2} />
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </main>
  );
}
