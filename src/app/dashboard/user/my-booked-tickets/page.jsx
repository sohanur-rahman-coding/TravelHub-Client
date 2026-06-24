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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserBookings } from "@/lib/api/tickets";
import { updateBookingToPaid } from "@/lib/actions/tickets";
// import { getUserBookings, updateBookingToPaid } from "@/lib/actions/bookings";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

// কাউন্টডাউন কম্পোনেন্ট
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

  const handlePayNow = async (bookingId, amount) => {
    try {
      // TODO: Stripe Checkout Integration will go here
      alert(`Initiating Stripe Payment for $${amount}...`);

      await updateBookingToPaid(bookingId);

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "paid" } : b)),
      );

      alert("Payment Successful! Ticket quantity has been reduced.");
    } catch (error) {
      alert("Payment update failed.");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            return (
              <div
                key={booking._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col relative transition-all hover:shadow-md"
              >
                {/* ইমেজ এবং ব্যাজ */}
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

                {/* টিকিটের ডিটেইলস */}
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

                  {/* কাউন্টডাউন সেকশন (রিজেক্ট হলে দেখাবে না) */}
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

                  {/* বাটন সেকশন */}
                  <div className="mt-auto pt-4">
                    {isPaid && (
                      <button className="w-full bg-gray-100 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <Download size={16} /> Download Ticket
                      </button>
                    )}

                    {isAccepted && !isExpired && (
                      <form
                        action="/api/checkout_sessions"
                        method="POST"
                        className="w-full"
                      >
                        
                        <input
                          type="hidden"
                          name="price"
                          value={booking.totalPrice}
                        />
                        <input
                          type="hidden"
                          name="title"
                          value={ticket.title}
                        />
                        
                        <input
                          type="hidden"
                          name="bookingId"
                          value={booking._id}
                        />

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
                      <button
                        disabled
                        className="w-full bg-gray-100 text-gray-400 rounded-xl py-3 text-sm font-bold cursor-not-allowed"
                      >
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
            );
          })}
        </div>
      )}
    </div>
  );
}
