"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Plane,
  Train,
  Bus,
  Ship,
  ShieldCheck,
  Zap,
  Globe2,
  ChevronRight,
  Lock,
} from "lucide-react";

/* ─── Inline social SVGs (not in this lucide-react version) ── */
const FacebookIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
import logo from "../../public/logo.for.nav.png";

/* ─── Data ─────────────────────────────────────────────── */

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Tickets", href: "/allTickets" },
  { label: "About Us", href: "/#about-us" },
  { label: "Popular Routes", href: "/#popular-routes" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "Reviews", href: "/#reviews" },
];

const TRANSPORT_LINKS = [
  { label: "Bus Tickets", href: "/allTickets?type=bus", icon: <Bus className="w-3.5 h-3.5" /> },
  { label: "Train Tickets", href: "/allTickets?type=train", icon: <Train className="w-3.5 h-3.5" /> },
  { label: "Flight Tickets", href: "/allTickets?type=flight", icon: <Plane className="w-3.5 h-3.5" /> },
  { label: "Launch Tickets", href: "/allTickets?type=launch", icon: <Ship className="w-3.5 h-3.5" /> },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

const PAYMENT_METHODS = [
  { name: "Visa", type: "card" },
  { name: "Mastercard", type: "card" },
  { name: "Amex", type: "card" },
  { name: "Discover", type: "card" },
  { name: "Apple Pay", type: "wallet" },
  { name: "Google Pay", type: "wallet" },
];

const SOCIAL_LINKS = [
  {
    title: "Facebook",
    href: "#",
    icon: <FacebookIcon />,
    color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
  },
  {
    title: "Instagram",
    href: "#",
    icon: <InstagramIcon />,
    color: "hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400",
  },
  {
    title: "X / Twitter",
    href: "#",
    icon: <XIcon />,
    color: "hover:bg-sky-600/20 hover:border-sky-500/40 hover:text-sky-400",
  },
  {
    title: "YouTube",
    href: "#",
    icon: <YoutubeIcon />,
    color: "hover:bg-red-600/20 hover:border-red-500/40 hover:text-red-400",
  },
];

/* ─── Animation Variants ────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Sub-components ─────────────────────────────────────── */

function FooterHeading({ children }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80 mb-5 flex items-center gap-2">
      <span className="inline-block w-4 h-px bg-cyan-500/60" />
      {children}
    </p>
  );
}

function FooterLink({ href, children, icon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-all duration-200 w-fit font-medium"
    >
      {icon && (
        <span className="text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
          {icon}
        </span>
      )}
      <span>{children}</span>
      <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-cyan-400" />
    </Link>
  );
}

/* ─── Main Footer ────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 dark:bg-[#06080f] text-white overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[200px] rounded-full bg-indigo-600/4 blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,179,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12"
      >
        {/* Brand Column */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-sm group-hover:blur-md transition-all duration-300" />
              <Image
                src={logo}
                alt="TravelHub Logo"
                height={44}
                width={44}
                className="relative object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[22px] font-black tracking-tight">
                <span className="text-white">Travel</span>
                <span className="text-cyan-400">Hub</span>
              </span>
              <span className="text-[8px] font-bold text-white/30 tracking-[0.3em] uppercase mt-0.5">
                Online Ticket Booking
              </span>
            </div>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-white/45 leading-relaxed max-w-xs">
            Bangladesh&apos;s most trusted travel platform. Book bus, train, launch &amp; flight
            tickets in seconds — with verified operators and real-time seat availability.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-col gap-2.5">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, text: "256-bit SSL Encrypted & Secure" },
              { icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, text: "Instant e-Ticket with QR Code" },
              { icon: <Globe2 className="w-3.5 h-3.5 text-blue-400" />, text: "50+ Routes Across Bangladesh" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-xs text-white/40 font-medium">
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-2.5 mt-1">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.title}
                href={s.href}
                title={s.title}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-white/40 flex items-center justify-center transition-all duration-200 ${s.color}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <FooterHeading>Quick Links</FooterHeading>
          <div className="flex flex-col gap-3">
            {QUICK_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </div>
        </motion.div>

        {/* Transport Types + Legal */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <FooterHeading>Book By Mode</FooterHeading>
          <div className="flex flex-col gap-3">
            {TRANSPORT_LINKS.map((l) => (
              <FooterLink key={l.label} href={l.href} icon={l.icon}>
                {l.label}
              </FooterLink>
            ))}
          </div>
          <div className="mt-6">
            <FooterHeading>Legal</FooterHeading>
            <div className="flex flex-col gap-3">
              {LEGAL_LINKS.map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact & Payment */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-8">
          {/* Contact */}
          <div>
            <FooterHeading>Get In Touch</FooterHeading>
            <div className="flex flex-col gap-3.5">
              {[
                {
                  icon: <Mail className="w-4 h-4 shrink-0 text-cyan-500/60" />,
                  text: "support@travelhub.com.bd",
                  href: "mailto:support@travelhub.com.bd",
                },
                {
                  icon: <Phone className="w-4 h-4 shrink-0 text-cyan-500/60" />,
                  text: "+880 1700-000000",
                  href: "tel:+8801700000000",
                },
                {
                  icon: <MapPin className="w-4 h-4 shrink-0 text-cyan-500/60" />,
                  text: "Dhaka, Bangladesh",
                  href: "#",
                },
              ].map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-white/45 hover:text-white transition-colors duration-200 group"
                >
                  <span className="group-hover:text-cyan-400 transition-colors">{item.icon}</span>
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          {/* Payment Methods - Powered by Stripe */}
          <div>
            <FooterHeading>Secure Payment</FooterHeading>

            {/* Stripe Badge Header */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/25 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white/70">Powered by</span>
                <span className="text-[#7a73ff] font-extrabold text-sm tracking-tight">stripe</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
              </span>
            </div>

            {/* Supported Cards & Wallets */}
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-lg py-2 px-1 text-[11px] text-center font-bold text-white/50 tracking-wide hover:bg-white/[0.08] hover:text-white/80 hover:border-white/15 transition-all duration-200"
                >
                  {method.name}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/30 mt-2.5 flex items-center gap-1">
              <span>Encrypted &amp; processed via Stripe</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Bottom Bar ────────────────────────────────────────── */}
      <div className="relative border-t border-white/[0.06]">
        {/* Glowing top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white/40 font-semibold">TravelHub</span>. All rights reserved.
            Built with ♥ in Bangladesh.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.slice(0, 2).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] text-white/25 hover:text-white/60 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <span className="text-white/15 text-xs">|</span>
            <span className="text-[11px] text-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500/60" />
              SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
