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
  Users2,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Server,
  Activity,
  Database,
  CreditCard,
  Building2,
  CheckCircle,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { updateProfileAPI } from "@/lib/actions/manageUser";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AdminDashboardPage({ initialUser }) {
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

  // Platform Metrics State
  const [adminStats, setAdminStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Sync user state from session
  useEffect(() => {
    if (session?.user) {
      setUser((prev) => prev || session.user);
      setFormData({ name: session.user.name || "" });
      setPreviewImage(session.user.image || session.user.profilePicture || null);
    }
  }, [session]);

  // Fetch Platform-Wide Admin Stats
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoadingStats(true);
        const { data: token } = await authClient.token();
        const res = await fetch(`${BASE_URL}/api/admin/stats`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token?.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAdminStats(data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAdminStats();
  }, []);

  // Handle Photo Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save Admin Profile
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
        toast.success("Super Admin profile updated!");
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
      {/* ── Top Super Admin Status Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-2">
            <ShieldAlert size={13} /> Platform Root Administrator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System Administration &amp; Oversight Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Platform governance, user role authorization, vendor audits, and ticket approval queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
            <Activity size={14} className="animate-pulse" /> Platform Online (200 OK)
          </span>
        </div>
      </motion.div>

      {/* ── Platform-Wide Live KPI Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Registered Users",
            value: adminStats ? adminStats.totalUsers : "—",
            icon: <Users2 className="w-5 h-5 text-blue-500" />,
            sub: "Platform accounts",
          },
          {
            label: "Verified Operators",
            value: adminStats ? adminStats.totalVendors : "—",
            icon: <Building2 className="w-5 h-5 text-amber-500" />,
            sub: "Transport agencies",
          },
          {
            label: "Listed Journeys / Tickets",
            value: adminStats ? adminStats.totalTickets : "—",
            icon: <Ticket className="w-5 h-5 text-purple-500" />,
            sub: "All transport modes",
          },
          {
            label: "Gross Platform Volume",
            value: adminStats ? `$${Number(adminStats.totalPlatformRevenue || 0).toFixed(2)}` : "—",
            icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
            sub: "Total Stripe turnover",
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

      {/* ── Platform Revenue Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <BarChart2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Platform Revenue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Last 6 months · Stripe confirmed payments</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold">
            <TrendingUp size={16} />
            <span>${Number(adminStats?.totalPlatformRevenue || 0).toFixed(2)} total</span>
          </div>
        </div>

        {adminStats?.monthlyRevenue && adminStats.monthlyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={adminStats.monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(148,163,184,0.12)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                  fontWeight: 700,
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#adminRevenueGradient)"
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <BarChart2 size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-bold">No revenue data yet</p>
            <p className="text-xs mt-1">Chart will populate as bookings are paid</p>
          </div>
        )}

        {/* Summary pills */}
        {adminStats && (
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {adminStats.totalBookingsCount} total bookings
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {adminStats.totalTicketsSold} seats sold
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {adminStats.pendingTickets} tickets pending review
              </span>
            </div>
          </div>
        )}
      </motion.div>
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-red-500" /> Platform Governance Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/manage-users"
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[160px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <Users2 size={24} />
              </div>
              <ArrowRight size={20} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Manage Users &amp; Roles</h3>
              <p className="text-xs text-white/80 mt-0.5">Assign Admin/Vendor privileges or flag fraud accounts</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/manage-tickets"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-red-500/40 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[160px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <Layers size={24} />
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Moderate Tickets</h3>
                {adminStats?.pendingTickets > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    {adminStats.pendingTickets} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Approve, reject, or audit operator ticket listings</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/featured-tickets"
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-500/40 shadow-sm transition-all hover:-translate-y-1 flex flex-col justify-between min-h-[160px] group"
          >
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Feature Tickets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Advertise top routes on the TravelHub homepage banner</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Admin Credentials & System Specs Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Admin Personal Profile (6 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm"
        >
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Administrator Credentials</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Root administrative profile &amp; security</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          <div className="py-6 flex flex-col items-center">
            <div className="relative size-24 rounded-full border-4 border-red-500/20 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md mb-3 flex items-center justify-center">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={user?.name || "Admin"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-slate-400">
                  {user?.name?.[0]?.toUpperCase() || "A"}
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
                  Admin Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-center text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{user?.name}</h3>
                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">
                  Super Administrator (Root)
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Mail size={13} /> Admin Email
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{user?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Lock size={13} /> Security Level
              </span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <Check size={12} /> Tier 4 Master Authorization
              </span>
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
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isSaving ? "Saving..." : "Save Admin Profile"}
              </button>
            </div>
          )}
        </motion.div>

        {/* System Architecture Specs (6 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Server size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Platform Architecture</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Core infrastructure status</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { name: "Frontend Framework", val: "Next.js 16 (App Router)", status: "Operational" },
                { name: "Backend API Server", val: "Node.js Express + REST Engine", status: "Port 5000 Active" },
                { name: "Database Engine", val: "MongoDB Atlas Cloud Cluster", status: "Connected" },
                { name: "Payment Gateway", val: "Stripe Checkout & Webhooks", status: "256-bit SSL" },
                { name: "Authentication", val: "Better Auth + Remote JWKS", status: "Secured" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.name}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.val}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle size={13} className="text-emerald-500" />
            <span>All sub-systems healthy with automatic background cron seat-lock cleaner active.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}