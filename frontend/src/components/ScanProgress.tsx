"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface ScanProgressProps {
  scanId: string;
  onComplete: () => void;
}

export default function ScanProgress({ scanId, onComplete }: ScanProgressProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing analyzer...");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";

  useEffect(() => {
    let eventSource: EventSource;
    let pollTimer: NodeJS.Timeout;

    const connectSSE = () => {
      eventSource = new EventSource(`${BACKEND_URL}/api/scan/${scanId}/status`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status) {
          setStatus(data.status);
          setLogs((prev: LogEntry[]) => ([
            ...prev, 
            { 
              id: Math.random().toString(36).substr(2, 9), 
              message: data.status, 
              type: (data.error ? 'error' : (data.percent === 100 ? 'success' : 'info')) as 'error' | 'success' | 'info'
            }
          ].slice(-10)));
        }

        if (data.percent !== undefined) {
          setProgress(data.percent);
        }

        if (data.done) {
          eventSource.close();
          clearTimeout(pollTimer);
          setTimeout(onComplete, 1500);
        }

        if (data.error) {
          setError(data.message || "An error occurred during scanning.");
          eventSource.close();
          clearTimeout(pollTimer);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        // SSE failed — could be a race condition (scan already done). Poll for result.
        pollForResult();
      };
    };

    const pollForResult = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/scan/${scanId}/result`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'complete') {
            setProgress(100);
            setStatus('Scan complete!');
            setLogs(prev => [...prev, { id: 'done', message: 'Scan retrieved from cache.', type: 'success' }]);
            setTimeout(onComplete, 1000);
            return;
          } else if (data.status === 'failed') {
            setError('Scan failed on the server.');
            return;
          }
        }
      } catch (e) {}
      // Not ready yet — retry
      pollTimer = setTimeout(pollForResult, 2000);
    };

    connectSSE();
    // Also start polling as a safety net (in case SSE never fires)
    pollTimer = setTimeout(pollForResult, 8000);

    return () => {
      eventSource?.close();
      clearTimeout(pollTimer);
    };
  }, [scanId, onComplete, BACKEND_URL]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-2xl bg-card border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-black/50 px-4 py-2 flex items-center gap-2 border-b border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-gray-500 font-code text-xs">SCANNER_TERMINAL_V1.0 -- {scanId}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-900 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent glow-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle className="text-red-500 w-6 h-6" />
            ) : progress === 100 ? (
              <CheckCircle2 className="text-accent w-6 h-6" />
            ) : (
              <Loader2 className="text-accent w-6 h-6 animate-spin" />
            )}
            <h2 className="text-xl font-header font-bold tracking-tight">
              {error ? "SCAN FAILED" : status.toUpperCase()}
            </h2>
          </div>
          <span className="font-code text-accent text-2xl">{progress}%</span>
        </div>

        {/* Terminal Logs */}
        <div 
          ref={scrollRef}
          className="bg-black rounded border border-gray-800 p-4 font-code text-sm h-48 overflow-y-auto mb-4"
        >
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 mb-1"
              >
                <span className="text-gray-600">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-accent' : 'text-gray-300'}>
                  {log.type === 'error' ? '✖' : log.type === 'success' ? '✔' : '>'} {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {!error && progress < 100 && (
             <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-accent ml-1 translate-y-1"
             />
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded p-3 mb-4">
            <p className="text-red-400 text-sm font-code flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              ERROR: {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-xs font-code underline hover:text-white"
            >
              TRY RE-SCANNING
            </button>
          </div>
        )}

        <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${progress >= i * 20 ? 'bg-accent/40' : 'bg-gray-800'}`} />
            ))}
        </div>
      </div>
    </div>
  );
}
