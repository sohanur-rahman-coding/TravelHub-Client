import UserTable from "@/components/Dashboard/UserTable";
import { getAllUsersForAdmin } from "@/lib/api/Session";

export const dynamic = "force-dynamic";

export default async function ManageUsersPage() {
  const data = await getAllUsersForAdmin();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Manage Users</h2>
      <p className="text-sm text-default-500 mb-6">
        View all users, change their roles, or mark vendors as fraud.
      </p>

      <UserTable usersData={data} />
    </div>
  );
}