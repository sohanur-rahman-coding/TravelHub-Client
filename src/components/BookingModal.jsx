import { useState } from "react";
import { X, Minus, Plus, Check } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function BookingModal({ isOpen, onClose, ticket, userEmail, onSuccess }) {
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
      alert("Booking quantity cannot be greater than available tickets.");
      return;
    }

    setIsBooking(true);

    try {
      // ডাটাবেসে পাঠানোর জন্য ডেটা তৈরি
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

      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Failed to save booking");

      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong while booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">Confirm Booking</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="font-black text-gray-900 text-sm mb-1">{ticket.title}</p>
            <p className="text-xs text-gray-500 font-medium">
              {ticket.from} → {ticket.to} · {formatDepartureDate(ticket.date)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Number of Seats
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-black text-gray-900 w-14 text-center tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(ticket.quantity, q + 1))}
                className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <Plus size={16} />
              </button>
              <span className="text-xs text-gray-400 font-bold">
                max {ticket.quantity}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">
                {qty} seat{qty > 1 ? "s" : ""} × ${ticket.price}
              </span>
              <span className="font-black text-gray-900">${ticket.price * qty}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-black text-gray-900 text-lg">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ${ticket.price * qty}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isBooking}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isBooking ? "Booking..." : <><Check size={16} /> Confirm</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}