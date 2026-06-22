"use client";

import { useState } from "react";
import { Table, Button, Chip, TableRow } from "@heroui/react";
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
    <Table className="mt-6">
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

          <Table.Body>
            {usersData?.map((user, index) => {
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
  );
}