"use client";

import { useState, useEffect } from "react";
import { CreditCard, CalendarDays, ReceiptText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserTransactions } from "@/lib/api/tickets";
// import { getUserTransactions } from "@/lib/actions/transactions";

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
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-bold text-gray-500 animate-pulse">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 font-bold text-gray-900">
        Please log in to view transactions.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <ReceiptText size={28} className="text-blue-600" />
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">
          <CreditCard
            size={48}
            className="mx-auto text-gray-300 mb-4"
          />
          <p className="font-bold text-gray-900 text-lg">
            No transactions found
          </p>
          <p className="text-gray-500 text-sm mt-1">
            You haven't made any successful payments yet.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 whitespace-nowrap">Transaction ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Ticket Title</th>
                  <th className="px-6 py-4 whitespace-nowrap">Payment Date</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 text-green-600 p-1.5 rounded-lg">
                          <CreditCard size={14} />
                        </div>
                        <span className="font-mono text-sm font-bold text-gray-600 uppercase">
                          {tx._id.slice(-10)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {tx.ticketDetails?.title}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        {tx.quantity} Seat(s)
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                        <CalendarDays size={14} className="text-gray-400" />
                        {getPaymentDate(tx._id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-lg font-black text-green-600">
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