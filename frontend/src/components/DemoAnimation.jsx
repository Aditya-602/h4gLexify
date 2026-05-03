import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const UploadAndScrapeStep = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
    transition={{ duration: 0.5 }}
    className="flex flex-col w-full h-full p-4 font-mono text-sm gap-4"
  >
    <div className="flex items-center gap-4 text-neutral-800">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-16 h-20 bg-white border-2 border-neutral-300 rounded-lg shadow-md flex items-center justify-center text-primary font-bold text-xs"
      >
        PDF
      </motion.div>
      <div className="flex flex-col">
        <span className="font-bold text-lg">Terms_of_Service.pdf</span>
        <span className="text-neutral-500">Extracting text...</span>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ delay: 1 }}
      className="bg-neutral-900 text-green-400 p-4 rounded-lg shadow-inner overflow-hidden text-xs mt-4"
    >
      <p className="opacity-70">&gt; Parsing document text...</p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        &gt; URL detected: https://stripe.com/privacy
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-yellow-400"
      >
        &gt; Initiating "Rabbit Hole" Scraper...
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
      >
        &gt; External policy successfully appended to context.
      </motion.p>
    </motion.div>
  </motion.div>
);

const ClauseAnalysisStep = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
    transition={{ duration: 0.5 }}
    className="flex flex-col w-full h-full p-4 font-mono text-sm gap-4"
  >
    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
      <span className="font-bold text-neutral-600">Doc Type:</span>
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
        Terms of Service
      </span>
    </div>

    <div className="text-neutral-500 font-bold mb-2">
      Concurrent Clause Analysis
    </div>

    <div className="flex flex-col gap-2 relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.8 }}
          className="bg-white ml-8 p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-between"
        >
          <span className="text-neutral-600">Worker {i}</span>
          <span className="flex items-center gap-2 text-xs">
            <span className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
            Analyzing Clause {i}...
          </span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="ml-8 text-green-600 font-bold text-xs mt-2"
      >
        ✓ All 34 clauses processed.
      </motion.div>
    </div>
  </motion.div>
);

const RiskContradictionStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
    transition={{ duration: 0.5 }}
    className="flex flex-col w-full h-full p-4 font-mono text-sm gap-4 items-center justify-center"
  >
    <div className="flex w-full gap-4 relative">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-600"
      >
        <strong>Clause 4:</strong> "Users retain full copyright over uploaded
        content."
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-red-400 origin-left"
      />
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-600"
      >
        <strong>Clause 12:</strong> "Company claims exclusive license to all
        content."
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)]"
    >
      ⚠ Contradiction Detected
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }}
      className="mt-6 flex flex-col items-center"
    >
      <div className="text-neutral-500 mb-1">Final Risk Score</div>
      <div className="text-5xl font-extrabold text-red-600 drop-shadow-sm">
        85<span className="text-2xl text-neutral-400">/100</span>
      </div>
      <div className="bg-neutral-800 text-white px-3 py-1 rounded uppercase text-[10px] mt-2 font-sans tracking-wider">
        Verdict: High Risk (Red)
      </div>
    </motion.div>
  </motion.div>
);

const AgenticOutputStep = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col w-full h-full p-4 font-mono text-sm gap-4 justify-center"
  >
    <div className="text-center font-bold text-primary mb-2">
      Executing Agentic Tasks...
    </div>

    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
          ⚠️
        </div>
        <div>
          <div className="font-bold text-neutral-800">Top Concerns</div>
          <div className="text-xs text-neutral-500">
            Extracted high-priority risk themes.
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-lg">
          ⚖️
        </div>
        <div>
          <div className="font-bold text-neutral-800">Verdict Reason</div>
          <div className="text-xs text-neutral-500">
            Legal justification for the assigned risk score.
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5 }}
        className="bg-white p-3 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg">
          📄
        </div>
        <div>
          <div className="font-bold text-neutral-800">Executive Summary</div>
          <div className="text-xs text-neutral-500">
            Document summary generated.
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default function DemoAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 5 seconds per step for a highly detailed reading experience
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl bg-white border border-neutral-200 shadow-2xl relative z-50 h-105 flex items-center justify-center pointer-events-auto transition-transform hover:scale-[1.01] duration-300 rounded-3xl p-6">
      <AnimatePresence mode="wait">
        {step === 0 && <UploadAndScrapeStep key="s1" />}
        {step === 1 && <ClauseAnalysisStep key="s2" />}
        {step === 2 && <RiskContradictionStep key="s3" />}
        {step === 3 && <AgenticOutputStep key="s4" />}
      </AnimatePresence>

      {/* Sequence Progress Indicators */}
      <div className="absolute bottom-6 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === step ? "w-10 bg-primary" : "w-4 bg-neutral-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
