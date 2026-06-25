"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, ChevronDown, MoonStar } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import logo from "../../public/logo.for.nav.png";
import ThemeToggle from "./ThemeToggle";


export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: sessionData, isPending } = authClient.useSession();
  const user = sessionData?.user;

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        onSuccess: () => {
          router.push("/signin");
          toast.success("Signed out successfully");
          router.refresh();
        },
      });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full pt-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto bg-background/70 backdrop-blur-md border border-default-200 shadow-lg rounded-full px-6 py-2 transition-all">
        <div className="flex h-14 items-center justify-between w-full">
          
         
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex justify-center items-center gap-2">
                <div>
                  <Image
                    src={logo}
                    alt={"logo"}
                    className="object-cover"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl sm:text-[34px] font-extrabold tracking-tight leading-none font-sans">
                    <span className="text-[#0F2C41] dark:text-blue-100">Travel</span>
                    <span className="text-[#247EBD] dark:text-blue-400">Hub</span>
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mt-1">
                    Online Ticket Booking
                  </p>
                </div>
              </div>
            </Link>
          </div>

         
          <div className="hidden md:flex flex-1 justify-center gap-8 items-center">
            <Link
              href="/"
              className={`font-semibold text-sm transition-colors ${
                isActive("/") ? "text-cyan-500" : "text-foreground/80 hover:text-cyan-500"
              }`}
            >
              Home
            </Link>
            <Link
              href="/allTickets"
              className={`font-semibold text-sm transition-colors ${
                isActive("/allTickets") ? "text-cyan-500" : "text-foreground/80 hover:text-cyan-500"
              }`}
            >
              All Tickets
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`font-semibold text-sm transition-colors ${
                  isActive("/dashboard") ? "text-cyan-500" : "text-foreground/80 hover:text-cyan-500"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          
          <div className="hidden md:flex flex-1 justify-end items-center gap-4">
            {!isPending &&
              (!user ? (
               
                <div className="flex gap-4 items-center">
                  <ThemeToggle /> 
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    Login
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="rounded-full font-semibold bg-blue-600 text-white">
                      Register
                    </Button>
                  </Link>
                </div>
              ) : (
                // লগ-ইন অবস্থায় থাকা ইউজারদের ভিউ
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-full border border-default-200 hover:bg-default-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user?.name || "User"}
                          width={32}
                          height={32}
                        />
                      ) : (
                        user?.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground/70 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* 🟢 Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-background border border-default-200 rounded-2xl shadow-xl flex flex-col py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-default-100">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-foreground/60 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      
                      {/* 🟢 থিম টগল ড্রপডাউনের ভেতরে */}
                      <div className="px-4 py-2 border-b border-default-100 flex justify-between items-center">
                        <span className="text-sm font-medium flex items-center gap-2">
                           Theme
                        </span>
                        <ThemeToggle />
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="px-4 py-2.5 text-sm font-medium hover:bg-default-100 flex items-center gap-2 mt-1"
                      >
                        <User className="w-4 h-4 text-foreground/70" /> Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger-50 flex items-center gap-2 text-left w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* 🟢 Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl px-6 py-4 bg-background border border-default-200 rounded-2xl shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-cyan-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/allTickets"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-cyan-500 transition-colors"
          >
            All Tickets
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-cyan-500 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* 🟢 Mobile Theme Toggle */}
          <div className="flex justify-between items-center py-2 border-t border-default-200 mt-2">
            <span className="text-sm font-semibold">Dark Mode</span>
            <ThemeToggle />
          </div>

          <div className="pt-2 border-t border-default-200 space-y-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" variant="bordered" className="w-full font-semibold">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full font-semibold bg-blue-600 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex justify-center items-center gap-2 py-2.5 mt-2 bg-danger/10 text-danger rounded-xl text-sm font-semibold hover:bg-danger/20 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}