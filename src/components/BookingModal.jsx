"use client";

import { useState } from "react";
import { X, Minus, Plus, Check, Ticket, Loader2, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import "animate.css";
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

  const handleConfirmBooking = async () => {
    if (qty > ticket.quantity) {
      toast.warning("Booking quantity cannot be greater than available tickets.");
      return;
    }

    setIsBooking(true);

    try {
      const bookingData = {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        vendorEmail: ticket.vendorEmail,
        userEmail: userEmail,
        quantity: qty,
        totalPrice: ticket.price * qty,
        status: "pending",
        bookingDate: new Date().toISOString(),
      };

      const { data: token } = await authClient.token();
      console.log(token, "token");

      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await res.json();

      if (!res.ok)
        throw new Error(responseData.message || "Failed to save booking");

      toast.success("Booking Successful!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Something went wrong while booking.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate__animated animate__fadeIn animate__faster"
      onClick={onClose}
    >
      <div
        className="bg-white! dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] w-full max-w-md shadow-2xl animate__animated animate__zoomIn animate__faster overflow-hidden flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center animate__animated animate__rotateIn transition-colors duration-300">
              <Ticket size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-black text-white transition-colors duration-300">Confirm Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all group cursor-pointer"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400 group-hover:rotate-90 group-hover:text-red-500 transition-all duration-300" />
          </button>
        </div>

        <div className="p-7 flex flex-col gap-6 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
          
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm animate__animated animate__fadeInUp transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
            <p className="font-black text-gray-900 dark:text-white text-base mb-2 leading-tight transition-colors duration-300">
              {ticket.title}
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2 transition-colors duration-300">
                <span className="text-gray-900 dark:text-gray-300">{ticket.from}</span>
                <span className="text-blue-500">→</span>
                <span className="text-gray-900 dark:text-gray-300">{ticket.to}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest transition-colors duration-300">
                {formatDepartureDate(ticket.date)}
              </p>
            </div>
          </div>

          <div className="animate__animated animate__fadeInUp" style={{ animationDelay: '0.2s' }}>
            <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors duration-300">
              Number of Seats
            </label>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 transition-all group shadow-sm cursor-pointer"
              >
                <Minus size={20} className="group-hover:scale-125 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-300" />
              </button>
              
              <div className="flex-1 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-3 rounded-2xl shadow-inner transition-colors duration-300">
                <span className="text-4xl font-black text-blue-600 dark:text-blue-400 tabular-nums transition-colors duration-300">
                  {qty}
                </span>
              </div>
              
              <button
                onClick={() => setQty((q) => Math.min(ticket.quantity, q + 1))}
                className="w-14 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 transition-all group shadow-sm cursor-pointer"
              >
                <Plus size={20} className="group-hover:scale-125 group-hover:rotate-90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300" />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-3 text-center transition-colors duration-300">
              Maximum available: <span className="text-gray-700 dark:text-gray-300">{ticket.quantity}</span> seats
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-5 space-y-3 animate__animated animate__fadeInUp transition-colors duration-300" style={{ animationDelay: '0.3s' }}>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-bold transition-colors duration-300">
                {qty} seat{qty > 1 ? "s" : ""} × ${ticket.price}
              </span>
              <span className="font-black text-gray-900 dark:text-white transition-colors duration-300">
                ${ticket.price * qty}
              </span>
            </div>
            <div className="flex justify-between items-end mt-2 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20 transition-colors duration-300">
              <span className="font-black text-blue-900 dark:text-blue-100 uppercase tracking-widest text-xs transition-colors duration-300">Total Amount</span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none transition-colors duration-300">
                ${ticket.price * qty}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-4 animate__animated animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onClose}
              className="w-1/3 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-sm"
            >
              <XCircle size={18} className="text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300" />
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isBooking}
              className="w-2/3 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white font-black rounded-2xl transition-all flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer group shadow-lg shadow-blue-500/30 active:scale-[0.98] border-transparent"
            >
              {isBooking ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Check size={20} className="group-hover:scale-125 group-hover:-translate-y-1 transition-transform duration-300" /> 
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}