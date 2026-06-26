import React from "react";
import Card from "@/components/Card";
import { getAllApprovedTickets } from "@/lib/api/tickets";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const LatestTickets = async () => {
  const response = await getAllApprovedTickets({ limit: 6 });
  const tickets = Array.isArray(response) ? response : (response?.tickets || []);

  if (!tickets || tickets.length === 0) return null;

  return (
    // 🟢 এখান থেকে bg-white dark:bg-gray-950 সরিয়ে দেওয়া হয়েছে
    <section className="py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <Sparkles size={20} />
              <span className="font-bold tracking-widest uppercase text-sm">New Arrivals</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              Latest Destinations
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
              Discover our most recently added journeys and book your next adventure before seats run out.
            </p>
          </div>
          
          <Link
            href="/allTickets"
            className="hidden sm:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-500/10 px-5 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {tickets.map((ticket) => (
            <Card key={ticket._id} ticket={ticket} />
          ))}
        </div>

        <div className="mt-10 sm:hidden flex justify-center">
          <Link
            href="/allTickets"
            className="flex items-center justify-center gap-2 w-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
          >
            View All Tickets <ArrowRight size={18} />
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default LatestTickets;