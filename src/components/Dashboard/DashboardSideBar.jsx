"use client";

import { usePathname } from "next/navigation";
import { Bars, ChartColumn, Person, Ticket, Plus } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { ClipboardListIcon, Users2, Layers, History, Bus } from "lucide-react";
import Link from "next/link";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || "user";

  const dashboardItems = {
    user: [
      { icon: Person, label: "User Profile", link: "/dashboard/user/userProfile" },
      { icon: Ticket, label: "My Booked Tickets", link: "/dashboard/user/my-booked-tickets" },
      { icon: History, label: "Transaction History", link: "/dashboard/user/transaction-history" },
    ],
    vendor: [
      { icon: Person, label: "Vendor Profile", link: "/dashboard" },
      { icon: Plus, label: "Add Ticket", link: "/dashboard/vendor/add-ticket" },
      { icon: Ticket, label: "My Added Tickets", link: "/dashboard/vendor/my-tickets" },
      { icon: ClipboardListIcon, label: "Requested Bookings", link: "/dashboard/vendor/requested-bookings" },
      { icon: ChartColumn, label: "Revenue Overview", link: "/dashboard/vendor/revenue-overview" },
    ],
    admin: [
      { icon: Person, label: "Admin Profile", link: "/dashboard" },
      { icon: Layers, label: "Manage Tickets", link: "/dashboard/admin/manage-tickets" },
      { icon: Users2, label: "Manage Users", link: "/dashboard/admin/manage-users" },
      { icon: ChartColumn, label: "Advertise Tickets", link: "/dashboard/admin/advertise-tickets" },
    ],
  };

  const navItems = dashboardItems[role] || [];

  const isLinkActive = (itemLink, index) => {
    if (pathname === itemLink) return true;
    if ((pathname === "/dashboard" || pathname === `/dashboard/${role}`) && index === 0) return true;
    return false;
  };

  return (
    <Drawer>
      <Button className="lg:hidden m-4" variant="secondary">
        <Bars />
        Menu
      </Button>

      <aside className="hidden lg:flex flex-col gap-1 w-[260px] h-screen sticky top-0 border-r border-zinc-300 dark:border-zinc-800 bg-background">
        <div className="flex items-center h-20 px-6 border-b border-zinc-300 dark:border-zinc-300 w-full shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              TicketBari
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4 mt-4">
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
                <item.icon className={`size-5 shrink-0 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-2 pt-4">
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
                      <item.icon className={`size-5 shrink-0 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
} 