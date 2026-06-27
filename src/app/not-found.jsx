"use client";
import "./globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Compass, ArrowLeft } from "lucide-react";
import "animate.css";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans">
      
      {/* 🟢 Premium Glowing Background Effects */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-amber-500/20 dark:bg-amber-600/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* 🟢 Main Content Card with Glassmorphism */}
      <div className="relative z-10 max-w-2xl w-full px-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-3xl border border-white/50 dark:border-gray-800 p-10 md:p-16 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] text-center animate__animated animate__zoomIn">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-100 dark:border-blue-500/20 shadow-inner animate__animated animate__pulse animate__infinite animate__slower">
              <Compass className="w-14 h-14 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* 404 Text Gradient */}
          <h1 className="text-8xl md:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-amber-500 dark:from-blue-400 dark:to-amber-400 tracking-tighter mb-2 drop-shadow-sm leading-none">
            404
          </h1>

          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-5 tracking-tight">
            Destination Unknown
          </h2>

          <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            It looks like you've ventured off the map. The page or ticket you're looking for doesn't exist or has been moved to a new terminal.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 group border border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 cursor-pointer border-transparent">
                <Home size={18} />
                Back to Home
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}