"use client";

import React from "react";
import Link from "next/link";
import { Plane, Bus, Train, Ship, ArrowRight, MapPin, Calendar, Ticket, Star } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

const transportConfig = {
  plane: { icon: Plane, color: "from-blue-500 to-cyan-400", label: "Flight", dot: "bg-blue-400" },
  bus:   { icon: Bus,   color: "from-emerald-500 to-green-400", label: "Bus", dot: "bg-emerald-400" },
  train: { icon: Train, color: "from-violet-500 to-purple-400", label: "Train", dot: "bg-violet-400" },
  launch: { icon: Ship, color: "from-orange-500 to-amber-400", label: "Launch", dot: "bg-orange-400" },
};

const BoardingPassCard = ({ ticket, index }) => {
  const { title, from, to, type, price, quantity, date, _id } = ticket;
  const config = transportConfig[type?.toLowerCase()] || transportConfig.bus;
  const Icon = config.icon;

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (d) => {
    if (!d) return "--:--";
    return new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div
      className="flex flex-col sm:flex-row w-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-700 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Left Image Strip */}
      <div className="relative sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
        <OptimizedImage
          ticket={ticket}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="224px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        {/* Transport badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-xs font-bold shadow-lg`}>
          <Icon size={12} />
          {config.label}
        </div>
        {/* FEATURED badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-1 rounded-full">
          <Star size={9} fill="currentColor" />
          FEATURED
        </div>
      </div>

      {/* Dashed Divider — the "tear line" */}
      <div className="hidden sm:flex flex-col items-center justify-center px-1 py-4 relative">
        <div className="w-px h-full border-l-2 border-dashed border-gray-200 dark:border-slate-600" />
        <div className="absolute -top-3 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-700" />
        <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-700" />
      </div>

      {/* Main Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        {/* Route */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Route</p>
          <div className="flex items-center gap-2">
            <div className="text-left">
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{from || "—"}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Origin</p>
            </div>
            <div className="flex-1 flex items-center gap-1 px-2">
              <div className={`w-2 h-2 rounded-full ${config.dot}`} />
              <div className="flex-1 h-px border-t-2 border-dashed border-gray-200 dark:border-slate-600" />
              <Icon size={16} className="text-gray-400 dark:text-slate-500" />
              <div className="flex-1 h-px border-t-2 border-dashed border-gray-200 dark:border-slate-600" />
              <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{to || "—"}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Destination</p>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
          <div>
            <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400 dark:text-slate-500">Date</p>
            <p className="font-semibold text-gray-700 dark:text-slate-300 mt-0.5">{formatDate(date)}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-slate-600" />
          <div>
            <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400 dark:text-slate-500">Time</p>
            <p className="font-semibold text-gray-700 dark:text-slate-300 mt-0.5">{formatTime(date)}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-slate-600" />
          <div>
            <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400 dark:text-slate-500">Seats Left</p>
            <p className="font-semibold text-gray-700 dark:text-slate-300 mt-0.5">{quantity ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Right Price & CTA strip */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-4 px-5 py-4 sm:py-6 sm:w-36 bg-slate-50 dark:bg-slate-700/60 border-t sm:border-t-0 sm:border-l border-dashed border-gray-200 dark:border-slate-600">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Price</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${price || "0"}</p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500">/seat</p>
        </div>
        <Link
          href={`/allTickets/${_id}`}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r ${config.color} text-white font-bold text-sm shadow-lg hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap`}
        >
          Book Now <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

const FeaturedSection = ({ tickets }) => {
  if (!tickets || tickets.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-6">
      {tickets.map((ticket, index) => (
        <BoardingPassCard key={ticket._id} ticket={ticket} index={index} />
      ))}
    </div>
  );
};

export default FeaturedSection;
