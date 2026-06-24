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
  ArrowRight
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/api/tickets";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

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
    <span className="text-xs font-bold font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
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
      // এখানে আমরা ড্যাশবোর্ডের কার্ডের বদলে আমাদের লুকানো প্রফেশনাল টিকিটটি সিলেক্ট করছি
      const element = document.getElementById(`real-ticket-${bookingId}`);
      
      if (!element) throw new Error("Ticket element not found");

      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF("l", "mm", "a4"); // ল্যান্ডস্কেপ (Landscape) মোড টিকিটের জন্য
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new window.Image();
      img.src = dataUrl;
      
      img.onload = () => {
        // ইমেজকে PDF-এর মাঝখানে বসানোর লজিক
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
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-bold text-gray-500 animate-pulse">
          Loading your bookings...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 font-bold text-gray-900">
        Please log in to view your bookings.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      <h2 className="text-2xl font-black text-gray-900 mb-6">
        My Booked Tickets
      </h2>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Ticket className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            You haven't booked any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const ticket = booking.ticketDetails;
            if (!ticket) return null;

            const isExpired = new Date(ticket.date).getTime() < Date.now();
            const isRejected = booking.status === "rejected";
            const isAccepted = booking.status === "accepted";
            const isPaid = booking.status === "paid";
            const isPending = booking.status === "pending";

            // PNR জেনারেট করা (Booking ID এর শেষ ৬ অক্ষর)
            const PNR = booking._id.slice(-6).toUpperCase();

            return (
              <div key={booking._id}>
                {/* ------------------------------------------------------------------ */}
                {/* 🔴 HIDDEN TICKET FOR PDF DOWNLOAD (Not visible on screen) */}
                {/* ------------------------------------------------------------------ */}
                <div className="absolute top-[-9999px] left-[-9999px]">
                  <div
                    id={`real-ticket-${booking._id}`}
                    className="w-[900px] h-auto bg-white border-2 border-gray-200 flex rounded-2xl overflow-hidden font-sans text-gray-900"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    {/* Left Section - Main Details */}
                    <div className="w-2/3 p-8 flex flex-col justify-between border-r-2 border-dashed border-gray-300 relative">
                      {/* Brand Header */}
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h1 className="text-3xl font-black text-blue-600 tracking-tight">TRAVELHUB</h1>
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">E-Ticket / Boarding Pass</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">PNR Number</p>
                          <p className="text-2xl font-mono font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{PNR}</p>
                        </div>
                      </div>

                      {/* Passenger & Ticket Info */}
                      <div className="mb-8">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Passenger Name</p>
                        <p className="text-xl font-bold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      {/* Journey Details */}
                      <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">From</p>
                          <p className="text-lg font-black">{ticket.from}</p>
                        </div>
                        <div className="text-gray-400">
                          <ArrowRight size={24} />
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">To</p>
                          <p className="text-lg font-black">{ticket.to}</p>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Departure Date & Time</p>
                          <p className="text-lg font-bold">
                            {new Date(ticket.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at {new Date(ticket.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Transport</p>
                          <p className="text-lg font-bold">{ticket.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Tear-off Stub */}
                    <div className="w-1/3 bg-blue-50 p-8 flex flex-col justify-between items-center text-center">
                      <div className="w-full">
                        <h2 className="text-xl font-black text-blue-600 mb-6">BOARDING STUB</h2>
                        
                        <div className="bg-white p-4 rounded-xl border border-blue-100 inline-block mb-6 shadow-sm">
                          {/* Fake QR Code using Icon */}
                          <QrCode size={100} className="text-gray-900 mx-auto" />
                        </div>
                        
                        <p className="text-sm font-bold text-gray-600 mb-1">{booking.quantity} Seat(s)</p>
                        <p className="text-2xl font-black text-gray-900 mb-6">${booking.totalPrice}</p>
                      </div>

                      <div className="w-full bg-white/60 p-4 rounded-xl text-xs text-left font-medium text-gray-600 flex gap-2">
                        <Info size={16} className="text-blue-500 shrink-0" />
                        <p>Please arrive at the boarding point at least 30 minutes before departure time.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ------------------------------------------------------------------ */}
                {/* 🟢 VISIBLE DASHBOARD CARD (What user sees on screen) */}
                {/* ------------------------------------------------------------------ */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col relative transition-all hover:shadow-md h-full">
                  
                  <div className="h-44 bg-gray-100 relative shrink-0 overflow-hidden">
                    <Image
                      src={ticket.image || FALLBACK_IMAGE}
                      alt={ticket.title}
                      fill
                      unoptimized
                      className={`object-cover ${isExpired || isRejected ? "grayscale opacity-70" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {ticket.type}
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                          isPending
                            ? "bg-amber-500 text-white"
                            : isAccepted
                              ? "bg-green-500 text-white"
                              : isRejected
                                ? "bg-red-500 text-white"
                                : "bg-blue-600 text-white"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
                        {ticket.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-2xl font-black text-blue-600">
                          ${booking.totalPrice}
                        </span>
                        <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-md">
                          {booking.quantity} Seat{booking.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100 mt-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <MapPin size={14} className="text-blue-500 shrink-0" />
                        <span className="truncate">{ticket.from}</span> →{" "}
                        <span className="truncate">{ticket.to}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Calendar size={14} className="text-blue-500 shrink-0" />
                        {new Date(ticket.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-1">
                      {!isRejected && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                          <Clock size={14} />
                          {isExpired ? (
                            <span className="text-red-500 font-black">
                              Journey Expired
                            </span>
                          ) : (
                            <BookingCountdown targetDate={ticket.date} />
                          )}
                        </div>
                      )}
                      {isRejected && (
                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-black">
                          <Ban size={14} /> Request Denied
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4">
                      {isPaid && (
                        <button 
                          onClick={() => handleDownloadPDF(booking._id)}
                          disabled={downloadingId === booking._id}
                          className="w-full bg-gray-100 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        >
                          {downloadingId === booking._id ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
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
                            className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-black hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                          >
                            <CreditCard size={16} /> Pay Now — $
                            {booking.totalPrice}
                          </button>
                        </form>
                      )}

                      {isAccepted && isExpired && (
                        <button disabled className="w-full bg-gray-100 text-gray-400 rounded-xl py-3 text-sm font-bold cursor-not-allowed">
                          Cannot Pay (Expired)
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full border border-red-200 text-red-500 rounded-xl py-3 text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Ban size={16} /> Cancel Request
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