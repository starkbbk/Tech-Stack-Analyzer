"use client";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Fingerprint, Lock, EyeOff } from "lucide-react";

interface SecurityAuditProps {
  data: {
    trustLevel: "Real" | "Likely Real" | "Suspicious" | "Likely Fake";
    trustReason: string;
    vulnerabilities: string[];
    securityFeatures: string[];
  };
  securityScore: number;
  trustScore: number;
}

export default function SecurityAudit({ data, securityScore, trustScore }: SecurityAuditProps) {
  const getTrustColor = (level: string) => {
    switch (level) {
      case "Real": return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Likely Real": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      case "Suspicious": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "Likely Fake": return "text-red-400 border-red-500/30 bg-red-500/10";
      default: return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Trust Analysis Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-gray-800 rounded-3xl p-8 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <Fingerprint className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-header font-bold text-white uppercase tracking-widest">Trust_Analysis</h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div className={`px-4 py-2 rounded-full border text-sm font-code font-bold uppercase ${getTrustColor(data.trustLevel)}`}>
              STATUS: {data.trustLevel}
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-xs font-code block mb-1">PROBABILITY_SCORE</span>
              <span className="text-3xl font-header font-bold text-white tracking-tighter">{trustScore}%</span>
            </div>
          </div>

          <div className="bg-black/40 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-400 text-xs font-code uppercase tracking-widest mb-3 flex items-center gap-2">
              <EyeOff className="w-3 h-3" /> AI_DECISION_LOG
            </h3>
            <p className="text-gray-200 font-body text-sm leading-relaxed italic">
              "{data.trustReason}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security Audit Section */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-gray-800 rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-header font-bold text-white uppercase tracking-widest">Security_Audit</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-secondary text-xs font-code font-bold">GRADE_V4</span>
            <span className="text-3xl font-header font-bold text-white tracking-tighter">{securityScore}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-500 text-xs font-code uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Detected_Features</h3>
            <div className="flex flex-wrap gap-2">
              {data.securityFeatures.map((feature, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-code">
                  <CheckCircle className="w-3 h-3" /> {feature}
                </span>
              ))}
              {data.securityFeatures.length === 0 && <span className="text-gray-600 font-code text-xs italic">No advanced features detected</span>}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-gray-500 text-xs font-code uppercase tracking-widest border-l-2 border-red-500 pl-3">Identified_Risks</h3>
            <div className="flex flex-col gap-2">
              {data.vulnerabilities.map((risk, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded text-[10px] text-red-400 font-code">
                  <AlertTriangle className="w-3 h-3" /> {risk}
                </span>
              ))}
              {data.vulnerabilities.length === 0 && <span className="text-emerald-500/50 font-code text-xs italic">No critical risks identified</span>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
