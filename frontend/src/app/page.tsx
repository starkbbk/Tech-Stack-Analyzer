"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MatrixBackground from "@/components/MatrixBackground";
import { Search, Zap, Activity } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentScans, setRecentScans] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const router = useRouter();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/scan/recent/all`);
        setRecentScans(res.data);
      } catch (error) {
        // Error handled silently
      }
    };
    fetchRecent();
    
    console.log("%cTECH_STACK_ANALYZER_V1: ACCESS_GRANTED", "color: #00ff41; font-weight: bold; font-size: 20px;");
    console.log("%cMaintained by Stark @ Github", "color: #0096ff; font-style: italic;");
  }, [BACKEND_URL]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/scan`, { url });
      if (res.data.scanId) {
        router.push(`/scan/${res.data.scanId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start scan");
      setLoading(false);
    }
  };

  const quickScan = (targetUrl: string) => {
    setUrl(targetUrl);
    // Auto submit behavior could be added here
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-24 overflow-hidden">
      <MatrixBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-3xl flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-10 h-10 text-accent animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-header font-bold tracking-tighter">
            Tech Stack <span className="text-accent underline decoration-wavy">Analyzer</span>
          </h1>
        </div>
        
        <p className="font-code text-secondary mb-10 text-lg md:text-xl relative inline-block group">
           &quot;Kisi Bhi Website Ka X-Ray Machine&quot;
        </p>

        <form onSubmit={handleScan} className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col md:flex-row items-center bg-card rounded-lg overflow-hidden border border-gray-800">
            <div className="pl-4 py-4 md:py-0">
              <Search className="text-gray-500 w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="Enter URL (e.g., https://netflix.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 w-full bg-transparent border-none text-white px-4 py-5 md:py-6 focus:outline-none font-code text-lg placeholder-gray-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-5 md:py-6 bg-accent hover:bg-[#00cc33] text-black font-bold flex items-center justify-center gap-2 transition-all glow-accent"
            >
              <Zap className="w-5 h-5" />
              {loading ? "INITIALIZING..." : "X-RAY KARO"}
            </button>
          </div>
        </form>

        <div className="mt-12 flex flex-col items-center">
          <p className="text-gray-400 mb-4 text-sm font-code">TARGET QUICK SCAN:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['netflix.com', 'amazon.com', 'swiggy.com', 'zomato.com'].map((site) => (
              <button
                key={site}
                onClick={() => quickScan(site)}
                className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:text-accent hover:border-accent transition-colors font-code text-sm"
              >
                [{site}]
              </button>
            ))}
          </div>
        </div>

        {recentScans.length > 0 && (
            <div className="mt-20 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-code text-gray-600 uppercase tracking-widest">Recent Network Penetrations</h2>
                    <div className="h-[1px] flex-1 mx-4 bg-gray-900" />
                    <span className="text-xs font-code text-accent animate-pulse">LIVE_STREAM</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recentScans.slice(0, 4).map((scan, idx) => (
                        <div 
                           key={idx} 
                           onClick={() => router.push(`/result/${scan.scanId}`)}
                           className="bg-card border border-gray-800 p-4 rounded-lg flex flex-col gap-2 hover:border-accent transition-all cursor-pointer group"
                        >
                            <span className="text-white font-code text-sm truncate">{scan.url.replace(/^https?:\/\//, '')}</span>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-[10px] uppercase font-code">CORE_SCORE</span>
                                <span className="text-accent font-bold font-header">{scan.scores.overall}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-20 flex gap-10">
            <Link href="/compare" className="text-gray-500 hover:text-white font-code text-xs uppercase tracking-widest border-b border-transparent hover:border-white transition-all">
                Comparative_Analysis
            </Link>
            <span className="text-gray-800">|</span>
            <span className="text-gray-500 font-code text-xs uppercase tracking-widest">
                Nodes: 1,234
            </span>
        </div>

      </motion.div>
    </main>
  );
}
