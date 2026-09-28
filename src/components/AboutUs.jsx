"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  Zap, 
  Bot, 
  Ticket, 
  ArrowRight,
  Plane,
  Train,
  Bus,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PILLARS = [
  {
    icon: <Globe2 className="w-6 h-6 text-cyan-500" />,
    title: "Unified Multi-Modal Network",
    desc: "Seamlessly search, compare, and book tickets across flights, high-speed rail, and executive sleeper buses in a single interface."
  },
  {
    icon: <Zap className="w-6 h-6 text-cyan-500" />,
    title: "Real-Time Seat Lock Protection",
    desc: "Lock your selected seat for 10 minutes during checkout to ensure no double-bookings or lost seat reservations."
  },
  {
    icon: <Bot className="w-6 h-6 text-cyan-500" />,
    title: "24/7 AI Travel Concierge",
    desc: "Instant live AI chatbot assistant built into TravelHub to help you find optimal routes, check live status, and answer queries."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />,
    title: "100% Verified Operator Guarantee",
    desc: "We rigorously audit every bus operator, rail line, and airline partner to enforce safety, punctuality, and comfort standards."
  }
];

export function AboutUs() {
  return (
    <section 
      id="about-us" 
      className="py-24 px-4 sm:px-6 relative bg-default-50/60 dark:bg-slate-900/40 border-t border-b border-default-200/60 dark:border-slate-800/60 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> About TravelHub Platform
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Empowering Modern Travel <span className="text-cyan-500 dark:text-cyan-400">Air, Rail & Highway</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-base sm:text-lg mt-4 font-normal leading-relaxed"
          >
            TravelHub is a next-generation travel ecosystem built to eliminate ticketing friction with verified operators, instant QR boarding passes, and transparent pricing.
          </motion.p>
        </div>

        {/* Story Grid & Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column — TravelHub Transport Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-default-200 dark:border-slate-800 h-[500px] bg-slate-950">
              {/* High Resolution TravelHub Transit Image */}
              <Image
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200"
                alt="TravelHub Executive Transit Fleet"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center scale-105"
                quality={75}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/20" />

              {/* Top Travel Mode Badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                  <Plane className="w-3.5 h-3.5 text-cyan-400" />
                  <Train className="w-3.5 h-3.5 text-cyan-400" />
                  <Bus className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="ml-1 text-[11px]">Multi-Modal Hub</span>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-[2rem] bg-slate-900/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-400">TravelHub Operations</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                  </span>
                </div>
                <div className="text-3xl font-black text-white mb-1">12,500+ Journeys</div>
                <p className="text-xs text-white/80 font-medium">Successfully completed with verified passenger ratings</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column — 4 Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PILLARS.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed font-normal">{pillar.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom CTA Bar */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-slate-800 shadow-lg">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Ready for your next journey?</h4>
                  <p className="text-xs text-foreground/70 font-normal mt-0.5">Book verified tickets with instant seat selection and QR boarding passes.</p>
                </div>

                <Link
                  href="/allTickets"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>Explore All Tickets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
