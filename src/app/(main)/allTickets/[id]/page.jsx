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
      <div className="bg-red-50 text-red-600 font-bold p-3 rounded-xl text-center">
        This journey has departed
      </div>
    );
  }

  const Block = ({ value, label }) => (
    <div className="flex flex-col items-center bg-blue-600 text-white rounded-xl py-3 w-[72px] shadow-md">
      <span className="text-3xl font-black tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center">
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
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-pulse text-xl font-bold">
        Loading details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <p className="text-2xl font-black text-gray-900 mb-4">Ticket not found</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
        >
          Back to Home
        </button>
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
      case "plane":
        return <Plane className="w-3.5 h-3.5" />;
      case "train":
        return <Train className="w-3.5 h-3.5" />;
      case "bus":
        return <Bus className="w-3.5 h-3.5" />;
      default:
        return <Ticket className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors font-semibold group w-fit"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to All Tickets
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-[32px] overflow-hidden h-[400px] w-full relative shadow-sm">
              <Image
                src={ticket.image || FALLBACK_IMAGE}
                alt={ticket.title}
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 w-fit px-3 py-1 rounded-md mb-4 border border-blue-100">
                {getTransportIcon(ticket.type)}
                <span className="text-xs font-bold capitalize">{ticket.type}</span>
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-1">
                {ticket.title}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Operated by <span className="font-bold text-gray-900">{ticket.vendorName}</span>
              </p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-black text-blue-600 leading-none">
                  ${ticket.price}
                </span>
                <span className="text-xs text-gray-500 font-medium mb-1">
                  per seat
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">
                    From
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                    <MapPin size={14} className="text-blue-500" />
                    {ticket.from}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">
                    To
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                    <MapPin size={14} className="text-blue-500" />
                    {ticket.to}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">
                    Seats Left
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    {ticket.quantity}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 block">
                    Transport
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm capitalize">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                    {ticket.type}
                  </div>
                </div>
              </div>

              <div className="py-6">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">
                  Departure
                </span>
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <Calendar size={16} className="text-blue-600" />
                  {formatDepartureDate(ticket.date)}
                </div>
              </div>

              <div className="pb-6">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">
                  About This Journey
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enjoy a comfortable and safe journey from {ticket.from} to {ticket.to}.
                  This {ticket.type.toLowerCase()} service is operated by {ticket.vendorName}, ensuring top-tier service and punctuality.
                </p>
              </div>

              {ticket.perks && ticket.perks.length > 0 && (
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 block">
                    Included Perks
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ticket.perks.map((p) => (
                      <div
                        key={p}
                        className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold border border-orange-100"
                      >
                        <Check size={12} className="text-orange-600" /> {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col gap-6 sticky top-24 pb-8">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 block w-full text-left">
                  Departure Countdown
                </span>
                <CountdownBlocks targetDate={ticket.date} />
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
                <h2 className="font-black text-xl text-gray-900">Book Your Seats</h2>

                {isExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 font-bold">This journey has already departed.</p>
                  </div>
                )}

                {isSoldOut && !isExpired && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600 font-bold">This journey is fully booked.</p>
                  </div>
                )}

                {!user && !isExpired && !isSoldOut && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-sm text-orange-800 font-medium">
                      Please{" "}
                      <button
                        onClick={() => router.push("/login")}
                        className="font-bold underline cursor-pointer hover:text-orange-900"
                      >
                        log in
                      </button>{" "}
                      to book this journey.
                    </p>
                  </div>
                )}

                {booked ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                    <p className="text-sm text-green-700 font-bold">Booking confirmed!</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    disabled={!canBook}
                    className="w-full bg-[#fde6b3] text-orange-900 rounded-xl py-4 text-sm font-bold hover:bg-[#fcdca0] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard size={18} /> Book Now
                  </button>
                )}

                <div className="space-y-3 pt-2">
                  {[
                    "Secure Stripe payment",
                    "Instant booking confirmation",
                    "Cancel before vendor accepts",
                  ].map((txt) => (
                    <div key={txt} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                      <Check size={14} className="text-green-500 shrink-0" />
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