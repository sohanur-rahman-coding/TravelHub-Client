"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bars, ChartColumn, Person, Ticket, Plus } from "@gravity-ui/icons";
import { ClipboardListIcon, Users2, Layers, History, Bus, Home, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "user";
  const isBanned = user?.isFraud;

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const dashboardItems = {
    user: [
      { icon: Person, label: "User Profile", link: "/dashboard" },
      { icon: Ticket, label: "My Booked Tickets", link: "/dashboard/user/my-booked-tickets" },
      { icon: History, label: "Transaction History", link: "/dashboard/user/transaction-history" },
    ],
    vendor: [
      { icon: Person, label: "Vendor Profile", link: "/dashboard" },
      ...(!isBanned
        ? [{ icon: Plus, label: "Add Ticket", link: "/dashboard/vendor/add-ticket" }]
        : []),
      { icon: Ticket, label: "My Added Tickets", link: "/dashboard/vendor/my-tickets" },
      { icon: ClipboardListIcon, label: "Requested Bookings", link: "/dashboard/vendor/requested-bookings" },
      { icon: ChartColumn, label: "Revenue Overview", link: "/dashboard/vendor/revenue-overview" },
    ],
    admin: [
      { icon: Person, label: "Admin Profile", link: "/dashboard" },
      { icon: Layers, label: "Manage Tickets", link: "/dashboard/admin/manage-tickets" },
      { icon: Users2, label: "Manage Users", link: "/dashboard/admin/manage-users" },
      { icon: ChartColumn, label: "Feature Tickets", link: "/dashboard/admin/featured-tickets" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  const isLinkActive = (itemLink, index) => {
    if (pathname === itemLink) return true;
    if (
      (pathname === "/dashboard" || pathname === `/dashboard/${role}`) &&
      index === 0
    )
      return true;
    return false;
  };

  const NavContent = ({ onLinkClick }) => (
    <nav className="flex flex-col justify-between flex-1 p-4 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        {navItems.map((item, index) => {
          const isActive = isLinkActive(item.link, index);
          return (
            <Link
              key={item.label}
              href={item.link}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 w-full ${
                isActive
                  ? "bg-[#0B3977] text-white shadow-md shadow-blue-900/20"
                  : "text-foreground hover:bg-default"
              }`}
            >
              <item.icon
                className={`size-5 shrink-0 ${isActive ? "text-white" : "text-muted-foreground"}`}
              />
              {item.label}
            </Link>
          );
        })}

        {isBanned && role === "vendor" && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 rounded-xl">
            <p className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
              Account restricted due to fraudulent activity. Ticket addition
              is disabled.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 mb-4">
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </nav>
  );

  const LogoBar = () => (
    <div className="flex items-center h-20 px-6 border-b border-zinc-300 dark:border-zinc-800 w-full shrink-0">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
          <Bus className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-foreground">
          TravelHub
        </span>
      </Link>
    </div>
  );

  return (
    <>
      {/* ── Mobile Hamburger Button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden m-4 p-2.5 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-2 text-sm font-semibold text-foreground hover:bg-default transition-colors"
      >
        <Bars className="w-5 h-5" />
        <span>Menu</span>
      </button>

      {/* ── Mobile Slide-In Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 z-50 flex flex-col w-[280px] h-screen bg-background border-r border-zinc-300 dark:border-zinc-800 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-6 h-20 border-b border-zinc-300 dark:border-zinc-800 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-foreground">
                    TravelHub
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="p-2 rounded-xl text-foreground/70 hover:bg-default transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavContent onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Static Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 border-r border-zinc-300 dark:border-zinc-800 bg-background">
        <LogoBar />
        <NavContent onLinkClick={() => {}} />
      </aside>
    </>
  );
}