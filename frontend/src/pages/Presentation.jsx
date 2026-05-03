
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const slides = [
  {
    id: 1,
    title: "The Problem",
    content:
      "Legal documents are painfully long, filled with jargon, and often contain hidden clauses that can hurt users. Most people blindly accept them without reading, exposing themselves to data mining and unfair terms.",
    Animation: () => (
      <div className="relative w-full h-full flex items-center justify-center font-mono">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute bg-white border border-neutral-200 shadow-2xl p-6 w-72 rounded-xl text-neutral-300 transform -rotate-6"
        >
          <div className="h-3 w-1/2 bg-neutral-200 mb-6 rounded" />
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-2 w-full bg-neutral-100 mb-3 rounded" />)}
          <motion.div 
            animate={{ backgroundColor: ["#f5f5f5", "#fee2e2", "#f5f5f5"] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="h-3 w-full mb-3 rounded relative overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-red-400/20"
            />
          </motion.div>
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-2 w-full bg-neutral-100 mb-3 rounded" />)}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Risky Clause
          </motion.div>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "Why a Solution is Needed",
    content:
      "Users risk their privacy and rights daily. Reading and reviewing manually takes hours, and hiring legal professionals is too expensive for everyday terms of service. The status quo is broken.",
    Animation: () => (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full text-neutral-200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" stroke="currentColor"/>
            <motion.line 
              x1="50" y1="50" x2="50" y2="20" stroke="#a3a3a3" strokeWidth="4" strokeLinecap="round"
              animate={{ rotate: 360 }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <motion.line 
              x1="50" y1="50" x2="70" y2="50" stroke="#a3a3a3" strokeWidth="4" strokeLinecap="round"
              animate={{ rotate: 360 }}
              style={{ originX: "50px", originY: "50px" }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            />
          </svg>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center text-4xl text-neutral-400"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ⏳
          </motion.div>
        </div>
        <div className="flex gap-3 text-xs font-mono">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }} className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-500 shadow-sm bg-white">privacy_loss</motion.div>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-500 shadow-sm bg-white">dark_patterns</motion.div>
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-500 shadow-sm bg-white">auto_renewal</motion.div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "My Solution",
    content:
      "An agentic AI platform that reads, and simplifies complex legal document, providing deep analysis, actionable insights and what matters most in one click..",
    Animation: () => (
      <div className="w-full h-full flex flex-col items-center justify-center relative font-mono text-sm">
        <div className="relative w-full max-w-sm border border-neutral-200 rounded-xl bg-white shadow-xl overflow-hidden">
          <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="ml-4 text-xs text-neutral-400">pipeline_executor.py</span>
          </div>
          <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-500">Status: Extracting</span>
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded bg-green-500"
                />
             </div>
             <div className="space-y-4">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: "100%" }} 
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="bg-primary/10 text-primary px-3 py-2 rounded border border-primary/20 whitespace-nowrap overflow-hidden text-xs"
                >
                  {`> Analyzing Clause 7...`}
                </motion.div>
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-full bg-neutral-100 rounded" />
                  <div className="h-2 w-5/6 bg-neutral-100 rounded" />
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                     className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded inline-block w-max mt-2 border border-green-200"
                  >
                    ✓ Safe: No liability waiver
                  </motion.div>
                </div>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "How is it Different From Other Models",
    content:
      "It isn't just a generic LLM chat. It relies on deterministic risk-scoring, a structured pipeline, and concurrent processing targeting specific legal domains rather than answering sequentially.",
    Animation: () => (
      <div className="w-full h-full flex flex-col justify-center gap-12 font-mono relative pt-8">
        <div className="flex justify-between items-center w-full px-8 relative">
          
          <div className="flex flex-col items-center opacity-40">
            <div className="w-16 h-16 rounded border-2 border-dashed border-neutral-400 flex items-center justify-center mb-4 relative">
              <span className="text-xl">🤖</span>
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                 className="absolute inset-[-4px] border border-neutral-300 rounded"
              />
            </div>
            <div className="text-xs text-neutral-500 font-bold border border-neutral-200 px-3 py-1 rounded bg-neutral-100">Vanilla GenAI</div>
          </div>
          
          <div className="text-2xl font-black text-neutral-300 italic">VS</div>
          
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-2 mb-4 w-28 h-28 relative perspective-1000">
               {[1,2,3,4].map(i => (
                 <motion.div 
                   key={i}
                   animate={{ scale: [0.9, 1, 0.9], opacity: [0.7, 1, 0.7] }}
                   transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                   className="bg-neutral-800 rounded flex items-center justify-center border border-neutral-600 shadow-md"
                 >
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                 </motion.div>
               ))}
               <div className="absolute inset-0 border-2 border-neutral-200 rounded-lg scale-110 pointer-events-none" />
            </div>
            <div className="text-xs text-neutral-800 font-bold border border-neutral-300 px-3 py-1 rounded bg-white shadow-sm flex items-center gap-2">
              Pipeline Arch.
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "What Makes it Agentic",
    content:
      "The pipeline is structured to fetch documents, validate clauses, and calculate a weighted risk score. This ensures that the analysis is deterministic and accurate, while also providing actionable insights to the user. This makes it agentic. Basically one click.",
    Animation: () => (
      <div className="w-full h-full flex flex-col justify-center items-center relative font-mono">
        <div className="relative w-64 h-64 flex items-center justify-center">
           {/* Center orchestrator */}
           <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center shadow-2xl z-20 text-white font-bold text-xs"
           >
             MAIN
           </motion.div>
           
           {/* Orbiting agents */}
           {[ 
             { label: "Scraper", color: "border-blue-500", delay: 0, top: "0", left: "50%" },
             { label: "Validator", color: "border-purple-500", delay: 1.5, bottom: "10%", left: "10%" },
             { label: "Scorer", color: "border-amber-500", delay: 3, bottom: "10%", right: "10%" }
           ].map((agent, i) => (
             <motion.div
               key={agent.label}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ repeat: Infinity, duration: 4.5, repeatType: "reverse", delay: agent.delay }}
               className={`absolute w-full h-full flex items-center justify-center inset-0`}
               style={{ transform: `rotate(${i * 120}deg)` }}
             >
                <div className={`absolute top-0 w-24 p-2 bg-white rounded-lg border-2 ${agent.color} text-xs text-center text-neutral-600 shadow-md -translate-y-1/2`}>
                   {agent.label}
                </div>
             </motion.div>
           ))}
           
           {/* Connecting pulses */}
           <motion.div 
             animate={{ scale: [1, 2], opacity: [0.8, 0] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute w-16 h-16 border-2 border-neutral-300 rounded-full z-10"
           />
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Who Are The Users",
    content:
      "Everyday consumers who wants a one click solution for the analysis, and people who do not want to write structured prompt every other minute.",
    Animation: () => (
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <div className="grid grid-cols-2 gap-4 w-full px-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0 }}
            className="bg-white border border-neutral-200 p-4 rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">👤</div>
            <div className="flex flex-col"><span className="text-sm font-bold text-neutral-700">Consumers</span><span className="text-[10px] text-neutral-400">Daily ToS</span></div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            className="bg-white border border-neutral-200 p-4 rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-xl">💼</div>
            <div className="flex flex-col"><span className="text-sm font-bold text-neutral-700">Freelancers</span><span className="text-[10px] text-neutral-400">Gig Contracts</span></div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            className="bg-white border border-neutral-200 p-4 rounded-xl flex items-center gap-4 shadow-sm col-span-2 mx-8"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl">🏢</div>
            <div className="flex flex-col"><span className="text-sm font-bold text-neutral-700">Startups</span><span className="text-[10px] text-neutral-400">Vendor SaaS Terms</span></div>
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "How Can It Help",
    content:
      "It saves countless hours, fundamentally protects user consumer rights, surfaces actively harmful clauses instantly, and democratizes legal literacy for the digital age.",
    Animation: () => (
      <div className="w-full h-full flex flex-col justify-center items-center relative">
        <motion.div
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ repeat: Infinity, duration: 3 }}
           className="absolute w-48 h-48 border border-neutral-200 rounded-full mix-blend-multiply"
        />
        <motion.div
           animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
           transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
           className="absolute w-48 h-48 border border-green-200 rounded-full mix-blend-multiply"
        />
        <div className="z-10 bg-white border-4 border-neutral-800 rounded-2xl w-32 h-40 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          <motion.div
            animate={{ y: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute w-full h-1 bg-green-400 opacity-50 shadow-[0_0_10px_#4ade80]"
          />
          <span className="text-4xl mb-2">⚖️</span>
          <span className="font-black text-neutral-800 text-xs bg-neutral-100 px-2 py-1 rounded">SECURED</span>
        </div>
      </div>
    )
  }
];

export default function Presentation() {
  return (
    <div className="w-full h-[calc(100vh-80px)] min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Scrollable Container - Only this scrolls, not the page */}
      <div className="w-full max-w-5xl h-[70vh] min-h-[500px] overflow-y-auto relative hide-scroll rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.1)] border border-neutral-200/50 bg-white snap-y snap-mandatory">
        
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-[70vh] min-h-[500px] snap-start relative"
            style={{ zIndex: index * 10 }}
          >
            <section
              className="sticky top-0 w-full h-[70vh] min-h-[500px] flex flex-col md:flex-row shadow-[0_-15px_30px_rgba(0,0,0,0.05)] overflow-hidden bg-white rounded-t-3xl border-t border-neutral-100"
            >
              {/* Left Text Content */}
            <div className="w-full md:w-5/12 flex flex-col justify-center px-12 h-full z-10 bg-white/50 backdrop-blur-sm">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold text-neutral-400 mb-3 tracking-widest uppercase"
              >
                Slide 0{slide.id} of 0{slides.length}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-neutral-900"
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg font-light leading-relaxed text-neutral-600"
              >
                {slide.content}
              </motion.p>
            </div>
            
            {/* Right Animation Area */}
            <div className="w-full md:w-7/12 h-full flex items-center justify-center p-8 relative">
              {/* Subtle background decoration instead of solid column division */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full h-full max-h-96 aspect-square z-10 flex items-center justify-center"
              >
                <slide.Animation />
              </motion.div>
            </div>
            </section>
          </div>
        ))}
      </div>
      
      <p className="absolute bottom-6 text-neutral-400 font-mono text-sm opacity-80 animate-pulse">
        Scroll inside the container to stack cards ↓
      </p>
    </div>
  );
}


