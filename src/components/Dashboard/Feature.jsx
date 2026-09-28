import { getAdvertisementData } from "@/lib/api/tickets";
import React from "react";
import FeaturedSection from "./FeaturedCarousel";
import FeaturedHeader from "./FeaturedHeader";

const Feature = async () => {
  const response = await getAdvertisementData();
  const data = Array.isArray(response) ? response : (response?.tickets || []);

  if (!data || data.length === 0) return null;

  return (
    <section className="py-0 font-sans overflow-hidden">
      <FeaturedHeader count={data.length} />
      <div className="py-10">
        <FeaturedSection tickets={data} />
      </div>
    </section>
  );
};

export default Feature;