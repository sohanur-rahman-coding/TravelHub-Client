import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.for.nav.png";

export default function Footer() {
  return (
    <footer className="bg-slate-950 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div>
              <Image
                src={logo}
                alt={"logo"}
                className="object-cover"
                height={50}
                width={50}
              />
            </div>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-5">
            Book bus, train, launch &amp; flight tickets easily — all across
            Bangladesh in one seamless experience.
          </p>
          <div className="flex gap-2.5">
            <div
              title="Facebook"
              className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 cursor-pointer transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </div>
            <div
              title="Instagram"
              className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 cursor-pointer transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <div
              title="X (Twitter)"
              className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 cursor-pointer transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-xs text-white/40 mb-5 uppercase tracking-[0.15em]">
            Quick Links
          </p>
          <div className="flex flex-col gap-2.5">
            <a
              href="#home"
              className="text-left text-sm text-white/55 hover:text-white transition-colors w-fit font-medium"
            >
              Home
            </a>
            <a
              href="#tickets"
              className="text-left text-sm text-white/55 hover:text-white transition-colors w-fit font-medium"
            >
              All Tickets
            </a>
            <a
              href="#contact"
              className="text-left text-sm text-white/55 hover:text-white transition-colors w-fit font-medium"
            >
              Contact Us
            </a>
            <a
              href="#about"
              className="text-left text-sm text-white/55 hover:text-white transition-colors w-fit font-medium"
            >
              About Us
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold text-xs text-white/40 mb-5 uppercase tracking-[0.15em]">
            Contact Info
          </p>
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5 text-sm text-white/55">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/30"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              support@TravelHub.com.bd
            </div>
            <div className="flex items-center gap-2.5 text-sm text-white/55">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/30"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +880 1700-000000
            </div>
            <div className="flex items-center gap-2.5 text-sm text-white/55">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/30"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              fb.com/TravelHub
            </div>
          </div>
        </div>

        <div>
          <p className="font-bold text-xs text-white/40 mb-5 uppercase tracking-[0.15em]">
            Secure Payment
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-white/55">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/30"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              Stripe Secure Checkout
            </div>

            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                Visa
              </div>
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                MC
              </div>
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                bKash
              </div>
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                Nagad
              </div>
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                DBBL
              </div>
              <div className="bg-white/8 rounded-lg py-1.5 text-[10px] text-center font-bold text-white/50 tracking-wide">
                BRAC
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              256-bit SSL encrypted
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            &copy; 2025 TravelHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
