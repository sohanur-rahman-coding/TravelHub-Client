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
  X,
  Loader2,
  UploadCloud,
  Lock,
  Ticket,
  Plus,
  ChartColumn,
  ClipboardList,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Phone,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { updateProfileAPI } from "@/lib/actions/manageUser";
import { getVendorStats } from "@/lib/api/tickets";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function VendorDashboardPage({ initialUser }) {
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

  // Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Sync user state from session
  useEffect(() => {
    if (session?.user) {
      setUser((prev) => prev || session.user);
      setFormData({ name: session.user.name || "" });
      setPreviewImage(session.user.image || session.user.profilePicture || null);
    }
  }, [session]);

  // Fetch Vendor Business Stats
  useEffect(() => {
    const email = user?.email || session?.user?.email;
    if (!email) return;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const data = await getVendorStats(email);
        setStats(data);
      } catch (err) {
        console.error("Failed to load vendor stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user?.email, session?.user?.email]);

  const isBanned = user?.isFraud;

  // Handle Logo / Photo Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save Operator Profile Handler
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
        toast.success("Agency profile updated successfully!");
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

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ── Top Operator Welcome & Status Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-2">
            <Building2 size={13} /> Verified Transport Operator Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {user?.name || "Operator"} — Fleet Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your bus, flight, train &amp; launch schedules, booking approvals, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isBanned && (
            <Link
              href="/dashboard/vendor/add-ticket"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={16} /> Add New Route / Ticket
            </Link>
          )}
        </div>
      </motion.div>

      {/* Fraud Alert if restricted */}
      {isBanned && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
          <AlertTriangle size={20} className="shrink-0" />
          <div className="text-xs">
            <strong className="font-bold">Account Restricted:</strong> Your operator permissions are suspended due to verification policy. Adding tickets is disabled. Please contact support.
          </div>
        </div>
      )}

      {/* ── Business KPI Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tickets Listed",
            value: stats ? stats.totalTicketsAdded : "—",
            icon: <Ticket className="w-5 h-5 text-amber-500" />,
            sub: "Active routes & journeys",
          },
          {
            label: "Total Tickets Sold",
            value: stats ? stats.totalTicketsSold : "—",
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            sub: "Passenger seats confirmed",
          },
          {
            label: "Total Gross Revenue",
            value: stats ? `$${Number(stats.totalRevenue || 0).toFixed(2)}` : "—",
            icon: <DollarSign className="w-5 h-5 text-blue-500" />,
            sub: "Processed via Stripe",
          },
          {
            label: "Available Seat Stock",
            value: stats ? stats.pieData?.[1]?.value || 0 : "—",
            icon: <Layers className="w-5 h-5 text-purple-500" />,
            sub: "Remaining inventory",
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

      {/* ── Quick Fleet Action Hub (4 Cards) ── */}
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" /> Operator Action Center
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/vendor/add-ticket"
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/15 hover:shadow-amber-500/30 transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[140px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Plus size={22} />
              </div>
              <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add New Ticket</h3>
              <p className="text-xs text-white/80 mt-0.5">Publish bus, train, flight or launch routes</p>
            </div>
          </Link>

          <Link
            href="/dashboard/vendor/requested-bookings"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[140px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ClipboardList size={20} />
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Booking Requests</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Approve or reject passenger reservations</p>
            </div>
          </Link>

          <Link
            href="/dashboard/vendor/revenue-overview"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[140px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <ChartColumn size={20} />
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Revenue &amp; Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly sales charts &amp; Stripe earnings</p>
            </div>
          </Link>

          <Link
            href="/dashboard/vendor/my-tickets"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[140px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Ticket size={20} />
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">My Added Tickets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Edit fares, departure times &amp; seat counts</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Operator Agency & Account Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Operator Company Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Manage your agency branding, operator name, and business credentials
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit2 size={14} /> Edit Agency Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          {/* Logo Upload (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="relative size-28 rounded-2xl border-4 border-white dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-md mb-3 flex items-center justify-center">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={user?.name || "Operator"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl font-black text-slate-400">
                  {user?.name?.[0]?.toUpperCase() || "V"}
                </span>
              )}

              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer text-white">
                  <UploadCloud size={22} />
                  <span className="text-[10px] font-bold uppercase mt-1">Upload Logo</span>
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

            <h3 className="text-base font-black text-slate-900 dark:text-white">{user?.name}</h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-0.5">
              Verified Operator
            </span>
          </div>

          {/* Details Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Company / Operator Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              ) : (
                <p className="text-sm font-black text-slate-900 dark:text-white">{user?.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Business Email
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {user?.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Operator Role
                </span>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
                  Transport Fleet Vendor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium pt-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Operator license verified with 256-bit SSL encrypted Stripe payout gateway.</span>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || !formData.name?.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {isSaving ? "Saving..." : "Save Agency Profile"}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}