"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import { updateUserRole, markVendorAsFraud } from "@/lib/actions/manageUser";

export default function UserTable({ usersData }) {
  const [loadingAction, setLoadingAction] = useState({ id: null, action: null });

  const handleRole = async (id, role) => {
    setLoadingAction({ id, action: role });
    try {
      await updateUserRole(id, role);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction({ id: null, action: null });
    }
  };

  const handleFraud = async (id) => {
    setLoadingAction({ id, action: "fraud" });
    try {
      await markVendorAsFraud(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction({ id: null, action: null });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-default-100 shadow-sm overflow-hidden mt-6">
      <Table aria-label="Manage Users Table" removeWrapper className="w-full">
        <TableHeader>
          <TableColumn className="bg-default-50 text-default-600 font-bold">#</TableColumn>
          <TableColumn className="bg-default-50 text-default-600 font-bold">USER INFO</TableColumn>
          <TableColumn className="bg-default-50 text-default-600 font-bold">ROLE</TableColumn>
          <TableColumn className="bg-default-50 text-default-600 font-bold" align="center">ACTIONS</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No users found.">
          {usersData?.map((user, index) => {
            const isVendor = user.role === "vendor" || user.role === "seller";
            const isAdmin = user.role === "admin";
            
            return (
              <TableRow key={user.id} className="border-b border-default-100 last:border-none hover:bg-default-50 transition-colors">
                <TableCell className="py-4 text-default-500 font-medium">
                  {index + 1}
                </TableCell>

                <TableCell className="py-4">
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
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex flex-col items-start gap-1">
                    <Chip
                      size="sm"
                      className={`capitalize text-white font-bold border-none ${
                        isAdmin ? "bg-purple-600" : isVendor ? "bg-blue-600" : "bg-gray-500"
                      }`}
                    >
                      {user.role || "user"}
                    </Chip>
                    {user.isFraud && (
                      <Chip size="sm" className="bg-red-600 text-white font-bold border-none">
                        Fraud
                      </Chip>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      color="secondary"
                      className={`font-semibold ${!isAdmin ? "text-white shadow-sm" : ""}`}
                      variant={isAdmin ? "flat" : "solid"}
                      onClick={() => handleRole(user._id, "admin")}
                      isDisabled={isAdmin || loadingAction.id === user._id}
                      isLoading={loadingAction.id === user._id && loadingAction.action === "admin"}
                    >
                      Make Admin
                    </Button>
                    
                    <Button
                      size="sm"
                      color="primary"
                      className={`font-semibold ${!isVendor ? "text-white shadow-sm" : ""}`}
                      variant={isVendor ? "flat" : "solid"}
                      onClick={() => handleRole(user._id, "vendor")}
                      isDisabled={isVendor || loadingAction.id === user._id}
                      isLoading={loadingAction.id === user._id && loadingAction.action === "vendor"}
                    >
                      Make Vendor
                    </Button>

                    {isVendor && (
                      <Button
                        size="sm"
                        color="danger"
                        className={`font-semibold ${!user.isFraud ? "text-white shadow-sm" : ""}`}
                        variant={user.isFraud ? "flat" : "solid"}
                        onClick={() => handleFraud(user._id)}
                        isDisabled={user.isFraud || loadingAction.id === user._id}
                        isLoading={loadingAction.id === user._id && loadingAction.action === "fraud"}
                      >
                        {user.isFraud ? "Marked as Fraud" : "Mark as Fraud"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}