"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { getVendorStats } from "@/lib/api/tickets";
import { motion } from "framer-motion";

export default function RevenueOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalTicketsAdded: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    availableStock: 0,
    revenueData: [],
    pieData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchStats(user.email);
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [user?.email, sessionLoading]);

  const fetchStats = async (email) => {
    try {
      setLoading(true);
      const targetEmail = email || user?.email;
      if (!targetEmail) return;

      const data = await getVendorStats(targetEmail);
      if (data) {
        setStats({
          totalTicketsAdded: data.totalTicketsAdded || 0,
          totalTicketsSold: data.totalTicketsSold || 0,
          totalRevenue: data.totalRevenue || 0,
          availableStock: data.availableStock || 0,
          revenueData: data.revenueData || [],
          pieData: data.pieData && data.pieData.length > 0 ? data.pieData : [
            { name: "Sold Tickets", value: data.totalTicketsSold || 0, fill: "#10b981" },
            { name: "Available Tickets", value: data.availableStock || 0, fill: "#3b82f6" },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="text-amber-500 animate-spin" size={40} />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading revenue &amp; sales metrics...</p>
      </div>
    );
  }

  const safeRevenue = Number(stats?.totalRevenue || 0);
  const safeSold = Number(stats?.totalTicketsSold || 0);
  const safeAdded = Number(stats?.totalTicketsAdded || 0);
  const safeStock = Number(stats?.availableStock || 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 max-w-7xl mx-auto font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Revenue &amp; Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time financial performance and seat occupancy metrics across your routes.
          </p>
        </div>

        <button
          onClick={() => fetchStats(user?.email)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all self-start cursor-pointer"
        >
          Refresh Analytics
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Routes Listed",
            value: safeAdded,
            icon: <Package size={20} />,
            grad: "from-blue-500 to-blue-600",
          },
          {
            label: "Total Tickets Sold",
            value: safeSold,
            icon: <TrendingUp size={20} />,
            grad: "from-emerald-500 to-emerald-600",
          },
          {
            label: "Total Gross Revenue",
            value: `$${safeRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: <DollarSign size={20} />,
            grad: "from-amber-500 to-amber-600",
          },
          {
            label: "Available Seat Inventory",
            value: safeStock.toLocaleString(),
            icon: <Package size={20} />,
            grad: "from-purple-500 to-indigo-600",
          },
        ].map(({ label, value, icon, grad }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08, ease: "easeOut" }}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shrink-0 shadow-md`}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">
                {label}
              </p>
              <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                {value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-900 dark:text-white mb-5">
            Monthly Revenue (USD)
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.revenueData}>
              <defs>
                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />

              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-black text-gray-900 dark:text-white mb-5">
            Ticket Status
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={stats.pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                dataKey="value"
                paddingAngle={5}
              >
                {stats.pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="transparent"
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />

              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-black text-gray-900 dark:text-white mb-5">
          Monthly Bookings
        </h3>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats.revenueData} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#1f2937",
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Bar
              dataKey="bookings"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}