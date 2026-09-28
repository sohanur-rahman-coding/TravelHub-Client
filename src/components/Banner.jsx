"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Plane, 
  Bus, 
  Train, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  QrCode,
  Ticket,
  Globe2,
  Clock
} from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SLIDES = [
  {
    id: 1,
    category: "GLOBAL AIR TRAVEL",
    title: "Fly Across Continents In Ultimate Luxury",
    subtitle: "Non-stop international flights, lie-flat business class suites, and VIP lounge access worldwide.",
    type: "Flight",
    icon: <Plane className="w-5 h-5 text-cyan-400" />,
    badgeText: "Emirates & Polaris First",
    imgSrc: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000",
    fromCity: "Los Angeles (LAX)",
    toCity: "Tokyo (NRT)",
    price: "$850",
    seatsLeft: 14,
    priority: true,
  },
  {
    id: 2,
    category: "HIGH-SPEED CONTINENTAL RAIL",
    title: "Bullet Train Journeys At 320 km/h",
    subtitle: "Experience scenic high-speed rail across Eurostar, Shinkansen, and Caledonian Sleeper suites.",
    type: "Train",
    icon: <Train className="w-5 h-5 text-cyan-400" />,
    badgeText: "Eurostar & Shinkansen",
    imgSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000",
    fromCity: "London St Pancras",
    toCity: "Paris Gare du Nord",
    price: "$390",
    seatsLeft: 8,
    priority: false,
  },
  {
    id: 3,
    category: "LUXURY EXECUTIVE SLEEPER",
    title: "Intercity Highway Express & Sleeper Buses",
    subtitle: "Reclining leather seats, individual charging hubs, and 100% on-time departure guarantee.",
    type: "Bus",
    icon: <Bus className="w-5 h-5 text-cyan-400" />,
    badgeText: "Green Line & Scania VIP",
    imgSrc: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000",
    fromCity: "Dhaka Central",
    toCity: "Cox's Bazar Sea Resort",
    price: "$120",
    seatsLeft: 22,
    priority: false,
  }
];

// Interactive 3D Perspective Tilt Card Component
function TiltBoardingPass({ slide }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 10);
    setRotateY(x / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full flex justify-center">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full max-w-sm lg:max-w-md p-6 sm:p-8 rounded-[2.5rem] bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white group overflow-hidden cursor-pointer"
      >
        {/* Top 3D Metallic Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

        {/* Pass Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
            {slide.icon}
            <span>{slide.badgeText}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{slide.seatsLeft} Seats Left</span>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Departure</span>
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> {slide.fromCity}
            </h4>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="p-2 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              {slide.icon}
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Destination</span>
            <h4 className="text-xl font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> {slide.toCity}
            </h4>
          </div>
        </div>

        {/* Price & QR Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Starting Fare</span>
            <div className="text-3xl font-black text-cyan-400">{slide.price}</div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15">
            <QrCode className="w-7 h-7 text-cyan-300" />
            <div className="text-[10px] font-bold leading-tight">
              <span>VIP PASS</span>
              <span className="block text-cyan-400">SCAN & GO</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function PremiumTravelBanner() {
  const router = useRouter();
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchType, setSearchType] = useState("All");

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchFrom.trim()) params.append("from", searchFrom.trim());
    if (searchTo.trim()) params.append("to", searchTo.trim());
    if (searchType !== "All") params.append("type", searchType);
    router.push(`/allTickets?${params.toString()}`);
  };

  return (
    <div className="relative mt-4 w-full">
      {/* Outer Hero Container */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-default-200 dark:border-slate-800 bg-slate-950">
        
        {/* Main Swiper Hero Carousel */}
        <div className="relative h-[75vh] min-h-[580px] max-h-[720px]">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination, Navigation]}
            effect="fade"
            navigation={true}
            autoplay={{ delay: 6500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-full w-full"
          >
            {SLIDES.map((slide) => (
              <SwiperSlide key={slide.id} className="relative h-full w-full">
                {/* Background Image */}
                <Image
                  src={slide.imgSrc}
                  alt={slide.title}
                  fill
                  priority={slide.priority}
                  sizes="100vw"
                  className="object-cover object-center scale-105"
                  quality={75}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

                {/* Slide Grid Content */}
                <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 pt-8 pb-28">
                  
                  {/* Left Text Column */}
                  <div className="max-w-2xl text-left text-white z-10 pt-4">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="inline-flex items-center gap-2 bg-cyan-500/15 backdrop-blur-md px-4 py-1.5 rounded-full text-cyan-400 font-extrabold text-xs tracking-widest uppercase mb-5 border border-cyan-500/30 shadow-md"
                    >
                      {slide.icon} <span>{slide.category}</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-base sm:text-lg text-white/80 font-normal leading-relaxed mb-8 max-w-xl"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex flex-wrap items-center gap-4"
                    >
                      <Link
                        href="/allTickets"
                        className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Book Instant Ticket</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>100% Guaranteed Seats</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Interactive 3D Boarding Pass Card */}
                  <div className="hidden lg:flex items-center justify-center z-10">
                    <TiltBoardingPass slide={slide} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Floating First-Fold Quick Search Bar (Flawless Light & Dark Mode) */}
      <div className="relative z-30 -mt-12 sm:-mt-16 max-w-6xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleQuickSearch}
          className="p-5 sm:p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-slate-800 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center backdrop-blur-xl"
        >
          {/* Departure Input */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-default-100 dark:bg-slate-800/80 border border-default-200/80 dark:border-slate-700/80">
            <MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-black uppercase tracking-wider text-foreground/60">From</label>
              <input
                type="text"
                placeholder="e.g. London or LAX"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Destination Input */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-default-100 dark:bg-slate-800/80 border border-default-200/80 dark:border-slate-700/80">
            <MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-black uppercase tracking-wider text-foreground/60">To Destination</label>
              <input
                type="text"
                placeholder="e.g. Tokyo or Paris"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none placeholder:text-foreground/40"
              />
            </div>
          </div>

          {/* Transport Mode Selector */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-default-100 dark:bg-slate-800/80 border border-default-200/80 dark:border-slate-700/80">
            <Ticket className="w-5 h-5 text-cyan-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-black uppercase tracking-wider text-foreground/60">Transport Mode</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-background text-foreground">All Modes (Flight/Rail/Bus)</option>
                <option value="Plane" className="bg-background text-foreground">Air Flight</option>
                <option value="Train" className="bg-background text-foreground">High Speed Rail</option>
                <option value="Bus" className="bg-background text-foreground">Luxury Bus</option>
              </select>
            </div>
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>Search Tickets</span>
          </button>
        </form>
      </div>

    </div>
  );
}