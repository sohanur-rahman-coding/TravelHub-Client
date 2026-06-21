"use client";

import { useState, useEffect, useRef } from "react";
import { Bus, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

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
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              TicketBari
            </span>
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className={`font-semibold text-sm ${isActive("/") ? "text-cyan-500" : "text-foreground/80 hover:text-foreground"}`}>Home</Link>
            <Link href="/tickets" className={`font-semibold text-sm ${isActive("/tickets") ? "text-cyan-500" : "text-foreground/80 hover:text-foreground"}`}>All Tickets</Link>
            {user && (
              <Link href="/dashboard" className={`font-semibold text-sm ${isActive("/dashboard") ? "text-cyan-500" : "text-foreground/80 hover:text-foreground"}`}>Dashboard</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isPending && (!user ? (
              <div className="flex gap-2 items-center">
                <Link href="/signin" className="text-sm font-medium text-foreground/80 hover:text-foreground">Login</Link>
                <Link href="/signup"><Button size="sm" className="rounded-full font-semibold">Register</Button></Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border hover:bg-default-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs overflow-hidden">
                    {user?.image ? (
                      <Image src={user.image} alt={user?.name || "User"} width={32} height={32} />
                    ) : (
                      user?.name?.[0]
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-background border border-default-200 rounded-2xl shadow-xl flex flex-col py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-default-100">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-foreground/60 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2 text-sm hover:bg-default-100 flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="px-4 py-2 text-sm text-danger hover:bg-danger-50 flex items-center gap-2 text-left w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl px-6 py-4 bg-background border border-default-200 rounded-2xl shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold">Home</Link>
          <Link href="/tickets" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold">All Tickets</Link>
          {user && <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold">Dashboard</Link>}
          
          <div className="pt-2 border-t border-default-200 mt-2 space-y-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}><Button size="sm" variant="bordered" className="w-full">Login</Button></Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}><Button size="sm" className="w-full">Register</Button></Link>
              </div>
            ) : (
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left py-2 text-sm text-danger font-semibold">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}