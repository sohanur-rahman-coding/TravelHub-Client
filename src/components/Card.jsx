"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Train,
  Bus,
  MapPin,
  Calendar,
  Ticket,
  ArrowRight,
} from "lucide-react";
import "animate.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

const Card = ({ ticket }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [imgSrc, setImgSrc] = useState(ticket?.image || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(ticket?.image || FALLBACK_IMAGE);
  }, [ticket?.image, ticket?._id]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!ticket?.date) return;
      const difference = new Date(ticket.date).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [ticket?.date]);

  if (!ticket) {
    return (
      <div className="max-w-md w-full h-[520px] !bg-slate-100 dark:!bg-slate-800 animate-pulse rounded-[2rem]" />
    );
  }

  const { title, from, to, type, price, quantity, perks, date } = ticket;

  const getTransportIcon = (transportType) => {
    switch (transportType?.toLowerCase()) {
      case "plane":
        return <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "train":
        return <Train className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "bus":
        return <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const formatDepartureDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    // 🟢 bg-white এর বদলে !bg-white dark:!bg-slate-900 ব্যবহার করা হয়েছে
    <div className="max-w-md w-full bg-white! dark:bg-slate-900! rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col justify-between font-sans mx-auto group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate__animated animate__fadeInUp animate__faster">
      
      <div className="relative w-full h-60 bg-gray-100! dark:!bg-slate-800 overflow-hidden">
        <Image
          src={imgSrc}
          alt={title || "Ticket Image"}
          fill
          unoptimized={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />

        <div className="absolute top-4 left-4 flex items-center gap-1.5 !bg-white/95 dark:!bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-slate-700 z-10 transition-colors">
          {getTransportIcon(type)}
          <span className="text-sm font-black !text-slate-900 dark:!text-gray-100 capitalize tracking-wide">
            {type || "Unknown"}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 !bg-white/95 dark:!bg-slate-900/95 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 z-10 transition-colors">
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            ${price || "0"}
          </span>
          <span className="text-xs font-black !text-slate-500 dark:!text-gray-400 ml-1">/seat</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between !bg-white dark:!bg-slate-900 transition-colors duration-300 z-10">
        <div>
          <h3 className="text-xl font-black !text-slate-900 dark:!text-white tracking-tight mb-5 line-clamp-2 leading-snug group-hover:!text-blue-600 dark:group-hover:!text-blue-400 transition-colors">
            {title || "Untitled Ticket"}
          </h3>

          <div className="flex items-center gap-3 !text-slate-800 dark:!text-gray-200 font-black text-sm mb-4 !bg-slate-50 dark:!bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">{from || "TBD"}</span>
            </div>
            <ArrowRight className="w-4 h-4 !text-slate-400 shrink-0" />
            <div className="flex justify-end flex-1 min-w-0 text-right">
              <span className="truncate">{to || "TBD"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 !text-slate-600 dark:!text-slate-400 font-bold text-sm mb-4 transition-colors">
            <Calendar className="w-4 h-4 !text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-semibold">{formatDepartureDate(date) || "Date not set"}</span>
          </div>

          <div className="flex items-center justify-between !text-slate-600 dark:!text-slate-400 font-bold text-sm mb-6 transition-colors">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 !text-slate-400 dark:text-slate-500 shrink-0" />
              <span><strong className="text-slate-900! dark:text-white!">{quantity || 0}</strong> seats left</span>
            </div>
            {timeLeft && (
              <span className={`px-2.5 py-1 text-[11px] font-black rounded-lg font-mono tracking-wider border transition-colors ${
                timeLeft === "Expired" 
                ? "!bg-red-50 dark:!bg-red-500/10 !border-red-200 dark:!border-red-500/20 !text-red-600 dark:!text-red-400" 
                : "!bg-orange-50 dark:!bg-orange-500/10 !border-orange-200 dark:!border-orange-500/20 !text-orange-600 dark:!text-orange-400"
              }`}>
                {timeLeft}
              </span>
            )}
          </div>

          {perks && perks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {perks.slice(0, 3).map((perk, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 !bg-amber-50 dark:!bg-amber-500/10 !text-amber-700 dark:!text-amber-400 px-3 py-1.5 rounded-full text-[11px] font-black border !border-amber-200 dark:!border-amber-500/20 transition-colors"
                >
                  <span className="text-amber-500 text-[10px]">✓</span>
                  {perk}
                </div>
              ))}
              {perks.length > 3 && (
                <span className="text-xs font-black !text-slate-500 dark:!text-slate-400 ml-1">
                  +{perks.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <Link
          href={`/allTickets/${ticket._id}`}
          className="w-full mt-7 py-3.5 !bg-blue-600 hover:!bg-blue-700 dark:!bg-blue-600 dark:hover:!bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 dark:shadow-none transition-all duration-300 text-sm tracking-wide active:scale-[0.98]"
        >
          See Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Card;