"use client";
import { useRouter } from "next/navigation";
import ScanProgress from "@/components/ScanProgress";
import MatrixBackground from "@/components/MatrixBackground";
import { motion } from "framer-motion";

export default function ScanningPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleComplete = () => {
    router.push(`/result/${params.id}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-24 overflow-hidden">
      <MatrixBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full flex flex-col items-center"
      >
        <div className="flex items-center gap-4 mb-12">
            <h1 className="text-2xl md:text-4xl font-header font-bold tracking-tighter text-white">
                WEBSITE <span className="text-accent underline decoration-wavy">ANALYSIS</span> IN PROGRESS
            </h1>
        </div>

        <ScanProgress scanId={params.id} onComplete={handleComplete} />
        
        <p className="mt-8 font-code text-gray-500 text-sm animate-pulse max-w-md text-center">
            &quot;Sabar rakho bhai, main gehraayi se dekh raha hoon...&quot;
        </p>
      </motion.div>
    </main>
  );
}
