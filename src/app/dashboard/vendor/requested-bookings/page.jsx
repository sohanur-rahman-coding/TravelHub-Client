"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVendorBookings } from "@/lib/api/tickets";
import { updateBookingStatus } from "@/lib/actions/tickets";
import toast from "react-hot-toast";

export default function RequestedBookings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const data = await getVendorBookings(user.email);
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setProcessingId(id);
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking,
        ),
      );
      toast.success(`Booking ${status} successfully!`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-pulse text-xl font-bold text-black dark:text-white">
        Loading requested bookings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-black text-black dark:text-white mb-6">
        Requested Bookings
      </h2>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">User Email</th>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">
                  Ticket Title
                </th>
                <th className="p-4 text-black dark:text-white font-bold text-center whitespace-nowrap">
                  Qty
                </th>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">Total Price</th>
                <th className="p-4 text-black dark:text-white font-bold text-center whitespace-nowrap">
                  Status
                </th>
                <th className="p-4 text-black dark:text-white font-bold text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium"
                  >
                    No booking requests found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {booking.userEmail}
                    </td>

                    <td
                      className="p-4 max-w-[200px] truncate"
                      title={booking.ticketTitle}
                    >
                      {booking.ticketTitle}
                    </td>

                    <td className="p-4 text-center font-bold">
                      {booking.quantity}
                    </td>

                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      ${booking.totalPrice}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          booking.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shadow-sm"
                            : booking.status === "accepted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm"
                              : booking.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4 flex justify-end gap-2">
                      {booking.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "accepted")
                            }
                            disabled={processingId === booking._id}
                            className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            title="Accept"
                          >
                            <CheckCircle size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(booking._id, "rejected")
                            }
                            disabled={processingId === booking._id}
                            className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-black! dark:text-gray-50! py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}