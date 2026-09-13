"use client";

import { useState } from "react";
import {
  X,
  Minus,
  Plus,
  MapPin,
  Calendar,
  Loader2,
  Ticket,
  ArrowRight,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function BookingModal({
  isOpen,
  onClose,
  ticket,
  userEmail,
  onSuccess,
}) {
  const [qty, setQty] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  if (!isOpen || !ticket) return null;

  const totalPrice = ticket.price * qty;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleConfirmBooking = async () => {
    if (qty > ticket.quantity) {
      toast.warning("Booking quantity cannot exceed available seats.");
      return;
    }
    setIsBooking(true);
    try {
      const bookingData = {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        vendorEmail: ticket.vendorEmail,
        userEmail,
        quantity: qty,
        totalPrice,
        status: "pending",
        bookingDate: new Date().toISOString(),
      };
      const { data: token } = await authClient.token();
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Failed to save booking");
      toast.success("Booking confirmed!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      {/* ── Dialog ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-md overflow-hidden
          rounded-[2rem]
          border border-zinc-200/80 dark:border-zinc-800/70
          bg-white/95 dark:bg-zinc-950
          shadow-[0_32px_64px_rgba(0,0,0,0.18)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.7)]
          backdrop-blur-2xl
          transition-colors duration-300
          animate-modal-in
        "
        style={{
          animation: "modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >

        {/* ── Decorative blobs ── */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-zinc-200/40 blur-3xl dark:bg-indigo-950/30" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-40 rounded-full bg-zinc-100/60 blur-3xl dark:bg-blue-950/20" />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-7 pt-7 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Ticket size={18} className="text-zinc-900 dark:text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Seat Reservation
              </p>
              <h2 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Confirm Booking
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 items-center justify-center rounded-full border border-zinc-200/70 bg-transparent text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
          >
            <X size={16} className="transition-transform duration-300 hover:rotate-90" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="relative px-7 py-5 flex flex-col gap-5">

          {/* Journey Card */}
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 p-4">
            <p className="text-base font-black tracking-tight text-zinc-900 dark:text-white mb-3 line-clamp-1">
              {ticket.title}
            </p>

            {/* From → To */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <MapPin size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                <span>{ticket.from}</span>
              </div>
              <ArrowRight size={14} className="text-zinc-400 shrink-0" />
              <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <MapPin size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                <span>{ticket.to}</span>
              </div>
            </div>

            {/* Date & type row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-500">
                <Calendar size={12} className="text-zinc-400" />
                {formatDate(ticket.date)}
              </span>
              {ticket.type && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-900/10 text-zinc-700 dark:bg-white/10 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  <Tag size={9} />
                  {ticket.type}
                </span>
              )}
            </div>
          </div>

          {/* Seat selector */}
          <div>
            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Number of Seats
            </label>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex size-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Minus size={16} />
              </button>

              <div className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-3xl font-black tabular-nums text-zinc-900 dark:text-white">
                  {qty}
                </span>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mt-0.5">
                  of {ticket.quantity} avail.
                </p>
              </div>

              <button
                onClick={() => setQty((q) => Math.min(ticket.quantity, q + 1))}
                className="flex size-12 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-white dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/80 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500">
                {qty} seat{qty > 1 ? "s" : ""} × ${ticket.price}
              </span>
              <span className="text-sm font-black text-zinc-900 dark:text-white">
                ${ticket.price * qty}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 bg-zinc-900 dark:bg-white">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                Total Amount
              </span>
              <span className="text-2xl font-black text-white dark:text-zinc-900 leading-none">
                ${totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            onClick={onClose}
            className="w-1/3 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-black uppercase tracking-wider text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmBooking}
            disabled={isBooking}
            className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 cursor-pointer border-transparent shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
          >
            {isBooking ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Confirm Booking
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── CSS Animation ── */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}