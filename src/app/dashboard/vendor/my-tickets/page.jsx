import Card from "@/components/Card";
import TicketCardVendor from "@/components/Dashboard/TicketCardVendor";
import { getUserSession } from "@/lib/api/Session";
import { getAddedTicketsByVendor } from "@/lib/api/tickets";
import { authClient } from "@/lib/auth-client";
import React from "react";

const myTickets = async () => {
  const session = await getUserSession();
  const tickets = await getAddedTicketsByVendor(session.email);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Added Tickets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets &&
          tickets.map((singleTicket) => (
            <TicketCardVendor key={singleTicket._id} ticket={singleTicket} />
          ))}
      </div>
    </div>
  );
};

export default myTickets;