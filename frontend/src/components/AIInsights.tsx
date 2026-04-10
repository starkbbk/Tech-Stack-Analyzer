"use client";
import { motion } from "framer-motion";
import { BrainCircuit, Lightbulb, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";

interface AIInsightsProps {
  insights: {
    summary: string;
    observations: string[];
    recommendations: string[];
    techDebtWarnings: string[];
  };
}

export default function AIInsights({ insights }: AIInsightsProps) {
  const sections = [
    { 
      title: "Observations", 
      items: insights.observations, 
      icon: BrainCircuit, 
      color: "text-accent",
      bgColor: "bg-accent/5" 
    },
    { 
      title: "Recommendations", 
      items: insights.recommendations, 
      icon: Lightbulb, 
      color: "text-secondary",
      bgColor: "bg-secondary/5" 
    },
    { 
      title: "Architecture & Scale", 
      items: insights.techDebtWarnings, 
      icon: AlertTriangle, 
      color: "text-warning",
      bgColor: "bg-warning/5" 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-gray-800 rounded-xl p-6 md:p-10 flex flex-col relative overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-8">
        <Sparkles className="w-8 h-8 text-accent animate-pulse" />
        <h2 className="text-3xl font-header font-bold text-white tracking-widest uppercase italic">
          🧠 AI Insights <span className="text-accent underline decoration-double">Analysis</span>
        </h2>
      </div>

      <div className="bg-black/50 border-l-4 border-accent p-6 rounded-r-lg mb-10">
        <p className="text-gray-300 font-body text-lg leading-relaxed font-medium italic">
          &quot;{insights.summary}&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col gap-4 p-6 rounded-xl ${section.bgColor} border border-gray-800 h-full relative group`}
          >
             <div className="flex items-center gap-3">
                <section.icon className={`w-6 h-6 ${section.color}`} />
                <h3 className="font-header font-extrabold text-white text-lg uppercase tracking-tight">
                    {section.title}
                </h3>
             </div>
             
             <ul className="flex flex-col gap-3">
                {section.items.map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-2 text-gray-400 text-sm md:text-base leading-snug group-hover:text-gray-200 transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 mt-1 flex-shrink-0 ${section.color}`} />
                    <span>{item}</span>
                  </motion.li>
                ))}
                {section.items.length === 0 && (
                    <li className="text-gray-600 text-sm font-code italic">No data available...</li>
                )}
             </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
