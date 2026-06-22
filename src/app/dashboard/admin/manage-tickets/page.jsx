"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  User,
} from "@heroui/react";
import { Check, X, Plane, Train, Bus, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

export default function ManageTicketsTable({ tickets, onStatusChange }) {
  // কোন রো-তে কী অ্যাকশন চলছে তা ট্র্যাক করার স্টেট
  const [loadingAction, setLoadingAction] = useState({ id: null, type: null });

  const handleAction = async (ticketId, status) => {
    setLoadingAction({ id: ticketId, type: status });
    try {
      await onStatusChange(ticketId, status);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "plane": return <Plane className="w-4 h-4 text-blue-500" />;
      case "train": return <Train className="w-4 h-4 text-blue-500" />;
      case "bus": return <Bus className="w-4 h-4 text-blue-500" />;
      default: return <Bus className="w-4 h-4 text-blue-500" />;
    }
  };

  // কলামের ডেটা সুন্দরভাবে রেন্ডার করার জন্য
  const renderCell = React.useCallback((ticket, columnKey) => {
    const cellValue = ticket[columnKey];

    switch (columnKey) {
      case "ticketInfo":
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-foreground line-clamp-1">{ticket.title}</span>
            <div className="flex items-center gap-1.5 text-xs text-default-500">
              {getTransportIcon(ticket.type)}
              <span className="font-semibold capitalize">{ticket.type}</span>
              <span className="mx-1">•</span>
              <span className="font-bold text-blue-600">${ticket.price}</span>
              <span>/ seat</span>
            </div>
          </div>
        );

      case "route":
        return (
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="w-4 h-4 text-default-400 shrink-0" />
            <span className="truncate max-w-[100px]">{ticket.from}</span>
            <ArrowRight className="w-3.5 h-3.5 text-default-400 shrink-0" />
            <span className="truncate max-w-[100px]">{ticket.to}</span>
          </div>
        );

      case "schedule":
        return (
          <div className="flex flex-col gap-1 text-sm text-default-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-default-400" />
              <span>{new Date(ticket.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-default-400" />
              <span>{new Date(ticket.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        );

      case "vendor":
        return (
          <User
            avatarProps={{ radius: "lg", src: `https://ui-avatars.com/api/?name=${ticket.vendorName}&background=random` }}
            description={<span className="truncate max-w-[120px] inline-block">{ticket.vendorEmail}</span>}
            name={ticket.vendorName}
          />
        );

      case "status":
        const statusConfigs = {
          approved: { color: "success", text: "Approved" },
          rejected: { color: "danger", text: "Rejected" },
          pending: { color: "warning", text: "Pending" },
        };
        const config = statusConfigs[ticket.verificationStatus?.toLowerCase()] || statusConfigs.pending;
        
        return (
          <Chip className="capitalize" color={config.color} size="sm" variant="flat">
            <span className="font-bold">{config.text}</span>
          </Chip>
        );

      case "actions":
        const isApproved = ticket.verificationStatus === "approved";
        const isRejected = ticket.verificationStatus === "rejected";
        const isApproving = loadingAction.id === ticket._id && loadingAction.type === "approved";
        const isRejecting = loadingAction.id === ticket._id && loadingAction.type === "rejected";

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="success"
              variant={isApproved ? "flat" : "solid"}
              className={`font-bold text-white ${isApproved && 'opacity-50 cursor-not-allowed'}`}
              startContent={!isApproving && <Check className="w-4 h-4" />}
              isLoading={isApproving}
              isDisabled={isApproved || isRejecting}
              onClick={() => handleAction(ticket._id, "approved")}
            >
              {isApproved ? "Approved" : "Approve"}
            </Button>

            <Button
              size="sm"
              color="danger"
              variant={isRejected ? "flat" : "solid"}
              className={`font-bold ${isRejected && 'opacity-50 cursor-not-allowed'}`}
              startContent={!isRejecting && <X className="w-4 h-4" />}
              isLoading={isRejecting}
              isDisabled={isRejected || isApproving}
              onClick={() => handleAction(ticket._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }, [loadingAction]);

  const columns = [
    { name: "TICKET INFO", uid: "ticketInfo" },
    { name: "ROUTE", uid: "route" },
    { name: "SCHEDULE", uid: "schedule" },
    { name: "VENDOR", uid: "vendor" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  if (!tickets || tickets.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-default-500 font-medium">No tickets found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white p-4 sm:p-6 rounded-[2rem] shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-black text-foreground">Manage All Tickets</h2>
        <p className="text-sm text-default-500 mt-1">Review and manage tickets submitted by vendors.</p>
      </div>

      <Table 
        aria-label="Manage tickets table"
        classNames={{
          wrapper: "p-0 shadow-none bg-transparent overflow-x-auto",
          th: "bg-default-50 text-default-600 font-bold tracking-wider text-xs px-4 py-3",
          td: "px-4 py-4 border-b border-default-100 group-hover:bg-default-50 transition-colors",
        }}
        removeWrapper
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tickets}>
          {(item) => (
            <TableRow key={item._id} className="group">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}