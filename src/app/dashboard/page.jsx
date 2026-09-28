import { getUserSession } from "@/lib/api/Session";
import UserDashboardPage from "./user/page";
import VendorDashboardPage from "./vendor/page";
import AdminDashboardPage from "./admin/page";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-default-500 font-medium">Please login to view your dashboard profile.</p>
      </div>
    );
  }

  const role = user.role?.toLowerCase();

  if (role === "admin") {
    return <AdminDashboardPage initialUser={user} />;
  }

  if (role === "vendor") {
    return <VendorDashboardPage initialUser={user} />;
  }

  return <UserDashboardPage initialUser={user} />;
}