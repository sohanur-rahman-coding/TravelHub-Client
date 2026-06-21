"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowRight, Plane, Bus, Globe2 } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Fly Across Continents",
    subtitle: "Premium air travel connecting you to the world.",
    icon: <Plane className="w-6 h-6" />,
    bg: "bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000')]"
  },
  {
    title: "Ground-Breaking Bus Travel",
    subtitle: "Reliable, comfortable, and luxurious land journeys.",
    icon: <Bus className="w-6 h-6" />,
    bg: "bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000')]"
  }
];

export function PremiumTravelBanner() {
  return (
    <div className="relative mt-10 w-full h-[75vh] rounded-[2rem] overflow-hidden shadow-2xl border border-default-200">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        navigation={true}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            {/* High-quality background */}
            <div className={`absolute inset-0 ${slide.bg} bg-cover bg-center`} />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative h-full flex flex-col justify-center px-10 md:px-20 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit text-cyan-400 font-semibold mb-6 border border-white/20">
                  {slide.icon} <span>{slide.title.includes("Air") ? "GLOBAL AIR" : "PREMIUM GROUND"}</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-xl text-gray-200 mb-10 max-w-lg">
                  {slide.subtitle}
                </p>

                {/* Professional High-Contrast Button */}
                <div className="flex gap-4">
                  <Button 
                    className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-10 py-7 rounded-full text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105"
                  >
                    View All Tickets <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Footer Stats - Added Value */}
      <div className="absolute bottom-8 left-10 md:left-20 z-10 hidden md:flex gap-8 text-white">
         <div className="flex items-center gap-2">
            <Globe2 className="text-cyan-400" />
            <span className="font-bold">120+ Countries</span>
         </div>
         <div className="w-[1px] h-6 bg-white/20" />
         <span className="font-light opacity-80">24/7 Global Support</span>
      </div>
    </div>
  );
}