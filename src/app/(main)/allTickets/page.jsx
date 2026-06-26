"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import { getAllApprovedTickets } from "@/lib/api/tickets";
import { Search, MapPin, Filter, ArrowUpDown, Loader2, Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import 'animate.css';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortPrice, setSortPrice] = useState("default");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 6;

  useEffect(() => {
    fetchTickets();
  }, [filterType, sortPrice, page]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllApprovedTickets({
        from: searchFrom,
        to: searchTo,
        type: filterType,
        sortPrice: sortPrice,
        page: page,
        limit: LIMIT
      });
      setTickets(data.tickets || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (page !== 1) setPage(1);
    else fetchTickets();
  };

  const handleReset = () => {
    setSearchFrom("");
    setSearchTo("");
    setFilterType("All");
    setSortPrice("default");
    setPage(1);
    setTimeout(() => fetchTickets(), 0);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen py-16 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 animate__animated animate__fadeInDown">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-5">
            Find Your Next Destination
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-base md:text-lg">
            Search, filter, and sort through our wide selection of tickets to find the perfect journey for you.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-800 p-6 mb-14 animate__animated animate__fadeInUp animate__delay-1s">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="From (Location)"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="To (Location)"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Filter size={18} className="text-blue-500" />
              </div>
              <select
                value={filterType}
                onChange={handleFilterChange(setFilterType)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner cursor-pointer"
              >
                <option value="All">All Transports</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Plane">Air</option>
                <option value="Ship">Ship</option>
              </select>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <ArrowUpDown size={18} className="text-blue-500" />
              </div>
              <select
                value={sortPrice}
                onChange={handleFilterChange(setSortPrice)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner cursor-pointer"
              >
                <option value="default">Sort by Default</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex gap-3 h-[52px]">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                <Search size={18} /> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl py-3 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 border border-transparent dark:border-gray-700"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate__animated animate__fadeIn">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-lg">
               <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-[2rem] p-16 text-center shadow-lg max-w-2xl mx-auto animate__animated animate__zoomIn">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <Ticket size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No Tickets Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">We couldn't find any tickets matching your search criteria. Try adjusting your filters.</p>
            <button
              onClick={handleReset}
              className="bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="animate__animated animate__fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16">
              {tickets.map((ticket, index) => (
                <div key={ticket._id} className={`w-full animate__animated animate__fadeInUp`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card ticket={ticket} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
  <div className="flex justify-center items-center gap-3 animate__animated animate__fadeInUp animate__delay-1s">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 !bg-white dark:!bg-gray-900 !text-gray-600 dark:!text-gray-400 hover:!bg-gray-50 dark:hover:!bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <ChevronLeft size={20} />
    </button>
    
    <div className="flex gap-2 !bg-white dark:!bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          onClick={() => setPage(idx + 1)}
          className={`w-11 h-11 rounded-lg font-bold text-sm transition-all ${
            page === idx + 1
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-transparent !text-gray-600 dark:!text-gray-400 hover:!bg-gray-100 dark:hover:!bg-gray-800"
          }`}
        >
          {idx + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
      className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 !bg-white dark:!bg-gray-900 !text-gray-600 dark:!text-gray-400 hover:!bg-gray-50 dark:hover:!bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <ChevronRight size={20} />
    </button>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;