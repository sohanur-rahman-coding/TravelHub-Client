"use client";

import { useState, useEffect } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import {
  Ticket,
  CreditCard,
  MapPin,
  Calendar,
  Download,
  Ban,
  Clock,
  Loader2,
  QrCode as QrIcon,
  Info,
  ArrowRight,
  ReceiptText,
  Lock,
  Armchair,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/api/tickets";
import { cancelBookingHoldAction } from "@/lib/actions/tickets";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Countdown for Departure Date
function BookingCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetDate) return;
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft("Departed");
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

// 10-Minute Seat Lock Expiration Timer (Phase 4)
function SeatLockTimer({ expiresAt, onExpire }) {
  const [remaining, setRemaining] = useState({ minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!expiresAt) return;

    const checkLock = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setRemaining({ minutes: m, seconds: s, isExpired: false });
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (remaining.isExpired) {
    return (
      <span className="text-[11px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 flex items-center gap-1">
        <Lock size={10} /> Hold Expired (10m)
      </span>
    );
  }

  return (
    <span className="text-[11px] font-mono font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
      <Clock size={10} className="animate-pulse" />
      Lock: {String(remaining.minutes).padStart(2, "0")}:{String(remaining.seconds).padStart(2, "0")} left
    </span>
  );
}

export default function MyBookedTickets() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [qrCodeMap, setQrCodeMap] = useState({});

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
      setBookings(data || []);

      // Pre-generate QR codes for all paid tickets
      const qrs = {};
      for (const b of data || []) {
        if (b.status === "paid") {
          const pnr = b._id.slice(-6).toUpperCase();
          const qrData = JSON.stringify({
            app: "TravelHub",
            pnr: `TH-${pnr}`,
            passenger: user?.email,
            seats: b.seats || [],
            journey: b.ticketDetails?.title || b.ticketTitle,
            amount: `$${b.totalPrice}`,
            verified: true,
          });
          qrs[b._id] = await QRCode.toDataURL(qrData, { width: 160, margin: 1 });
        }
      }
      setQrCodeMap(qrs);
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
        pdf.save(`TravelHub-ETicket-${bookingId.slice(-6).toUpperCase()}.pdf`);
        setDownloadingId(null);
        toast.success("E-Ticket PDF downloaded!");
      };
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF.");
      setDownloadingId(null);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await cancelBookingHoldAction(id);
      setBookings((bs) =>
        bs.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast.success("Seat hold cancelled and released.");
    } catch (error) {
      toast.error("Failed to cancel hold. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center transition-colors duration-300">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="p-5 !bg-white dark:!bg-slate-800 rounded-full shadow-xl"
        >
          <Ticket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="!bg-white dark:!bg-slate-900 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black !text-slate-900 dark:!text-white mb-3">Access Required</h2>
          <p className="!text-slate-500 dark:!text-gray-400 font-bold mb-8">Please log in to view your booked tickets.</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/30 border-transparent"
          >
            Go to Login <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Ticket size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              Interactive Reservations &amp; QR Tickets
            </span>
          </div>
          <h2 className="text-4xl font-black !text-slate-900 dark:!text-white tracking-tight transition-colors">
            My Booked Tickets
          </h2>
        </div>
        <div className="!bg-white dark:!bg-slate-900 px-5 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-colors">
          <span className="text-xs font-bold !text-slate-400 dark:!text-slate-500 uppercase tracking-widest">
            Total Bookings
          </span>
          <span className="text-xl font-black !text-slate-900 dark:!text-white tabular-nums leading-none">
            {bookings.length}
          </span>
        </div>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="!bg-white dark:!bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center shadow-lg max-w-2xl mx-auto transition-colors"
        >
          <div className="w-24 h-24 !bg-slate-50 dark:!bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ReceiptText size={40} className="!text-slate-300 dark:!text-slate-600" />
          </div>
          <h3 className="text-2xl font-black !text-slate-900 dark:!text-white mb-3">No Bookings Found</h3>
          <p className="!text-slate-500 dark:!text-slate-400 font-bold mb-8 max-w-md mx-auto">
            You haven&apos;t reserved any seats yet. Explore destinations and pick your seats on our interactive map.
          </p>
          <Link
            href="/allTickets"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 inline-flex items-center gap-2 text-sm tracking-wide border-transparent"
          >
            Explore Tickets <ArrowRight size={16} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking, index) => {
            const ticket = booking.ticketDetails;
            if (!ticket) return null;

            const isJourneyExpired = new Date(ticket.date).getTime() < Date.now();
            const isRejected = booking.status === "rejected";
            const isAccepted = booking.status === "accepted";
            const isPaid = booking.status === "paid";
            const isPending = booking.status === "pending";
            const isLockExpired = booking.status === "expired" || (isPending && booking.expiresAt && new Date(booking.expiresAt).getTime() < Date.now());

            const PNR = booking._id.slice(-6).toUpperCase();
            const seatList = Array.isArray(booking.seats) && booking.seats.length > 0 ? booking.seats : [];

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
              >
                {/* 🟢 Hidden PDF Boarding Pass for High-Resolution Export */}
                <div className="absolute top-[-9999px] left-[-9999px]">
                  <div
                    id={`real-ticket-${booking._id}`}
                    className="w-[920px] h-auto !bg-white border-2 !border-gray-300 flex rounded-3xl overflow-hidden font-sans !text-gray-900 shadow-2xl"
                    style={{ backgroundColor: "#ffffff", color: "#111827" }}
                  >
                    {/* Main Ticket Info (Left 65%) */}
                    <div className="w-2/3 p-8 flex flex-col justify-between border-r-2 border-dashed !border-gray-300 relative bg-white">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h1 className="text-3xl font-black !text-cyan-600 tracking-tight flex items-center gap-2">
                            TRAVELHUB
                          </h1>
                          <p className="text-xs font-bold !text-gray-400 uppercase tracking-widest mt-0.5">
                            Official Digital E-Ticket &amp; Boarding Pass
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] !text-gray-400 uppercase font-black tracking-wider mb-0.5">
                            PNR NUMBER
                          </p>
                          <p className="text-xl font-mono font-black !text-cyan-600 !bg-cyan-50 px-3 py-1 rounded-lg border !border-cyan-200">
                            TH-{PNR}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 !bg-gray-50 p-4 rounded-2xl border !border-gray-200">
                        <div>
                          <p className="text-[10px] !text-gray-400 uppercase font-bold">Passenger Name</p>
                          <p className="text-base font-black !text-gray-900">{booking.userName || user.name}</p>
                          <p className="text-xs !text-gray-500 truncate">{booking.userEmail || user.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] !text-gray-400 uppercase font-bold">Seat Assignment</p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {seatList.length > 0 ? (
                              seatList.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded-md !bg-cyan-600 !text-white font-mono font-black text-xs"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs font-bold !text-gray-700">{booking.quantity} General Seat(s)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Origin -> Destination Banner */}
                      <div className="flex items-center gap-6 !bg-cyan-50/50 p-5 rounded-2xl border !border-cyan-200/80 mb-6">
                        <div className="flex-1">
                          <p className="text-[10px] !text-cyan-700 uppercase font-bold mb-0.5">Departure</p>
                          <p className="text-lg font-black !text-gray-900">{ticket.from}</p>
                        </div>
                        <div className="!text-cyan-500">
                          <ArrowRight size={24} />
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-[10px] !text-cyan-700 uppercase font-bold mb-0.5">Destination</p>
                          <p className="text-lg font-black !text-gray-900">{ticket.to}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end text-xs">
                        <div>
                          <p className="text-[10px] !text-gray-400 uppercase font-bold">Departure Date &amp; Time</p>
                          <p className="text-sm font-bold !text-gray-900">
                            {new Date(ticket.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(ticket.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] !text-gray-400 uppercase font-bold">Transport Mode</p>
                          <p className="text-sm font-bold !text-gray-900 capitalize">{ticket.type || "Coach"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Boarding Stub with QR Code (Right 35%) */}
                    <div className="w-1/3 !bg-slate-50 p-8 flex flex-col justify-between items-center text-center border-l border-gray-100">
                      <div className="w-full flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 mb-4">
                          PASSENGER STUB
                        </span>

                        {/* Verified QR Code */}
                        <div className="!bg-white p-3 rounded-2xl border-2 !border-gray-200 shadow-md mb-4 flex items-center justify-center">
                          {qrCodeMap[booking._id] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={qrCodeMap[booking._id]}
                              alt="Verification QR"
                              className="w-28 h-28 object-contain"
                            />
                          ) : (
                            <QrIcon size={100} className="!text-gray-800" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mb-3">
                          <ShieldCheck size={12} /> Scan to verify pass
                        </div>

                        <p className="text-xs font-bold !text-gray-500 mb-0.5">
                          {booking.quantity} Confirmed Seat{booking.quantity > 1 ? "s" : ""}
                        </p>
                        <p className="text-2xl font-black !text-gray-900">${booking.totalPrice}</p>
                      </div>

                      <div className="w-full !bg-white p-3 rounded-xl text-[10px] text-left font-medium !text-gray-500 border border-gray-200">
                        Please arrive 30 mins prior to departure. Keep QR pass ready for scanning.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🟢 Displayed Ticket Card */}
                <div className="!bg-white dark:!bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col relative transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                  <div
                    className="relative overflow-hidden bg-slate-200 dark:bg-slate-800"
                    style={{ height: "220px", minHeight: "220px", maxHeight: "220px" }}
                  >
                    <OptimizedImage
                      ticket={ticket}
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className={`object-cover transition-transform duration-700 hover:scale-105 ${
                        isJourneyExpired || isRejected || isLockExpired ? "grayscale opacity-70" : ""
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {ticket.type}
                    </div>

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border border-white/10 shadow-sm ${
                          isLockExpired
                            ? "bg-red-600 text-white"
                            : isPaid
                              ? "bg-emerald-500 text-white"
                              : isAccepted
                                ? "bg-green-600 text-white"
                                : isRejected
                                  ? "bg-red-600 text-white"
                                  : "bg-amber-500 text-white"
                        }`}
                      >
                        {isLockExpired ? "Expired" : isPaid ? "Paid & Confirmed" : booking.status}
                      </span>
                    </div>

                    {/* Seat number badges overlay */}
                    {seatList.length > 0 && (
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white/70 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Armchair size={11} /> Seats:
                        </span>
                        {seatList.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-mono font-black text-slate-950 bg-cyan-400 px-2 py-0.5 rounded-md shadow-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-transparent">
                    <div>
                      <h3 className="font-black !text-slate-900 dark:!text-white text-xl leading-snug line-clamp-2 mb-3">
                        {ticket.title}
                      </h3>

                      {/* Live 10-minute hold countdown for pending bookings */}
                      {isPending && !isLockExpired && (
                        <div className="mb-3">
                          <SeatLockTimer expiresAt={booking.expiresAt} onExpire={fetchBookings} />
                        </div>
                      )}

                      <div className="flex items-center justify-between !bg-slate-50 dark:!bg-slate-800/80 p-3 rounded-xl border border-gray-200/60 dark:border-slate-700/60 transition-colors">
                        <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 leading-none">
                          ${booking.totalPrice}
                        </span>
                        <span className="text-xs font-black !text-slate-600 dark:text-slate-300 !bg-white dark:!bg-slate-700 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-inner">
                          {booking.quantity} Seat{booking.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm font-bold !text-slate-700 dark:!text-slate-200">
                        <MapPin size={15} className="text-cyan-500 shrink-0" />
                        <span className="truncate">{ticket.from}</span>
                        <ArrowRight size={13} className="!text-slate-400 shrink-0" />
                        <span className="truncate">{ticket.to}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold !text-slate-600 dark:!text-slate-400">
                        <Calendar size={15} className="text-cyan-500 shrink-0" />
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

                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-slate-700">
                      {!isRejected && (
                        <div className="flex items-center gap-2 text-xs !text-slate-500 dark:!text-slate-400 font-bold">
                          <Clock size={14} className="text-cyan-500" />
                          {isJourneyExpired ? (
                            <span className="text-red-500 font-black tracking-wide">Journey Departed</span>
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

                    <div className="mt-4">
                      {/* Paid & Confirmed: Download E-Ticket with QR Code */}
                      {isPaid && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDownloadPDF(booking._id)}
                            disabled={downloadingId === booking._id}
                            className="w-full !bg-slate-900 dark:!bg-cyan-500 hover:!bg-slate-800 dark:hover:!bg-cyan-400 !text-white dark:!text-slate-950 rounded-xl py-3.5 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-md active:scale-[0.98]"
                          >
                            {downloadingId === booking._id ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Download size={18} />
                            )}
                            {downloadingId === booking._id ? "Generating PDF Pass..." : "Download QR E-Ticket"}
                          </button>
                          <Link
                            href={`/allTickets/${ticket._id}`}
                            className="w-full text-center text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline py-1 flex items-center justify-center gap-1"
                          >
                            ★ Leave Passenger Review
                          </Link>
                        </div>
                      )}

                      {/* Pay Now for pending/accepted non-expired reservations */}
                      {(isAccepted || isPending) && !isLockExpired && !isJourneyExpired && (
                        <form action="/api/checkout_sessions" method="POST" className="w-full">
                          <input type="hidden" name="price" value={booking.totalPrice} />
                          <input type="hidden" name="title" value={ticket.title} />
                          <input type="hidden" name="bookingId" value={booking._id} />

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl py-3.5 text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.98] cursor-pointer tracking-wide border-transparent"
                          >
                            <CreditCard size={18} /> Pay Now with Stripe — ${booking.totalPrice}
                          </button>
                        </form>
                      )}

                      {/* Expired hold */}
                      {isLockExpired && (
                        <div className="w-full text-center">
                          <p className="text-xs text-red-500 font-bold mb-2">
                            10-minute reservation hold expired.
                          </p>
                          <Link
                            href={`/allTickets/${ticket._id}`}
                            className="inline-flex items-center justify-center gap-1.5 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-xl text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          >
                            Re-select Seats <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}

                      {isPending && !isLockExpired && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full mt-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-slate-800/40"
                        >
                          <Ban size={14} /> Cancel Hold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}