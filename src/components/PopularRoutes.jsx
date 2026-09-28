"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowUpRight, Compass, Sparkles } from "lucide-react";

const DESTINATIONS = [
  { 
    id: 1,
    city: "Tokyo",
    country: "Japan",
    region: "Asia & Pacific",
    price: "$850", 
    type: "Flight & Bullet Rail",
    duration: "11h 30m Direct",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800",
    searchQuery: "Tokyo"
  },
  { 
    id: 2,
    city: "Paris",
    country: "France",
    region: "Europe",
    price: "$620", 
    type: "Eurostar & Express Flight",
    duration: "2h 15m Eurostar",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1609971757431-439cf7b4141b?q=80&w=687&auto=format&fit=crop",
    searchQuery: "Paris"
  },
  { 
    id: 3,
    city: "New York",
    country: "United States",
    region: "Americas",
    price: "$740", 
    type: "Transatlantic Flight",
    duration: "7h 45m Non-stop",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800",
    searchQuery: "New York"
  },
  { 
    id: 4,
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    price: "$490", 
    type: "Polaris & Eurostar Express",
    duration: "3h 30m Express",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800",
    searchQuery: "London"
  },
  { 
    id: 5,
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Asia & Pacific",
    price: "$920", 
    type: "Emirates First & Business",
    duration: "6h 50m Direct Flight",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800",
    searchQuery: "Dubai"
  },
  { 
    id: 6,
    city: "Zurich",
    country: "Switzerland",
    region: "Europe",
    price: "$510", 
    type: "Swiss SBB Railway & Air",
    duration: "2h 10m Scenic Rail",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800",
    searchQuery: "Zurich"
  }
];

const CATEGORIES = ["All Destinations", "Europe", "Asia & Pacific", "Americas"];

export function PopularRoutes() {
  const [activeCategory, setActiveCategory] = useState("All Destinations");

  const filteredDestinations = activeCategory === "All Destinations" 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.region === activeCategory);

  return (
    <section className="py-24 px-4 sm:px-6 relative bg-default-50/60 dark:bg-slate-900/40 border-t border-default-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-500" /> Curated Travel Hub
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
            >
              Top Global <span className="text-cyan-500 dark:text-cyan-400">Destinations</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-foreground/70 text-base sm:text-lg mt-3 font-normal max-w-2xl"
            >
              Discover top-rated cities connected by high-speed trains, non-stop flights, and luxury buses.
            </motion.p>
          </div>

          {/* View All Button */}
          <Link
            href="/allTickets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-content1 hover:bg-default-100 text-foreground font-bold text-sm transition-all hover:scale-105 active:scale-95 border border-default-200 dark:border-slate-800 shadow-md"
          >
            <span>Explore All Routes</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-500" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105"
                    : "bg-content1 text-foreground/80 hover:bg-default-100 border border-default-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Destinations Interactive Cards Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((route, i) => (
              <motion.div
                key={route.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link 
                  href={`/allTickets?to=${encodeURIComponent(route.searchQuery)}`}
                  className="group relative block overflow-hidden rounded-[2.5rem] h-[460px] shadow-xl border border-default-200 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:border-cyan-500/50 bg-content1"
                >
                  {/* Background Image with Hover Zoom */}
                  <Image
                    src={route.img}
                    alt={route.city}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    quality={75}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 group-hover:from-slate-950/90 transition-all duration-500" />

                  {/* Top Header Badges */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {route.type}
                    </span>

                    <span className="px-3.5 py-1.5 rounded-full bg-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-500/30">
                      From {route.price}
                    </span>
                  </div>

                  {/* Bottom Content Card */}
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs tracking-wider uppercase">
                        <MapPin className="w-4 h-4 text-cyan-400" /> {route.country}
                      </p>
                      <span className="text-xs font-medium text-white/80">
                        {route.duration}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-white tracking-tight mb-4 flex items-center justify-between">
                      <span className="group-hover:text-cyan-300 transition-colors">{route.city}</span>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-cyan-500">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </h3>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80 font-medium">
                      <span>Instant Seat Booking</span>
                      <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:text-cyan-300">
                        View Available Tickets →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}