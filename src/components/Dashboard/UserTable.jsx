"use client";

import { useState, useMemo, useEffect } from "react";
import { Table, Button, Chip, TableRow } from "@heroui/react";
import { updateUserRole, markVendorAsFraud } from "@/lib/actions/manageUser";
import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const ROLE_FILTERS = ["all", "user", "vendor", "admin"];

export default function UserTable({ usersData }) {
  const [userOverrides, setUserOverrides] = useState({});
  const [loadingAction, setLoadingAction] = useState({ id: null, action: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = useMemo(() => {
    return (usersData || []).map((u) => ({
      ...u,
      ...(userOverrides[u._id] || {}),
    }));
  }, [usersData, userOverrides]);

  const handleRole = async (id, role) => {
    setLoadingAction({ id, action: role });
    try {
      await updateUserRole(id, role);
      setUserOverrides((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), role },
      }));
      toast.success(`User role updated to ${role}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role");
    } finally {
      setLoadingAction({ id: null, action: null });
    }
  };

  const handleFraud = async (id) => {
    setLoadingAction({ id, action: "fraud" });
    try {
      await markVendorAsFraud(id);
      setUserOverrides((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), isFraud: true },
      }));
      toast.success("Vendor marked as fraud!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark vendor as fraud");
    } finally {
      setLoadingAction({ id: null, action: null });
    }
  };

  // Filter + search client-side
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (users || []).filter((user) => {
      const matchesRole =
        roleFilter === "all" || (user.role || "user") === roleFilter;
      const matchesSearch =
        !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div className="mt-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {ROLE_FILTERS.map((r) => {
            const count =
              r === "all"
                ? users?.length ?? 0
                : (users || []).filter((u) => (u.role || "user") === r).length;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  roleFilter === r
                    ? "bg-[#0B3977] text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {r} {count > 0 && <span className="opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-3">
        Showing {filteredUsers.length} of {users?.length ?? 0} users
      </p>

      <Table className="mt-2">
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Manage Users Table"
            className="min-w-[800px]"
          >
            <Table.Header>
              <Table.Column isRowHeader>#</Table.Column>
              <Table.Column>User Info</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Actions</Table.Column>
            </Table.Header>

            <Table.Body emptyContent={
              <div className="py-12 flex flex-col items-center gap-2 text-slate-400">
                <Search size={28} className="opacity-40" />
                <p className="text-sm font-bold">No users match your search</p>
                <button
                  onClick={() => { setSearchQuery(""); setRoleFilter("all"); }}
                  className="text-xs text-blue-500 font-bold hover:underline mt-1"
                >
                  Clear filters
                </button>
              </div>
            }>
              {filteredUsers.map((user, index) => {
                const isAdmin = user.role === "admin";
                const isVendor = user.role === "vendor" || user.role === "seller";

                return (
                  <TableRow key={user._id}>
                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{user.name}</span>
                          <span className="text-xs text-default-500">{user.email}</span>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex flex-col items-start gap-1">
                        <Chip
                          size="sm"
                          className={`capitalize text-white font-bold border-none ${
                            isAdmin
                              ? "bg-purple-600"
                              : isVendor
                              ? "bg-blue-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {user.role || "user"}
                        </Chip>
                        {user.isFraud && (
                          <Chip
                            size="sm"
                            className="bg-red-600 text-white font-bold border-none"
                          >
                            Fraud
                          </Chip>
                        )}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="font-bold text-white bg-purple-600 disabled:bg-purple-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                          onClick={() => handleRole(user._id, "admin")}
                          isDisabled={isAdmin || loadingAction.id === user._id}
                          isLoading={loadingAction.id === user._id && loadingAction.action === "admin"}
                        >
                          Make Admin
                        </Button>

                        <Button
                          size="sm"
                          className="font-bold text-white bg-blue-600 disabled:bg-blue-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                          onClick={() => handleRole(user._id, "vendor")}
                          isDisabled={isVendor || loadingAction.id === user._id}
                          isLoading={loadingAction.id === user._id && loadingAction.action === "vendor"}
                        >
                          Make Vendor
                        </Button>

                        {isVendor && (
                          <Button
                            size="sm"
                            className="font-bold text-white bg-red-600 disabled:bg-red-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                            onClick={() => handleFraud(user._id)}
                            isDisabled={user.isFraud || loadingAction.id === user._id}
                            isLoading={loadingAction.id === user._id && loadingAction.action === "fraud"}
                          >
                            {user.isFraud ? "Marked as Fraud" : "Mark as Fraud"}
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </TableRow>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}