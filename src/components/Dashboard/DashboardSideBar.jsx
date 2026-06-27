"use client";

import { usePathname } from "next/navigation";
import { Bars, ChartColumn, Person, Ticket, Plus } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { ClipboardListIcon, Users2, Layers, History, Bus, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "user";

  const isBanned = user?.isFraud;

  const dashboardItems = {
    user: [
      {
        icon: Person,
        label: "User Profile",
        link: "/dashboard",
      },
      {
        icon: Ticket,
        label: "My Booked Tickets",
        link: "/dashboard/user/my-booked-tickets",
      },
      {
        icon: History,
        label: "Transaction History",
        link: "/dashboard/user/transaction-history",
      },
    ],
    vendor: [
      { icon: Person, label: "Vendor Profile", link: "/dashboard" },

      ...(!isBanned
        ? [
            {
              icon: Plus,
              label: "Add Ticket",
              link: "/dashboard/vendor/add-ticket",
            },
          ]
        : []),
      {
        icon: Ticket,
        label: "My Added Tickets",
        link: "/dashboard/vendor/my-tickets",
      },
      {
        icon: ClipboardListIcon,
        label: "Requested Bookings",
        link: "/dashboard/vendor/requested-bookings",
      },
      {
        icon: ChartColumn,
        label: "Revenue Overview",
        link: "/dashboard/vendor/revenue-overview",
      },
    ],
    admin: [
      { icon: Person, label: "Admin Profile", link: "/dashboard" },
      {
        icon: Layers,
        label: "Manage Tickets",
        link: "/dashboard/admin/manage-tickets",
      },
      {
        icon: Users2,
        label: "Manage Users",
        link: "/dashboard/admin/manage-users",
      },
      {
        icon: ChartColumn,
        label: "Advertise Tickets",
        link: "/dashboard/admin/advertise-tickets",
      },
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

  return (
    <Drawer>
      <Button className="lg:hidden m-4" variant="secondary">
        <Bars />
        Menu
      </Button>

      <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 border-r border-zinc-300 dark:border-zinc-800 bg-background">
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

        <nav className="flex flex-col justify-between flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive = isLinkActive(item.link, index);
              return (
                <Link
                  key={item.label}
                  href={item.link}
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
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs text-red-600 font-bold leading-relaxed">
                  Account restricted due to fraudulent activity. Ticket addition
                  is disabled.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 mb-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </nav>
      </aside>

      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-col h-full">
              <nav className="flex flex-col justify-between flex-1 pt-4 pb-8">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const isActive = isLinkActive(item.link, index);
                    return (
                      <Link
                        key={item.label}
                        href={item.link}
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
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-xs text-red-600 font-bold leading-relaxed">
                        Account restricted due to fraudulent activity. Ticket
                        addition is disabled.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95"
                  >
                    <Home size={18} />
                    Back to Home
                  </Link>
                </div>
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}