"use client";

import { useState } from "react";
import { Button, Chip } from "@heroui/react";
import { updateTicketStatus } from "@/lib/actions/manageUser";
import toast from "react-hot-toast";

export default function TicketTable({ ticketsData }) {
  const [loadingAction, setLoadingAction] = useState({ id: null, status: null });

  const [tickets, setTickets] = useState(() =>
    Array.isArray(ticketsData) ? ticketsData : ticketsData?.tickets || []
  );

  const handleStatus = async (id, status) => {
    setLoadingAction({ id, status });
    try {
      await updateTicketStatus(id, status);
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, verificationStatus: status } : t
        )
      );
      toast.success(`Ticket ${status} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingAction({ id: null, status: null });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl shadow-xl backdrop-blur-xl overflow-x-auto mt-6">
      <table className="w-full min-w-[800px] text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200/80 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-900/50">
            <th className="px-6 py-4 font-semibold">#</th>
            <th className="px-6 py-4 font-semibold">Title</th>
            <th className="px-6 py-4 font-semibold">Vendor</th>
            <th className="px-6 py-4 font-semibold">Route</th>
            <th className="px-6 py-4 font-semibold">Price</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/80 dark:divide-gray-700/60">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-medium">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((ticket, index) => {
              const isLoading = loadingAction.id === ticket._id;
              return (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-150"
                >
                  <td className="px-6 py-4.5 text-gray-400 dark:text-gray-500 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  <td className="px-6 py-4.5 font-semibold text-foreground">
                    {ticket.title}
                  </td>

                  <td className="px-6 py-4.5 text-gray-600 dark:text-gray-400">
                    {ticket.vendorName}
                  </td>

                  <td className="px-6 py-4.5 text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.from}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 block">to {ticket.to}</span>
                  </td>

                  <td className="px-6 py-4.5 font-bold text-foreground">${ticket.price}</td>

                  <td className="px-6 py-4.5">
                    <Chip
                      size="sm"
                      className={`capitalize text-white font-bold border-none shadow-xs ${
                        ticket.verificationStatus === "approved"
                          ? "bg-emerald-600"
                          : ticket.verificationStatus === "rejected"
                          ? "bg-rose-600"
                          : "bg-amber-500"
                      }`}
                    >
                      {ticket.verificationStatus}
                    </Chip>
                  </td>

                  <td className="px-6 py-4.5">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        className="font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                        onClick={() => handleStatus(ticket._id, "approved")}
                        isDisabled={
                          ticket.verificationStatus === "approved" || isLoading
                        }
                        isLoading={
                          isLoading && loadingAction.status === "approved"
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        className="font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                        onClick={() => handleStatus(ticket._id, "rejected")}
                        isDisabled={
                          ticket.verificationStatus === "rejected" || isLoading
                        }
                        isLoading={
                          isLoading && loadingAction.status === "rejected"
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}