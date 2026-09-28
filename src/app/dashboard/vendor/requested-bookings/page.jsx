"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getVendorBookings } from "@/lib/api/tickets";
import { updateBookingStatus } from "@/lib/actions/tickets";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "expired", label: "Expired" },
];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  expired: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export default function RequestedBookings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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

  // Counts per tab
  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab.key] =
      tab.key === "all"
        ? bookings.length
        : bookings.filter((b) => b.status === tab.key).length;
    return acc;
  }, {});

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-pulse text-xl font-bold text-black dark:text-white">
        Loading requested bookings...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white">
            Requested Bookings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""} from passengers
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
          <Filter size={13} />
          Filter by status
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
              activeTab === tab.key
                ? "bg-[#0B3977] text-white border-[#0B3977] shadow-md shadow-blue-900/20"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#0B3977]/40 hover:text-[#0B3977] dark:hover:text-blue-300"
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className={`text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">User Email</th>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">Ticket Title</th>
                <th className="p-4 text-black dark:text-white font-bold text-center whitespace-nowrap">Qty</th>
                <th className="p-4 text-black dark:text-white font-bold whitespace-nowrap">Total Price</th>
                <th className="p-4 text-black dark:text-white font-bold text-center whitespace-nowrap">Status</th>
                <th className="p-4 text-black dark:text-white font-bold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {filteredBookings.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="6" className="p-12 text-center">
                      <p className="text-gray-400 dark:text-gray-500 font-bold text-base">
                        No {activeTab !== "all" ? activeTab : ""} booking requests found.
                      </p>
                      {activeTab !== "all" && (
                        <button
                          onClick={() => setActiveTab("all")}
                          className="mt-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View all bookings
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
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
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${
                            STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4 flex justify-end gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking._id, "accepted")}
                              disabled={processingId === booking._id}
                              className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              title="Accept"
                            >
                              <CheckCircle size={18} />
                            </button>

                            <button
                              onClick={() => handleStatusUpdate(booking._id, "rejected")}
                              disabled={processingId === booking._id}
                              className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}