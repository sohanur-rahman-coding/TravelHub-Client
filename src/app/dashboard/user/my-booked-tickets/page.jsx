"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Ticket,
  CreditCard,
  MapPin,
  Calendar,
  Download,
  Ban,
  Clock,
  Loader2,
  QrCode,
  Info,
  ArrowRight,
  ReceiptText
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/api/tickets";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import "animate.css";
import Link from "next/link";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

function BookingCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m left`);
    };
    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className="text-xs font-black font-mono !bg-slate-100 dark:!bg-slate-800 !text-slate-700 dark:!text-slate-300 px-2.5 py-1 rounded-lg tracking-wider transition-colors">
      {timeLeft}
    </span>
  );
}

export default function MyBookedTickets() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings(user?.email);
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (bookingId) => {
    try {
      setDownloadingId(bookingId);
      
      const element = document.getElementById(`real-ticket-${bookingId}`);
      
      if (!element) throw new Error("Ticket element not found");

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new window.Image();
      img.src = dataUrl;
      
      img.onload = () => {
        const imgWidth = pdfWidth - 20; 
        const imgHeight = (img.height * imgWidth) / img.width;
        pdf.addImage(dataUrl, "PNG", 10, 20, imgWidth, imgHeight);
        pdf.save(`E-Ticket-${bookingId.slice(-6).toUpperCase()}.pdf`);
        setDownloadingId(null);
      };
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF.");
      setDownloadingId(null);
    }
  };

  function cancelBooking(id) {
    setBookings((bs) =>
      bs.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center transition-colors duration-300 animate__animated animate__fadeIn">
        <div className="p-5 !bg-white dark:!bg-slate-800 rounded-full shadow-xl animate-bounce">
          <Ticket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 transition-colors duration-300 animate__animated animate__zoomIn">
        <div className="!bg-white dark:!bg-slate-900 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black !text-slate-900 dark:!text-white mb-3">Access Required</h2>
          <p className="!text-slate-500 dark:!text-gray-400 font-bold mb-8">Please log in to view your booked tickets.</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/30"
          >
            Go to Login <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans transition-colors duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 animate__animated animate__fadeInDown">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-3 transition-colors">
            <Ticket size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Bookings & Journeys</span>
          </div>
          <h2 className="text-4xl font-black !text-slate-900 dark:!text-white tracking-tight transition-colors">
            My Booked Tickets
          </h2>
        </div>
        <div className="!bg-white dark:!bg-slate-900 px-5 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-colors">
            <span className="text-xs font-bold !text-slate-400 dark:!text-slate-500 uppercase tracking-widest">Total Bookings</span>
            <span className="text-xl font-black !text-slate-900 dark:!text-white tabular-nums leading-none">{bookings.length}</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="!bg-white dark:!bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center shadow-lg max-w-2xl mx-auto animate__animated animate__fadeInUp transition-colors">
          <div className="w-24 h-24 !bg-slate-50 dark:!bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ReceiptText size={40} className="!text-slate-300 dark:!text-slate-600" />
          </div>
          <h3 className="text-2xl font-black !text-slate-900 dark:!text-white mb-3">No Bookings Found</h3>
          <p className="!text-slate-500 dark:!text-slate-400 font-bold mb-8 max-w-md mx-auto">You haven't booked any tickets yet. Explore destinations and book your next adventure.</p>
          <Link
            href="/allTickets"
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 inline-flex items-center gap-2 text-sm tracking-wide"
          >
            Explore Tickets <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking, index) => {
            const ticket = booking.ticketDetails;
            if (!ticket) return null;

            const isExpired = new Date(ticket.date).getTime() < Date.now();
            const isRejected = booking.status === "rejected";
            const isAccepted = booking.status === "accepted";
            const isPaid = booking.status === "paid";
            const isPending = booking.status === "pending";

            const PNR = booking._id.slice(-6).toUpperCase();

            return (
              <div key={booking._id} className="animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.08}s` }}>
                
                {/* 🟢 Hidden PDF Ticket - Fully forced to Light Mode colors for perfect PDF generation */}
                <div className="absolute top-[-9999px] left-[-9999px]">
                  <div
                    id={`real-ticket-${booking._id}`}
                    className="w-[900px] h-auto !bg-white border-2 !border-gray-200 flex rounded-2xl overflow-hidden font-sans !text-gray-900"
                    style={{ backgroundColor: '#ffffff', color: '#111827' }}
                  >
                    <div className="w-2/3 p-8 flex flex-col justify-between border-r-2 border-dashed !border-gray-300 relative">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h1 className="text-3xl font-black !text-blue-600 tracking-tight">TRAVELHUB</h1>
                          <p className="text-sm font-bold !text-gray-500 uppercase tracking-widest mt-1">E-Ticket / Boarding Pass</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs !text-gray-500 uppercase font-bold mb-1">PNR Number</p>
                          <p className="text-2xl font-mono font-black !text-gray-900 !bg-gray-100 px-3 py-1 rounded-lg">{PNR}</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <p className="text-xs !text-gray-500 uppercase font-bold mb-1">Passenger Name</p>
                        <p className="text-xl font-bold !text-gray-900">{user.name}</p>
                        <p className="text-sm !text-gray-500">{user.email}</p>
                      </div>

                      <div className="flex items-center gap-6 !bg-gray-50 p-6 rounded-xl border !border-gray-200 mb-6">
                        <div className="flex-1">
                          <p className="text-xs !text-gray-500 uppercase font-bold mb-1">From</p>
                          <p className="text-lg font-black !text-gray-900">{ticket.from}</p>
                        </div>
                        <div className="!text-gray-400">
                          <ArrowRight size={24} />
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-xs !text-gray-500 uppercase font-bold mb-1">To</p>
                          <p className="text-lg font-black !text-gray-900">{ticket.to}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs !text-gray-500 uppercase font-bold mb-1">Departure Date & Time</p>
                          <p className="text-lg font-bold !text-gray-900">
                            {new Date(ticket.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {new Date(ticket.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs !text-gray-500 uppercase font-bold mb-1">Transport</p>
                          <p className="text-lg font-bold !text-gray-900">{ticket.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-1/3 !bg-blue-50 p-8 flex flex-col justify-between items-center text-center">
                      <div className="w-full">
                        <h2 className="text-xl font-black !text-blue-600 mb-6">BOARDING STUB</h2>
                        
                        <div className="!bg-white p-4 rounded-xl border !border-blue-100 inline-block mb-6 shadow-sm">
                          <QrCode size={100} className="!text-gray-900 mx-auto" />
                        </div>
                        
                        <p className="text-sm font-bold !text-gray-600 mb-1">{booking.quantity} Seat(s)</p>
                        <p className="text-2xl font-black !text-gray-900 mb-6">${booking.totalPrice}</p>
                      </div>

                      <div className="w-full !bg-white/60 p-4 rounded-xl text-xs text-left font-medium !text-gray-600 flex gap-2">
                        <Info size={16} className="!text-blue-500 shrink-0" />
                        <p>Please arrive at the boarding point at least 30 minutes before departure time.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🟢 Displayed Ticket Card */}
                <div className="!bg-white dark:!bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col relative transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                  
                  <div className="h-52 !bg-slate-100 dark:!bg-slate-800 relative shrink-0 overflow-hidden">
                    <Image
                      src={ticket.image || FALLBACK_IMAGE}
                      alt={ticket.title}
                      fill
                      unoptimized
                      className={`object-cover transition-transform duration-700 hover:scale-105 ${isExpired || isRejected ? "grayscale opacity-70" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {ticket.type}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border border-white/10 shadow-sm ${
                          isPending
                            ? "bg-amber-500 text-white"
                            : isAccepted
                              ? "bg-green-600 text-white"
                              : isRejected
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-transparent">
                    <div>
                      <h3 className="font-black !text-slate-900 dark:!text-white text-xl leading-snug line-clamp-2 transition-colors">
                        {ticket.title}
                      </h3>
                      <div className="flex items-center justify-between mt-4 !bg-slate-50 dark:!bg-slate-800/80 p-3 rounded-xl border border-gray-200/60 dark:border-slate-700/60 transition-colors">
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
                          ${booking.totalPrice}
                        </span>
                        <span className="text-xs font-black !text-slate-600 dark:!text-slate-300 !bg-white dark:!bg-slate-700 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-inner transition-colors">
                          {booking.quantity} Seat{booking.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm font-bold !text-slate-700 dark:!text-slate-200 transition-colors">
                        <MapPin size={16} className="text-blue-500 shrink-0" />
                        <span className="truncate">{ticket.from}</span>
                        <ArrowRight size={14} className="!text-slate-400 shrink-0" />
                        <span className="truncate">{ticket.to}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold !text-slate-600 dark:!text-slate-400 transition-colors">
                        <Calendar size={16} className="text-blue-500 shrink-0" />
                        {new Date(ticket.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-slate-700 mt-1 transition-colors">
                      {!isRejected && (
                        <div className="flex items-center gap-2 text-xs !text-slate-500 dark:!text-slate-400 font-bold">
                          <Clock size={14} className="text-blue-500" />
                          {isExpired ? (
                            <span className="text-red-500 font-black tracking-wide">
                              Journey Expired
                            </span>
                          ) : (
                            <BookingCountdown targetDate={ticket.date} />
                          )}
                        </div>
                      )}
                      {isRejected && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-black tracking-wide">
                          <Ban size={14} /> Request Denied
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      {isPaid && (
                        <button 
                          onClick={() => handleDownloadPDF(booking._id)}
                          disabled={downloadingId === booking._id}
                          className="w-full !bg-slate-100 dark:!bg-slate-800 border border-gray-200 dark:border-slate-700 !text-slate-700 dark:!text-slate-200 rounded-xl py-3.5 text-sm font-black hover:!bg-slate-200 dark:hover:!bg-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-sm active:scale-[0.98]"
                        >
                          {downloadingId === booking._id ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                          {downloadingId === booking._id ? "Generating PDF..." : "Download E-Ticket"}
                        </button>
                      )}

                      {isAccepted && !isExpired && (
                        <form
                          action="/api/checkout_sessions"
                          method="POST"
                          className="w-full"
                        >
                          <input type="hidden" name="price" value={booking.totalPrice} />
                          <input type="hidden" name="title" value={ticket.title} />
                          <input type="hidden" name="bookingId" value={booking._id} />

                          <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3.5 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 active:scale-[0.98] cursor-pointer tracking-wide border-transparent"
                          >
                            <CreditCard size={18} /> Pay Now — ${booking.totalPrice}
                          </button>
                        </form>
                      )}

                      {isAccepted && isExpired && (
                        <button disabled className="w-full !bg-slate-100 dark:!bg-slate-800 !text-slate-400 dark:!text-slate-600 rounded-xl py-3.5 text-sm font-black cursor-not-allowed border border-transparent">
                          Cannot Pay (Expired)
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl py-3.5 text-sm font-black hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] tracking-wide"
                        >
                          <Ban size={18} /> Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}