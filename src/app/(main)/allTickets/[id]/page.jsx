"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  ChevronLeft,
  CreditCard,
  Check,
  CheckCircle,
  Plane,
  Train,
  Bus,
  Ticket,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import BookingModal from "@/components/BookingModal";
import "animate.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function CountdownBlocks({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-bold p-4 rounded-2xl text-center w-full animate__animated animate__fadeIn">
        This journey has departed
      </div>
    );
  }

  const Block = ({ value, label }) => (
    <div className="flex flex-col items-center bg-blue-600 dark:bg-blue-500 text-white rounded-2xl py-3 w-[72px] shadow-lg shadow-blue-600/20 dark:shadow-blue-900/40 border border-blue-500 dark:border-blue-400 transform transition-transform hover:scale-105">
      <span className="text-3xl font-black tabular-nums leading-none tracking-tight">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-80">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center w-full">
      <Block value={timeLeft.days} label="Days" />
      <Block value={timeLeft.hours} label="Hours" />
      <Block value={timeLeft.minutes} label="Min" />
      <Block value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

export default function TicketDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: session } = authClient.useSession();
  const user = session?.user || null;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tickets/${id}`);
        if (!res.ok) throw new Error("Ticket not found");
        const data = await res.json();
        setTicket(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center transition-colors duration-300">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-xl animate-bounce">
          <Ticket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] p-16 text-center shadow-2xl max-w-lg w-full animate__animated animate__zoomIn">
          <Ticket size={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Ticket Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The ticket you are looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(ticket.date).getTime() < Date.now();
  const isSoldOut = ticket.quantity === 0;
  const canBook = !isExpired && !isSoldOut && !!user;

  const formatDepartureDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "plane": return <Plane className="w-4 h-4" />;
      case "train": return <Train className="w-4 h-4" />;
      case "bus": return <Bus className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 pt-10 transition-colors duration-300 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors font-bold group w-fit animate__animated animate__fadeInDown"
        >
          <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 group-hover:-translate-x-1 transition-transform">
            <ChevronLeft size={16} />
          </div>
          Back to Tickets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8 animate__animated animate__fadeInLeft">
            
            <div className="rounded-[2.5rem] overflow-hidden h-[450px] w-full relative shadow-2xl dark:shadow-none border border-gray-100 dark:border-gray-800 group">
              <Image
                src={ticket.image || FALLBACK_IMAGE}
                alt={ticket.title}
                fill
                unoptimized
                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit px-4 py-1.5 rounded-full mb-5 border border-blue-100 dark:border-blue-500/20">
                {getTransportIcon(ticket.type)}
                <span className="text-xs font-black uppercase tracking-wider">{ticket.type}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight leading-tight">
                {ticket.title}
              </h1>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8 font-medium">
                Operated by <span className="font-black text-gray-900 dark:text-white">{ticket.vendorName}</span>
              </p>

              <div className="flex items-end gap-1.5 mb-10">
                <span className="text-5xl font-black text-blue-600 dark:text-blue-400 leading-none">
                  ${ticket.price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1.5 uppercase tracking-widest">
                  / seat
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-gray-100 dark:border-gray-700">
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-2 block">
                    From
                  </span>
                  <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="truncate">{ticket.from}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-2 block">
                    To
                  </span>
                  <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base">
                    <MapPin size={16} className="text-blue-500" />
                    <span className="truncate">{ticket.to}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-2 block">
                    Seats Left
                  </span>
                  <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base">
                    <div className="w-4 h-4 rounded-full border-[2px] border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    {ticket.quantity}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-2 block">
                    Transport
                  </span>
                  <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base capitalize">
                    <div className="w-4 h-4 rounded-full border-[2px] border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    {ticket.type}
                  </div>
                </div>
              </div>

              <div className="py-8">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-3 block">
                  Departure Time
                </span>
                <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-lg bg-gray-50 dark:bg-gray-900 w-fit px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                  {formatDepartureDate(ticket.date)}
                </div>
              </div>

              <div className="pb-8">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-3 block">
                  About This Journey
                </span>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Enjoy a comfortable and safe journey from <strong className="text-gray-900 dark:text-white">{ticket.from}</strong> to <strong className="text-gray-900 dark:text-white">{ticket.to}</strong>.
                  This {ticket.type.toLowerCase()} service is operated by <strong className="text-gray-900 dark:text-white">{ticket.vendorName}</strong>, ensuring top-tier service and punctuality.
                </p>
              </div>

              {ticket.perks && ticket.perks.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-4 block">
                    Included Perks
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {ticket.perks.map((p) => (
                      <div
                        key={p}
                        className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 dark:border-emerald-500/20 shadow-sm"
                      >
                        <Check size={14} className="text-emerald-600 dark:text-emerald-500" /> {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex flex-col gap-6 sticky top-[100px] pb-8">
              
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col items-center animate__animated animate__fadeInRight">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-5 block w-full text-center sm:text-left">
                  Departure Countdown
                </span>
                <CountdownBlocks targetDate={ticket.date} />
              </div>

              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] animate__animated animate__fadeInRight animate__delay-1s">
                <h2 className="font-black text-2xl text-gray-900 dark:text-white">Secure Your Seat</h2>

                {isExpired && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400 font-bold">This journey has already departed.</p>
                  </div>
                )}

                {isSoldOut && !isExpired && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400 font-bold">This journey is fully booked.</p>
                  </div>
                )}

                {!user && !isExpired && !isSoldOut && (
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-5">
                    <p className="text-sm text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
                      Please{" "}
                      <button
                        onClick={() => router.push("/signin")}
                        className="font-black underline decoration-2 underline-offset-2 cursor-pointer hover:text-orange-900 dark:hover:text-orange-200 transition-colors"
                      >
                        log in
                      </button>{" "}
                      to confirm your booking for this journey.
                    </p>
                  </div>
                )}

                {booked ? (
                  <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-5 flex items-center gap-3">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-base text-green-700 dark:text-green-300 font-black">Booking confirmed!</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={!canBook}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-200 dark:disabled:from-gray-700 dark:disabled:to-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 text-white rounded-2xl py-4 text-base font-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 disabled:shadow-none cursor-pointer"
                  >
                    <CreditCard size={20} /> Book Now
                  </button>
                )}

                <div className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-gray-700">
                  {[
                    "Secure Stripe payment integrated",
                    "Instant digital booking confirmation",
                    "Cancel before vendor approval",
                  ].map((txt) => (
                    <div key={txt} className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-bold">
                      <div className="p-1 bg-green-50 dark:bg-green-500/10 rounded-full">
                        <Check size={12} className="text-green-600 dark:text-green-400 shrink-0" />
                      </div>
                      {txt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <BookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          ticket={ticket}
          userEmail={user?.email}
          onSuccess={() => setBooked(true)}
        />
      </div>
    </div>
  );
}