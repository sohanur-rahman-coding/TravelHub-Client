"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Mail,
  ShieldCheck,
  User,
  Edit2,
  Check,
  CheckCircle,
  X,
  Loader2,
  UploadCloud,
  Lock,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Download,
  Armchair,
  Plus,
  Trash2,
  Users,
  Sparkles,
  CreditCard,
  Compass,
  Phone,
  Plane,
  Train,
  Bus,
  Ship,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { updateProfileAPI } from "@/lib/actions/manageUser";
import { getUserBookings } from "@/lib/api/tickets";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const STORAGE_KEY_PASSENGERS = "travelhub_saved_passengers";

// Departure Countdown component for the Next Journey Hero
function LiveCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, days: 0, isPast: false });

  useEffect(() => {
    if (!targetDate) return;
    const calculateTime = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, days: 0, isPast: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft({ days, hours, minutes, isPast: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 30000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return <span className="text-red-400 font-bold">Departed</span>;
  }

  return (
    <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-black text-sm">
      <Clock size={14} className="animate-pulse text-cyan-400" />
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      <span>
        {timeLeft.hours}h {timeLeft.minutes}m until departure
      </span>
    </div>
  );
}

export default function UserDashboardPage({ initialUser }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [user, setUser] = useState(initialUser || null);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Bookings & Journey Data State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Saved Passengers State
  const [passengers, setPassengers] = useState([]);
  const [isAddingPassenger, setIsAddingPassenger] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    relationship: "Self",
    phone: "",
    gender: "Male",
    age: "",
    idNumber: "",
  });

  // Sync user state from session
  useEffect(() => {
    if (session?.user) {
      setUser((prev) => prev || session.user);
      setFormData({ name: session.user.name || "" });
      setPreviewImage(session.user.image || session.user.profilePicture || null);
    }
  }, [session]);

  // Load bookings for stats & upcoming trip card
  useEffect(() => {
    const email = user?.email || session?.user?.email;
    if (!email) return;

    const fetchUserTrips = async () => {
      try {
        setLoadingBookings(true);
        const data = await getUserBookings(email);
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUserTrips();
  }, [user?.email, session?.user?.email]);

  // Load saved passengers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PASSENGERS);
      if (saved) {
        setPassengers(JSON.parse(saved));
      } else if (user?.name) {
        const defaultPassenger = [
          {
            id: "self-1",
            name: user.name,
            relationship: "Primary (Self)",
            phone: "+880 1700-000000",
            gender: "Not specified",
            age: "—",
            idNumber: "Verified Account",
          },
        ];
        setPassengers(defaultPassenger);
        localStorage.setItem(STORAGE_KEY_PASSENGERS, JSON.stringify(defaultPassenger));
      }
    } catch (e) {
      console.error(e);
    }
  }, [user?.name]);

  // Save passenger handler
  const handleAddPassenger = (e) => {
    e.preventDefault();
    if (!newPassenger.name.trim()) {
      toast.error("Passenger name is required.");
      return;
    }

    const updated = [
      ...passengers,
      {
        id: `p-${Date.now()}`,
        name: newPassenger.name.trim(),
        relationship: newPassenger.relationship,
        phone: newPassenger.phone.trim() || "N/A",
        gender: newPassenger.gender,
        age: newPassenger.age || "—",
        idNumber: newPassenger.idNumber.trim() || "—",
      },
    ];

    setPassengers(updated);
    localStorage.setItem(STORAGE_KEY_PASSENGERS, JSON.stringify(updated));
    toast.success(`${newPassenger.name} added to Saved Passengers!`);
    setNewPassenger({
      name: "",
      relationship: "Family Member",
      phone: "",
      gender: "Male",
      age: "",
      idNumber: "",
    });
    setIsAddingPassenger(false);
  };

  // Delete passenger handler
  const handleDeletePassenger = (id, name) => {
    const updated = passengers.filter((p) => p.id !== id);
    setPassengers(updated);
    localStorage.setItem(STORAGE_KEY_PASSENGERS, JSON.stringify(updated));
    toast.success(`Removed ${name}`);
  };

  // Find next upcoming trip (status = paid, date >= now)
  const upcomingTrip = bookings
    .filter((b) => b.status === "paid" && b.ticketDetails && new Date(b.ticketDetails.date).getTime() >= Date.now())
    .sort((a, b) => new Date(a.ticketDetails.date) - new Date(b.ticketDetails.date))[0];

  // Stats calculation
  const totalPaidBookings = bookings.filter((b) => b.status === "paid").length;
  const totalSpent = bookings
    .filter((b) => b.status === "paid")
    .reduce((acc, b) => acc + Number(b.totalPrice || 0), 0);
  const rewardPoints = Math.round(totalSpent * 10);

  // Profile picture change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save Profile handler
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      let finalImageUrl = user?.image || user?.profilePicture;

      if (selectedFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", selectedFile);
        const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

        if (imgbbKey) {
          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: "POST",
            body: imgFormData,
          });
          const imgbbData = await imgbbRes.json();
          if (imgbbData.success) {
            finalImageUrl = imgbbData.data.url;
          }
        }
      }

      const updateRes = await updateProfileAPI(user?.email, {
        name: formData.name,
        image: finalImageUrl,
      });

      if (updateRes.success) {
        await authClient.updateUser({
          name: formData.name,
          image: finalImageUrl,
        });

        setUser((prev) => ({ ...prev, name: formData.name, image: finalImageUrl }));
        setIsEditing(false);
        setSelectedFile(null);
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(updateRes.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "plane":
      case "flight":
        return <Plane className="w-5 h-5 text-cyan-400" />;
      case "train":
        return <Train className="w-5 h-5 text-cyan-400" />;
      case "launch":
      case "ship":
        return <Ship className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bus className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ── Top Welcome & Overview Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-2">
            <Sparkles size={12} /> Traveller Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || "Traveller"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your live journeys, fast-fill passenger profiles, and account details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/allTickets"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Compass size={16} /> Book New Ticket
          </Link>
        </div>
      </motion.div>

      {/* ── Stat Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: <Ticket className="w-5 h-5 text-cyan-500" />,
            sub: "All time reservations",
          },
          {
            label: "Confirmed Trips",
            value: totalPaidBookings,
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
            sub: "Paid & verified",
          },
          {
            label: "Total Spending",
            value: `$${totalSpent.toFixed(2)}`,
            icon: <CreditCard className="w-5 h-5 text-blue-500" />,
            sub: "Via Stripe gateway",
          },
          {
            label: "Loyalty Points",
            value: `${rewardPoints} pts`,
            icon: <Sparkles className="w-5 h-5 text-amber-500" />,
            sub: "TravelHub Club",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">{stat.icon}</div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {stat.value}
              </span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {stat.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── SECTION 1: Next Upcoming Journey Live Card (Hero) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 border border-cyan-500/30 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 size-72 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 block">
                  Priority Action • Next Upcoming Journey
                </span>
                <h2 className="text-xl font-black text-white">Live Boarding Pass Status</h2>
              </div>
            </div>

            {upcomingTrip && (
              <LiveCountdown targetDate={upcomingTrip.ticketDetails.date} />
            )}
          </div>

          {loadingBookings ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-cyan-400" size={28} />
              <span className="text-xs text-white/50 font-bold">Checking your journey schedule...</span>
            </div>
          ) : upcomingTrip ? (
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                      {getTransportIcon(upcomingTrip.ticketDetails.type)}
                      {upcomingTrip.ticketDetails.type || "Coach"}
                    </span>
                    <span className="text-xs font-mono font-bold text-white/50">
                      PNR: TH-{upcomingTrip._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {upcomingTrip.ticketDetails.title}
                  </h3>
                </div>

                {/* Route visualization */}
                <div className="flex items-center gap-4 bg-white/[0.04] p-4 rounded-2xl border border-white/10">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 block mb-0.5">
                      Origin Counter
                    </span>
                    <p className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                      <MapPin size={16} className="text-cyan-400 shrink-0" />
                      {upcomingTrip.ticketDetails.from}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <ArrowRight size={20} className="text-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-white/30 uppercase mt-0.5">Direct</span>
                  </div>

                  <div className="flex-1 text-right">
                    <span className="text-[10px] uppercase font-bold text-white/40 block mb-0.5">
                      Destination
                    </span>
                    <p className="text-base sm:text-lg font-black text-white flex items-center justify-end gap-1.5">
                      <MapPin size={16} className="text-cyan-400 shrink-0" />
                      {upcomingTrip.ticketDetails.to}
                    </p>
                  </div>
                </div>

                {/* Departure Time & Seats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">
                      Departure Date
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Calendar size={13} className="text-cyan-400" />
                      {new Date(upcomingTrip.ticketDetails.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">
                      Reporting Time
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Clock size={13} className="text-cyan-400" />
                      {new Date(upcomingTrip.ticketDetails.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-white/40 block">
                      Seat Assignment
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(upcomingTrip.seats) && upcomingTrip.seats.length > 0 ? (
                        upcomingTrip.seats.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-mono font-black text-xs"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-bold text-cyan-300">
                          {upcomingTrip.quantity} Seat(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Stubs */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center bg-white/[0.03] p-5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 text-center">
                  Boarding Pass Access
                </span>

                <Link
                  href="/dashboard/user/my-booked-tickets"
                  className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                  <Download size={15} /> Download PDF Pass
                </Link>

                <Link
                  href="/dashboard/user/my-booked-tickets"
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs text-center border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket size={14} /> View All Ticket Details
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/40 font-medium pt-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> Tamper-Proof QR Verified
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <Compass size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">No Upcoming Journeys Scheduled</h3>
                  <p className="text-xs text-white/50 max-w-md mt-0.5">
                    You have no active upcoming trips. Plan your next adventure across Bangladesh in 1 click!
                  </p>
                </div>
              </div>

              <Link
                href="/allTickets"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs whitespace-nowrap transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
              >
                Browse Tickets <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── SECTION 2 & PROFILE GRID (2 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── SECTION 2: Saved Passengers & Quick-Fill (7 Cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Saved Passenger Profiles
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Fast 1-click checkout profiles for you and frequent co-travellers.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddingPassenger(!isAddingPassenger)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isAddingPassenger ? <X size={14} /> : <Plus size={14} />}
                {isAddingPassenger ? "Close" : "Add Traveller"}
              </button>
            </div>

            {/* Add Passenger Form */}
            <AnimatePresence>
              {isAddingPassenger && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddPassenger}
                  className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    New Passenger Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Khan"
                        value={newPassenger.name}
                        onChange={(e) => setNewPassenger({ ...newPassenger, name: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Relationship
                      </label>
                      <select
                        value={newPassenger.relationship}
                        onChange={(e) =>
                          setNewPassenger({ ...newPassenger, relationship: e.target.value })
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-bold"
                      >
                        <option value="Self">Self (Primary)</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Friend">Friend / Colleague</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+880 1700-000000"
                        value={newPassenger.phone}
                        onChange={(e) => setNewPassenger({ ...newPassenger, phone: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Gender &amp; Age
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={newPassenger.gender}
                          onChange={(e) =>
                            setNewPassenger({ ...newPassenger, gender: e.target.value })
                          }
                          className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-bold"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Age"
                          min="1"
                          max="120"
                          value={newPassenger.age}
                          onChange={(e) =>
                            setNewPassenger({ ...newPassenger, age: e.target.value })
                          }
                          className="w-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPassenger(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-sm"
                    >
                      Save Traveller
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Passenger Cards List */}
            <div className="mt-4 space-y-3">
              {passengers.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-black text-xs flex items-center justify-center shrink-0">
                      {p.name?.[0]?.toUpperCase() || "T"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                          {p.relationship}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone size={11} /> {p.phone}
                        </span>
                        {p.gender && <span>• {p.gender}</span>}
                        {p.age && p.age !== "—" && <span>• {p.age} yrs</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeletePassenger(p.id, p.name)}
                      title="Remove traveller"
                      className="size-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-500" />
            <span>Saved profiles enable instant 1-click booking without re-entering data.</span>
          </div>
        </motion.div>

        {/* ── SECTION 3: Profile & Account Settings (5 Cols) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Account Details</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Your personal information &amp; credentials
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Edit profile"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            {/* Avatar & Info */}
            <div className="py-6 flex flex-col items-center">
              <div className="relative size-24 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md mb-3 flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={user?.name || "User"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-slate-400">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}

                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer text-white">
                    <UploadCloud size={20} />
                    <span className="text-[9px] font-bold uppercase mt-0.5">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {isEditing ? (
                <div className="w-full space-y-2 mt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-center text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{user?.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {user?.email}
                  </span>
                </div>
              )}
            </div>

            {/* Details Rows */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Mail size={13} /> Email Address
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {user?.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck size={13} /> Account Role
                </span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 capitalize">
                  {user?.role || "Traveller"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Lock size={13} /> Security
                </span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <Check size={12} /> 256-Bit SSL Active
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !formData.name?.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}