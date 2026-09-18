"use client";

import { useState, useEffect } from "react";
import { toggleFeaturedTicket } from "@/lib/actions/tickets";
import toast from "react-hot-toast";

const MAX_FEATURED = 6;

export default function FeaturedTicketsTable({ ticketsData }) {
  const [tickets, setTickets] = useState(ticketsData || []);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setTickets(ticketsData || []);
  }, [ticketsData]);

  // Dynamic count of currently featured tickets
  const featuredCount = tickets.filter((t) => t.isAdvertised).length;

  const handleFeature = async (id, currentState) => {
    if (!currentState && featuredCount >= MAX_FEATURED) {
      toast.error(`You cannot feature more than ${MAX_FEATURED} tickets at a time.`);
      return;
    }

    setLoadingId(id);

    try {
      const result = await toggleFeaturedTicket(id, currentState);

      if (result?.success) {
        setTickets((prevTickets) =>
          prevTickets.map((t) =>
            t._id === id ? { ...t, isAdvertised: !currentState } : t
          )
        );
        toast.success(result?.message || `Ticket ${!currentState ? 'Featured' : 'Unfeatured'} successfully!`);
      } else {
        toast.error(result?.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const atLimit = featuredCount >= MAX_FEATURED;

  return (
    <>
      {/* Premium Header Summary Card */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div
          className={[
            "px-4 py-2.5 rounded-xl font-bold text-sm border transition-all duration-300 flex items-center gap-2.5 shadow-sm backdrop-blur-md",
            atLimit
              ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
              : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
          ].join(" ")}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${atLimit ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${atLimit ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
          </span>
          <span>Featured Limit:</span>
          <span className="font-extrabold tracking-wide">{featuredCount} / {MAX_FEATURED}</span>
        </div>
      </div>

      {/* Premium Table Container */}
      <div className="bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl shadow-xl backdrop-blur-xl overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-900/50">
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 dark:divide-gray-700/60">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-medium">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((item, index) => {
                const isLoading = loadingId === item._id;
                const isFeatured = Boolean(item.isAdvertised);

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-150"
                  >
                    <td className="px-6 py-4.5 text-gray-400 dark:text-gray-500 font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4.5 font-semibold text-foreground">
                      {item.title}
                    </td>
                    <td className="px-6 py-4.5 text-gray-600 dark:text-gray-400">
                      {item.vendorName}
                    </td>
                    <td className="px-6 py-4.5 font-bold text-foreground">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleFeature(item._id, isFeatured)}
                          disabled={isLoading || (!isFeatured && atLimit)}
                          className={[
                            "relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer",
                            "transition-all duration-200 border shadow-xs hover:scale-[1.02] active:scale-[0.98]",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                            isFeatured
                              ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-500/20"
                              : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600/60 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-2 h-2 rounded-full transition-colors",
                              isLoading
                                ? "bg-amber-500 animate-pulse"
                                : isFeatured
                                ? "bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                                : "bg-gray-400 dark:bg-gray-500",
                            ].join(" ")}
                          />
                          {isLoading
                            ? "Updating…"
                            : isFeatured
                            ? "Featured"
                            : "Feature"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
