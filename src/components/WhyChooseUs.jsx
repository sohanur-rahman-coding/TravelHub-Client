"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Clock, 
  Headphones, 
  Zap, 
  Tag, 
  QrCode, 
  RefreshCw,
  CheckCircle2,
  Lock,
  Globe2,
  Ticket
} from "lucide-react";

const features = [
  { 
    icon: <ShieldCheck className="w-7 h-7 text-cyan-500" />, 
    title: "100% Verified Safe Travel", 
    desc: "Rigorous operator audits, verified professional drivers, SSL 256-bit payment encryption, and instant digital QR verification on all routes."
  },
  { 
    icon: <Clock className="w-7 h-7 text-cyan-500" />, 
    title: "On-Time Departure Guarantee", 
    desc: "Real-time departure tracking across high-speed rail, express bus fleets, and premium airlines with automated delay notifications."
  },
  { 
    icon: <Headphones className="w-7 h-7 text-cyan-500" />, 
    title: "24/7 AI & Human Concierge", 
    desc: "Round-the-clock support powered by our intelligent AI assistant and dedicated travel specialists ready to assist anytime."
  },
  { 
    icon: <Tag className="w-7 h-7 text-cyan-500" />, 
    title: "Transparent Pricing & Zero Hidden Fees", 
    desc: "What you see is what you pay. Complete fare transparency with upfront breakdowns for seat reservations, taxes, and luggage."
  },
  { 
    icon: <QrCode className="w-7 h-7 text-cyan-500" />, 
    title: "Instant Digital E-Tickets & QR Pass", 
    desc: "Receive instant printable PDF tickets with live scannable QR codes delivered straight to your email and user account dashboard."
  },
  { 
    icon: <RefreshCw className="w-7 h-7 text-cyan-500" />, 
    title: "Flexible Rebooking & Easy Refunds", 
    desc: "Hassle-free ticket modifications, seat re-assignments, and fast refund processing managed directly from your user panel."
  }
];

const TRUST_BAR = [
  { icon: <CheckCircle2 className="w-5 h-5 text-cyan-500" />, title: "Guaranteed Seat Locks", desc: "Reserved seat protection during checkout" },
  { icon: <Ticket className="w-5 h-5 text-cyan-500" />, title: "Instant Boarding Passes", desc: "Downloadable PDF with QR scanner code" },
  { icon: <Lock className="w-5 h-5 text-cyan-500" />, title: "PCI-DSS Encrypted", desc: "100% secure Stripe payment gateway" },
  { icon: <Globe2 className="w-5 h-5 text-cyan-500" />, title: "500+ Connected Routes", desc: "Global rail, air, and highway coverage" }
];

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4 sm:px-6 relative bg-default-50/60 dark:bg-slate-900/40 border-y border-default-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-500" /> Premium Travel Guarantee
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
          >
            Why Choose TravelHub?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-base sm:text-lg mt-3 font-normal max-w-2xl mx-auto"
          >
            Built for modern travelers who demand total reliability, transparent pricing, and instant digital ticketing on every single trip.
          </motion.p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-8 rounded-[2rem] border border-default-200 dark:border-slate-800 bg-content1 shadow-lg hover:shadow-xl hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                {f.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{f.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed font-normal">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Highlight Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-[2rem] bg-content1 border border-default-200 dark:border-slate-800 shadow-xl"
        >
          {TRUST_BAR.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mt-0.5">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-foreground/60 font-normal mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}