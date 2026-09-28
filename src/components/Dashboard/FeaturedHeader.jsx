"use client";

import { motion } from "framer-motion";
import { Award, Sparkles, ShieldCheck, Flame, Compass } from "lucide-react";

export default function FeaturedHeader({ count }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
      {/* ── Signature VIP Floating Capsule Header Bar ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2rem] bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl text-white"
      >
        {/* Glowing Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Title & Badge */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0 mt-1 sm:mt-0">
              <Award className="w-6 h-6 fill-slate-950 text-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[11px] font-black uppercase tracking-widest">
                  <Flame className="w-3 h-3 text-amber-400" /> VIP Selection
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs font-bold text-white/70">Verified Operators Only</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Featured <span className="text-cyan-400">Boarding Passes</span>
              </h2>
            </div>
          </div>

          {/* Right Highlights & Counter */}
          <div className="flex items-center gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <div className="text-left lg:text-right">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 leading-none">{count || 0}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Curated Routes</p>
            </div>

            <div className="h-8 w-px bg-white/15" />

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white/90 font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Instant Seat Allocation</span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
