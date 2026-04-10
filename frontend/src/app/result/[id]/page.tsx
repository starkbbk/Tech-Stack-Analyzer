"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Layout, 
  Server, 
  Database, 
  Cloud, 
  Globe, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  Cpu, 
  Share2,
  Download,
  Calendar,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import TechCard from "@/components/TechCard";
import CostChart from "@/components/CostChart";
import ScoreGauge from "@/components/ScoreGauge";
import AIInsights from "@/components/AIInsights";
import RevenueChart from "@/components/RevenueChart";
import SecurityAudit from "@/components/SecurityAudit";
import MatrixBackground from "@/components/MatrixBackground";
import { useRouter } from "next/navigation";

interface ScanResult {
  scanId: string;
  url: string;
  timestamp: string;
  status: string;
  techStack: {
    frontend: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    backend: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    database: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    cloud: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    cdn: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    analytics: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    payments: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    security: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  scores: {
    performance: number;
    seo: number;
    security: number;
    mobile: number;
    overall: number;
  };
  cost: {
    hosting: number;
    cdn: number;
    database: number;
    analytics: number;
    total: number;
    currency: string;
  };
  revenue: {
    ads: number;
    subscriptions: number;
    sales: number;
    total: number;
    currency: string;
  };
    total: number;
    currency: string;
  };
  securityScore: number;
  trustScore: number;
  securityAudit: {
    trustLevel: "Real" | "Likely Real" | "Suspicious" | "Likely Fake";
    trustReason: string;
    vulnerabilities: string[];
    securityFeatures: string[];
  };
  aiInsights: {
    summary: string;
    observations: string[];
    recommendations: string[];
    techDebtWarnings: string[];
  };
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";

export default function ResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/scan/${params.id}/result`);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load scan results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [params.id, BACKEND_URL]);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Cpu className="w-12 h-12 text-accent animate-spin mb-6" />
        <h2 className="text-2xl font-header font-bold text-white tracking-widest uppercase">LOADING FINAL REPORT...</h2>
        <p className="text-gray-500 font-code mt-4 animate-pulse italic uppercase">Parsing technical signatures and AI insights</p>
    </div>
  );

  if (error || !result) return (
     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-header font-bold text-white mb-6 uppercase tracking-widest text-red-500">DATABASE ERROR: 404_NOT_FOUND</h2>
        <p className="text-gray-500 font-code mb-10 max-w-md">{error || "This scan ID does not exist in our system."}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-accent hover:bg-[#00cc33] text-black font-bold rounded-lg glow-accent uppercase tracking-widest flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> REBOOT_SYSTEM
        </button>
     </div>
  );

  const techCategories = [
    { title: "Frontend Frameworks", items: result.techStack.frontend, icon: Layout, color: "accent" },
    { title: "Backend Technology", items: result.techStack.backend, icon: Server, color: "secondary" },
    { title: "Databases & Storage", items: result.techStack.database, icon: Database, color: "warning" },
    { title: "Cloud Hosting", items: result.techStack.cloud, icon: Cloud, color: "accent" },
    { title: "CDN & Performance", items: result.techStack.cdn, icon: Globe, color: "secondary" },
    { title: "Analytics Tools", items: result.techStack.analytics, icon: BarChart3, color: "white" },
    { title: "Payment Systems", items: result.techStack.payments, icon: CreditCard, color: "accent" },
    { title: "Security Protocols", items: result.techStack.security, icon: ShieldCheck, color: "secondary" }
  ];

  return (
    <main className="relative min-h-screen bg-background pb-32">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 group">
          <MatrixBackground />
      </div>
      
      {/* Top Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push('/')}
                  className="p-2 hover:bg-gray-900 rounded-lg text-gray-500 hover:text-white transition-all group"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-header font-extrabold text-white tracking-widest hidden md:block">
                        TECHSTACK_ANALYZER_V1
                    </h1>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-card border border-gray-800 rounded-md text-gray-300 hover:border-accent hover:text-accent transition-all flex items-center gap-2 font-code text-xs uppercase tracking-widest">
                    <Share2 className="w-4 h-4" /> Share
                </button>
                <button className="px-4 py-2 bg-accent hover:bg-[#00cc33] text-black rounded-md font-bold transition-all flex items-center gap-2 font-code text-xs uppercase tracking-widest glow-accent">
                    <Download className="w-4 h-4" /> Download_PDF
                </button>
            </div>
        </div>
      </nav>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 relative z-10">
        
        {/* URL and Overall Stats Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 bg-card border border-gray-800 p-8 md:p-12 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-secondary to-accent opacity-30" />
            
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black/50 border border-gray-800 rounded-2xl flex items-center justify-center p-3">
                        {/* Placeholder favicon or logo */}
                        <Globe className="w-full h-full text-accent" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl md:text-5xl font-header font-black text-white tracking-tighter">
                                {result.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </h2>
                            <a href={result.url} target="_blank" className="text-accent hover:scale-110 transition-transform">
                                <ExternalLink className="w-6 h-6" />
                            </a>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                             <span className="flex items-center gap-1.5 text-gray-500 font-code text-sm">
                                <Calendar className="w-4 h-4" /> {new Date(result.timestamp).toLocaleDateString()}
                             </span>
                             <span className="flex items-center gap-1.5 text-accent font-code text-sm uppercase">
                                <ShieldCheck className="w-4 h-4" /> Verified_Scan
                             </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 md:gap-16 items-center">
                 <ScoreGauge score={result.scores.overall} label="Overall Score" size={150} />
                 <div className="hidden lg:flex flex-col gap-4">
                     <div className="flex justify-between items-center gap-6 min-w-[200px]">
                        <span className="text-gray-500 font-code text-sm">PERFORMANCE</span>
                        <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.scores.performance}%` }} className="h-full bg-accent" />
                        </div>
                        <span className="text-white font-code text-sm">{result.scores.performance}</span>
                     </div>
                     <div className="flex justify-between items-center gap-6">
                        <span className="text-gray-500 font-code text-sm">SECURITY</span>
                        <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.scores.security}%` }} className="h-full bg-secondary" />
                        </div>
                        <span className="text-white font-code text-sm">{result.scores.security}</span>
                     </div>
                     <div className="flex justify-between items-center gap-6">
                        <span className="text-gray-500 font-code text-sm">SEO/MOBILE</span>
                        <div className="flex-1 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.scores.seo}%` }} className="h-full bg-warning" />
                        </div>
                        <span className="text-white font-code text-sm">{result.scores.seo}</span>
                     </div>
                 </div>
            </div>
        </section>

        {/* Tech Stack Grid */}
        <section className="flex flex-col gap-8">
            <h2 className="text-3xl font-header font-bold text-white uppercase italic tracking-widest">
                <span className="text-accent underline decoration-double">Categorized</span> Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {techCategories.map((cat, idx) => (
                    <TechCard 
                        key={idx} 
                        title={cat.title} 
                        items={cat.items} 
                        icon={cat.icon} 
                        color={cat.color}
                    />
                ))}
            </div>
        </section>

        {/* Cost Section */}
        <CostChart data={result.cost} />

        {/* Revenue Section */}
        {result.revenue && result.revenue.total > 0 && (
          <RevenueChart data={result.revenue} />
        )}

        {/* Security & Trust Section */}
        <SecurityAudit 
          data={result.securityAudit} 
          securityScore={result.securityScore} 
          trustScore={result.trustScore} 
        />

        {/* AI Analysis Section */}
        <AIInsights insights={result.aiInsights} />

        {/* Tech Evolution Timeline Placeholder */}
        <section className="bg-card border border-gray-800 p-8 md:p-12 rounded-3xl flex flex-col gap-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-secondary" />
                <h2 className="text-3xl font-header font-bold text-white uppercase italic tracking-widest">
                    Tech <span className="text-secondary underline decoration-dotted">Evolution</span> Timeline
                </h2>
            </div>
            
            <div className="relative border-l-2 border-gray-800 ml-4 pl-8 py-4 flex flex-col gap-12">
                <div className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 bg-secondary rounded-full glow-accent" />
                    <span className="text-xs font-code text-gray-500 uppercase tracking-widest">Current Signature</span>
                    <h3 className="text-xl font-header font-bold text-white mt-1">Migration to Next.js 14</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-lg">Detected modern SSR architecture with TailwindCSS optimization.</p>
                </div>
                <div className="relative opacity-50">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 bg-gray-700 rounded-full" />
                    <span className="text-xs font-code text-gray-800 uppercase tracking-widest">2023 - Legacy</span>
                    <h3 className="text-xl font-header font-bold text-gray-600 mt-1">Standard React Build</h3>
                    <p className="text-gray-700 text-sm mt-2 max-w-lg">Previous version relied on client-side rendering with Express backend.</p>
                </div>
                <div className="absolute bottom-0 left-[-2px] w-[2px] h-20 bg-gradient-to-b from-gray-800 to-transparent" />
            </div>
            
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar className="w-32 h-32 text-white" />
            </div>
        </section>

        {/* Similar Tech Stack / Recomendations */}
        <section className="bg-gradient-to-br from-card to-black/50 border border-gray-800 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-12 group overflow-hidden relative">
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-header font-black text-white mb-6 tracking-tighter italic">
                    Ready to <span className="text-accent">Scale</span> this Tech Stack?
                </h2>
                <p className="text-gray-400 font-body text-lg mb-8 max-w-xl group-hover:text-gray-300 transition-colors">
                    Our AI model has analyzed over 50k+ websites with similar tech profiles. Based on this scan, we recommend exploring cloud migrations for better cost efficiency in your database layer.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button className="px-8 py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest font-code text-sm">
                        Upgrade Stack
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-gray-800 hover:border-gray-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest font-code text-sm">
                        Compare Competitors
                    </button>
                </div>
            </div>
            
            <div className="w-full md:w-1/3 flex justify-center py-6 relative">
                 <div className="w-64 h-64 bg-accent/10 rounded-full flex items-center justify-center animate-pulse border border-accent/20">
                    <Cpu className="w-32 h-32 text-accent opacity-60" />
                 </div>
                 <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full animate-ping" />
                 <div className="absolute bottom-10 left-10 w-2 h-2 bg-secondary rounded-full animate-bounce" />
            </div>
        </section>
        
      </div>
      
      {/* Footer Info */}
      <footer className="w-full py-12 border-t border-gray-900 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
                 <span className="text-white font-header font-bold tracking-widest uppercase">TECHSTACK_ANALYZER</span>
                 <p className="text-gray-600 font-code text-xs">BUILDING SECURE AND TRANSPARENT WEB ENVIRONMENTS</p>
            </div>
            <div className="flex gap-12 font-code text-xs text-gray-500">
                <span className="hover:text-accent cursor-pointer transition-colors uppercase">Documentation</span>
                <span className="hover:text-accent cursor-pointer transition-colors uppercase">API_Access</span>
                <span className="hover:text-accent cursor-pointer transition-colors uppercase">Terms_Of_Service</span>
            </div>
        </div>
      </footer>
    </main>
  );
}
