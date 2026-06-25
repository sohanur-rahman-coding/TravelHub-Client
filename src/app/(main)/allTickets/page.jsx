"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import { getAllApprovedTickets } from "@/lib/api/tickets";
import { Search, MapPin, Filter, ArrowUpDown, Loader2, Ticket, ChevronLeft, ChevronRight } from "lucide-react";

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
    if (page !== 1) {
      setPage(1);
    } else {
      fetchTickets();
    }
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
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
            Find Your Next Destination
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Search, filter, and sort through our wide selection of tickets to find the perfect journey for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="From (Location)"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="To (Location)"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={handleFilterChange(setFilterType)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="All">All Transports</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Air">Air</option>
                <option value="Ship">Ship</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowUpDown size={18} className="text-gray-400" />
              </div>
              <select
                value={sortPrice}
                onChange={handleFilterChange(setSortPrice)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="default">Sort by Default</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Search size={18} /> Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 bg-gray-100 text-gray-600 rounded-xl py-3 font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={40} className="text-blue-600 animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
            <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No Tickets Found</h3>
            <button
              onClick={handleReset}
              className="mt-6 bg-blue-50 text-blue-600 font-bold px-6 py-2.5 rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
              {tickets.map((ticket) => (
                <Card key={ticket._id} ticket={ticket} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      page === idx + 1
                        ? "bg-blue-600 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllTickets;