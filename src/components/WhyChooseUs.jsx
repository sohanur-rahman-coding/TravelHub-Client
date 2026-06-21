"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Users } from "lucide-react";

const features = [
  { icon: <ShieldCheck />, title: "100% Safe Travel", desc: "Verified drivers and secure booking protocols." },
  { icon: <Clock />, title: "On-Time Guarantee", desc: "We value your time with strict departure schedules." },
  { icon: <Users />, title: "24/7 Support", desc: "A global team ready to assist you anytime." }
];

export function WhyChooseUs() {
  return (
    <section className="py-20 px-6 bg-default-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-16">Why Choose TravelHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
              className="p-10 rounded-3xl border border-default-200 bg-background transition-colors"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 mb-6 mx-auto text-3xl">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-foreground/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}