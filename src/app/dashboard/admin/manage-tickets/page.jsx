import React from "react";
import { getAllTicketsForAdmin } from "@/lib/actions/manageUser";
import TicketTable from "@/components/Dashboard/TicketTable";
// import TicketTable from "./TicketTable";

const ManageTicketsByAdmin = async () => {
  const tickets = await getAllTicketsForAdmin();
  // console.log("Fetched Tickets for Admin:", tickets);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Manage Vendor Tickets</h2>
      <p className="text-gray-500 mb-6">
        Review and approve or reject tickets submitted by vendors.
      </p>

      <TicketTable ticketsData={tickets} />
    </div>
  );
};

export default ManageTicketsByAdmin;
