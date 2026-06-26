"use client";

import { useState, useEffect } from "react";
import { CreditCard, CalendarDays, ReceiptText, Loader2, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserTransactions } from "@/lib/api/tickets";
import Link from "next/link";
import "animate.css";

export default function TransactionHistory() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const data = await getUserTransactions(user?.email);
      setTransactions(data);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentDate = (mongoId) => {
    if (!mongoId) return "N/A";
    const timestamp = parseInt(mongoId.substring(0, 8), 16) * 1000;
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 animate__animated animate__fadeIn">
        <div className="p-5 bg-white dark:bg-gray-800 rounded-full shadow-xl animate-bounce">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 transition-colors duration-300 animate__animated animate__zoomIn">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ReceiptText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Access Required</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Please log in to view your secure transaction history.</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/30"
          >
            Go to Login <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full transition-colors duration-300 font-sans overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 animate__animated animate__fadeInDown">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-4">
            <ReceiptText size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Billing & Payments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Transaction History
          </h2>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Records</span>
            <span className="text-xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{transactions.length}</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-[2rem] p-16 text-center shadow-lg animate__animated animate__fadeInUp">
          <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-gray-300 dark:text-gray-600" />
          </div>
          <p className="font-black text-gray-900 dark:text-white text-2xl mb-2">
            No transactions found
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
            You haven't made any successful payments yet. Once you book a ticket, your receipt will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden animate__animated animate__fadeInUp">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">Transaction ID</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">Ticket Details</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">Payment Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {transactions.map((tx, index) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group animate__animated animate__fadeInUp"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">Ref ID</p>
                          <span className="font-mono text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                            #{tx._id.slice(-10)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-[300px]">
                      <p className="text-base font-black text-gray-900 dark:text-white truncate transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {tx.ticketDetails?.title || "Unknown Ticket"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-black px-2.5 py-1 rounded-xl">
                          {tx.quantity} Seat{tx.quantity > 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5 text-sm font-black text-gray-600 dark:text-gray-300">
                        <CalendarDays size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                        {getPaymentDate(tx._id)}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                        ${tx.totalPrice}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}