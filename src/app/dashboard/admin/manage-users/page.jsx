import React from "react";
import { getAllUsersForAdmin } from "@/lib/actions/manageUser";
import UserTable from "@/components/Dashboard/UserTable";
// import UserTable from "./UserTable";

export default async function ManageUsersPage() {
  const data = await getAllUsersForAdmin();

  const normalizedUsers = (data || []).map((u) => ({
    ...u,
    id: u._id.toString(),
  }));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Manage Users</h2>
      <p className="text-sm text-default-500 mb-6">
        View all users, change their roles, or mark vendors as fraud.
      </p>

      <UserTable usersData={normalizedUsers} />
    </div>
  );
}
