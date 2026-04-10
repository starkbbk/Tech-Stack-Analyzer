"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TechCardProps {
  title: string;
  items: Array<{
    name: string;
    confidence: number;
    icon?: string;
  }>;
  icon: LucideIcon;
  color?: string;
}

export default function TechCard({ title, items, icon: Icon, color = "accent" }: TechCardProps) {
  if (items.length === 0) return null;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-card border border-gray-800 rounded-xl p-4 md:p-6 flex flex-col h-full group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="font-header font-bold text-gray-400 text-sm md:text-base tracking-widest uppercase">
          {title}
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
             <div className="flex justify-between items-center">
                <span className="text-white text-lg md:text-xl font-bold font-header group-hover:text-accent transition-colors">
                    {item.name}
                </span>
                <span className="text-secondary font-code text-xs">
                    {item.confidence}%
                </span>
             </div>
             {/* Confidence bar */}
             <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.confidence}%` }}
                    className={`h-full bg-${color} opacity-60`}
                />
             </div>
          </div>
        ))}
      </div>
      
      {/* Footer / Extra info */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-[10px] font-code text-gray-600">VERIFIED SIGNATURE</span>
         <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full bg-${color}`} />
            <div className={`w-1 h-1 rounded-full bg-${color}/60`} />
            <div className={`w-1 h-1 rounded-full bg-${color}/30`} />
         </div>
      </div>
    </motion.div>
  );
}
