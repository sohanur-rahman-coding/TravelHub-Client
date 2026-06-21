import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0f172a] text-slate-300">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block">
              {/* Note: Use a light-colored logo for dark backgrounds */}
              <Image
                src="/logo-xl.png" 
                alt="TravelHub Logo"
                width={180}
                height={50}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Book bus, train, launch & flight tickets easily. Your journey 
              starts with a simple click on our unified booking platform.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[FaFacebook, BsInstagram, BsTwitter, LiaLinkedin].map((Icon, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="rounded-full border border-slate-700 p-2 transition hover:bg-blue-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* More Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              More Info
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="#faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Legals */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legals
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition">Return Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-blue-500" />
                <span>+880 1747744641</span>
              </div>
              <div className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                <span>support@travelhub.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 py-6 text-center text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} TravelHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}