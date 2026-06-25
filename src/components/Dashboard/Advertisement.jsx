import { getAdvertisementData } from "@/lib/api/tickets";
import React from "react";
import Card from "../Card";

const Advertisement = async () => {
  const response = await getAdvertisementData();
  
  
  const data = Array.isArray(response) ? response : (response?.tickets || []);

  if (!data || data.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Featured Tickets
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Handpicked premium tickets chosen just for you. Grab them before they
          sell out!
        </p>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {data.map((ticket) => (
          <Card key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
};

export default Advertisement;