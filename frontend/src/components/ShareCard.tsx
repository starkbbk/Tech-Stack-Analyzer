"use client";
import { motion } from "framer-motion";
import { Zap, Globe, Share2 } from "lucide-react";

interface ShareCardProps {
  url: string;
  techStack: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  overallScore: number;
}

export default function ShareCard({ url, techStack, overallScore }: ShareCardProps) {
  const primaryTech = techStack.frontend?.[0]?.name || techStack.backend?.[0]?.name || "Modern Tech";
  const cloud = techStack.cloud?.[0]?.name || "Cloud Native";
  
  const domain = url.replace(/^https?:\/\//, '').split('/')[0].toUpperCase();

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div 
        initial={{ rotateY: 20, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        className="w-[400px] h-[600px] bg-gradient-to-br from-[#00ff41] to-[#0096ff] p-[2px] rounded-[40px] shadow-2xl relative overflow-hidden group perspective-1000"
      >
        <div className="w-full h-full bg-[#0a0a0a] rounded-[38px] p-10 flex flex-col items-center justify-between relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <div className="z-10 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 border border-accent/30">
                <Globe className="text-accent w-8 h-8" />
             </div>
             <h2 className="text-3xl font-header font-black text-white tracking-widest mb-1">{domain}</h2>
             <p className="text-gray-500 font-code text-xs uppercase tracking-[0.3em]">Technical Fingerprint</p>
          </div>

          <div className="z-10 w-full flex flex-col gap-6">
             <div className="flex flex-col gap-1 items-center">
                <span className="text-gray-600 text-[10px] font-code uppercase tracking-widest">Main Engine</span>
                <span className="text-4xl font-header font-black text-white italic">{primaryTech}</span>
             </div>
             
             <div className="h-[2px] w-12 bg-accent/50 mx-auto" />

             <div className="flex flex-col gap-1 items-center">
                <span className="text-gray-600 text-[10px] font-code uppercase tracking-widest">Infrastructure</span>
                <span className="text-2xl font-header font-bold text-secondary">{cloud}</span>
             </div>
          </div>

          <div className="z-10 w-full bg-accent/5 border border-accent/20 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-gray-500 text-[10px] font-code uppercase">Optimization</span>
                  <span className="text-3xl font-header font-black text-accent">{overallScore}</span>
              </div>
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded-full">
                  <Zap className="text-black w-6 h-6 fill-black" />
              </div>
          </div>

          <div className="z-10 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-6 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-accent animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                      </div>
                  ))}
              </div>
              <span className="text-gray-700 font-code text-[10px] uppercase tracking-widest">TechStack Analyzer // Output 1.0</span>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
      </motion.div>
      
      <button className="flex items-center gap-2 text-accent font-code text-sm uppercase hover:underline transition-all">
         <Share2 className="w-4 h-4" /> Export_As_Image
      </button>
    </div>
  );
}
