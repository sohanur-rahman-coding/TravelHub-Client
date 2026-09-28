"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Calendar,
  Loader2,
  Ticket,
  ArrowRight,
  CheckCircle2,
  Tag,
  Lock,
  Armchair,
  RefreshCw,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Standard seat layout generation (4 seats per row: A, B [aisle] C, D)
function generateSeatLayout(capacity = 36) {
  const rowsCount = Math.max(6, Math.ceil(capacity / 4));
  const layout = [];
  const colLetters = ["A", "B", "C", "D"];

  for (let r = 1; r <= rowsCount; r++) {
    const rowSeats = [];
    colLetters.forEach((col) => {
      rowSeats.push(`${col}${r}`);
    });
    layout.push({ rowNum: r, seats: rowSeats });
  }
  return layout;
}

export default function BookingModal({
  isOpen,
  onClose,
  ticket,
  userEmail,
  onSuccess,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);

  const fetchSeatStatus = useCallback(async () => {
    if (!ticket?._id) return;
    try {
      setLoadingSeats(true);
      const res = await fetch(`${BASE_URL}/api/tickets/${ticket._id}/seats`);
      if (res.ok) {
        const data = await res.json();
        setBookedSeats(data.bookedSeats || []);
        // Locked seats by other users
        const lockedByOthers = (data.lockedSeats || [])
          .filter((l) => l.userEmail !== userEmail)
          .map((l) => l.seat);
        setLockedSeats(lockedByOthers);
      }
    } catch (err) {
      console.error("Failed to load live seats:", err);
    } finally {
      setLoadingSeats(false);
    }
  }, [ticket?._id, userEmail]);

  useEffect(() => {
    if (isOpen && ticket) {
      setSelectedSeats([]);
      fetchSeatStatus();
    }
  }, [isOpen, ticket, fetchSeatStatus]);

  if (!isOpen || !ticket) return null;

  const seatLayout = generateSeatLayout(ticket.capacity || 36);
  const seatPrice = Number(ticket.price || 0);
  const qty = selectedSeats.length > 0 ? selectedSeats.length : 1;
  const totalPrice = seatPrice * qty;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId) || lockedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= Number(ticket.quantity || 10)) {
          toast.error(`Maximum ${ticket.quantity} available seats can be chosen.`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please click to choose at least 1 seat from the layout.");
      return;
    }

    setIsBooking(true);
    try {
      const { data: token } = await authClient.token();
      const bookingData = {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        vendorEmail: ticket.vendorEmail,
        userEmail: userEmail,
        seats: selectedSeats,
        quantity: selectedSeats.length,
        totalPrice: totalPrice,
      };

      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await res.json();

      if (res.status === 409) {
        toast.error(responseData.message || "Seat conflict detected.");
        fetchSeatStatus();
        return;
      }

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to reserve seats");
      }

      toast.success("Seats locked for 10 minutes! Complete payment to confirm.");
      setLockExpiresAt(responseData.expiresAt);
      if (onSuccess) onSuccess(responseData);
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong while reserving seats.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(3, 7, 18, 0.75)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      {/* ── Modal Dialog ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-2xl my-8 overflow-hidden
          rounded-[2rem]
          border border-white/10 dark:border-zinc-800
          bg-slate-900/95 text-white
          shadow-[0_32px_80px_rgba(0,0,0,0.8)]
          backdrop-blur-2xl
          transition-all duration-300
        "
      >
        {/* Decorative ambient blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-56 rounded-full bg-blue-600/15 blur-3xl" />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <Armchair size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                  Phase 5 • Interactive Seat Map
                </p>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Lock size={9} /> 10m Auto-Lock
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white leading-tight">
                Select Your Seats
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSeatStatus}
              title="Refresh live seats"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loadingSeats ? "animate-spin text-cyan-400" : ""} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="relative px-6 sm:px-8 py-5 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">

          {/* Journey info badge */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white line-clamp-1">{ticket.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-white/60 font-medium">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <MapPin size={12} /> {ticket.from}
                </span>
                <ArrowRight size={12} className="text-white/30" />
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <MapPin size={12} /> {ticket.to}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="flex items-center gap-1 text-[11px] font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                <Calendar size={12} />
                {formatDate(ticket.date)}
              </span>
              {ticket.type && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {ticket.type}
                </span>
              )}
            </div>
          </div>

          {/* ── Interactive Cabin & Seat Grid ── */}
          <div className="flex flex-col items-center">
            {/* Cabin Front / Driver Indicator */}
            <div className="w-full max-w-sm flex flex-col items-center mb-3">
              <div className="w-full py-2 px-4 rounded-t-2xl border-t-2 border-x-2 border-dashed border-cyan-500/40 bg-gradient-to-b from-cyan-500/10 to-transparent flex items-center justify-between text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
                <span>🚗 Driver Cabin / Front</span>
                <span>Entry Door 🚪</span>
              </div>
            </div>

            {/* Seat Matrix */}
            {loadingSeats ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-cyan-400" size={32} />
                <span className="text-xs font-bold text-white/40">Syncing live seat availability...</span>
              </div>
            ) : (
              <div className="w-full max-w-sm bg-black/40 border border-white/10 rounded-2xl p-4 shadow-inner">
                <div className="space-y-2.5">
                  {seatLayout.map(({ rowNum, seats }) => {
                    const [seatA, seatB, seatC, seatD] = seats;

                    const renderSeatBtn = (seatId, label) => {
                      const isBooked = bookedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      let btnStyle = "bg-white/10 text-white/70 border-white/10 hover:bg-white/20 hover:border-cyan-400 hover:text-white";

                      if (isBooked) {
                        btnStyle = "bg-red-500/15 text-red-400/40 border-red-500/20 cursor-not-allowed opacity-50";
                      } else if (isLocked) {
                        btnStyle = "bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-not-allowed opacity-75";
                      } else if (isSelected) {
                        btnStyle = "bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105";
                      }

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBooked || isLocked}
                          onClick={() => toggleSeat(seatId)}
                          title={
                            isBooked
                              ? `Seat ${seatId} is already booked`
                              : isLocked
                                ? `Seat ${seatId} is locked in another checkout`
                                : `Click to select seat ${seatId}`
                          }
                          className={`
                            relative w-12 h-11 rounded-xl border flex flex-col items-center justify-center text-[10px] font-bold transition-all duration-150 cursor-pointer
                            ${btnStyle}
                          `}
                        >
                          <span className="leading-none">{seatId}</span>
                          {isLocked && <Lock size={10} className="mt-0.5 text-amber-300" />}
                          {isSelected && <CheckCircle2 size={11} className="mt-0.5 text-slate-950" />}
                        </button>
                      );
                    };

                    return (
                      <div key={rowNum} className="flex items-center justify-between gap-2">
                        {/* Left pair (Window / Aisle) */}
                        <div className="flex gap-2">
                          {renderSeatBtn(seatA)}
                          {renderSeatBtn(seatB)}
                        </div>

                        {/* Aisle walkpath */}
                        <div className="text-[9px] font-mono text-white/20 font-bold px-1 select-none">
                          R{rowNum}
                        </div>

                        {/* Right pair (Aisle / Window) */}
                        <div className="flex gap-2">
                          {renderSeatBtn(seatC)}
                          {renderSeatBtn(seatD)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seat Map Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 text-[11px] font-bold text-white/60">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-cyan-500 border border-cyan-300" />
                <span className="text-cyan-400">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-500/50 flex items-center justify-center">
                  <Lock size={8} className="text-amber-300" />
                </div>
                <span className="text-amber-300">In Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-red-500/20 border border-red-500/30" />
                <span className="text-red-400/60">Sold</span>
              </div>
            </div>
          </div>

          {/* ── Selected Seats & Summary ── */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/50">Selected Seat(s):</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs shadow-sm"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-white/40 italic">None selected yet</span>
                )}
              </div>
            </div>

            {/* 10-minute Lock Guarantee */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <Clock size={14} className="shrink-0 text-cyan-400" />
              <span>
                Seats are automatically locked for <strong>10 minutes</strong> upon booking confirmation to prevent double booking.
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-xs text-white/50 font-medium">
                  {selectedSeats.length} seat(s) × ${seatPrice}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">
                  Total Fare
                </span>
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 sm:px-8 pb-6 pt-2 flex gap-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-1/3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-xs font-black uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmBooking}
            disabled={isBooking || selectedSeats.length === 0}
            className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 font-black shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isBooking ? (
              <>
                <Loader2 size={16} className="animate-spin text-slate-950" />
                Reserving &amp; Locking Seats…
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="text-slate-950" />
                Confirm &amp; Lock Seats (${totalPrice})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}