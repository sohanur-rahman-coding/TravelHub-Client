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

export default function RevenueOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalTicketsAdded: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    revenueData: [],
    pieData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await getVendorStats(user.email);
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2
          className="animate-spin text-blue-600 dark:text-blue-400"
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Revenue Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          {
            label: "Total Tickets Added",
            value: stats.totalTicketsAdded,
            icon: <Package size={20} />,
            grad: "from-blue-500 to-blue-600",
          },
          {
            label: "Total Tickets Sold",
            value: stats.totalTicketsSold,
            icon: <TrendingUp size={20} />,
            grad: "from-emerald-500 to-emerald-600",
          },
          {
            label: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign size={20} />,
            grad: "from-amber-500 to-amber-600",
          },
        ].map(({ label, value, icon, grad }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/40 transition-shadow"
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
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
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
                stroke="#374151"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
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
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
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
                  color: "#9ca3af",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-gray-900 dark:text-white mb-5">
          Monthly Bookings
        </h3>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats.revenueData} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
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
      </div>
    </div>
  );
}