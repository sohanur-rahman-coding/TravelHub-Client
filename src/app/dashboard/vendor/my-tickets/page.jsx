import Card from "@/components/Card";
import TicketCardVendor from "@/components/Dashboard/TicketCardVendor";
import { getUserSession } from "@/lib/api/Session";
import { getAddedTicketsByVendor } from "@/lib/api/tickets";
import React from "react";

const myTickets = async () => {
  const session = await getUserSession();
  const response = await getAddedTicketsByVendor(session.email);

  
  const ticketsArray = Array.isArray(response) ? response : (response?.tickets || []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Added Tickets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ticketsArray && ticketsArray.length > 0 ? (
          ticketsArray.map((singleTicket) => (
            <TicketCardVendor key={singleTicket._id} ticket={singleTicket} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500 font-bold">
            No tickets found.
          </div>
        )}
      </div>
    </div>
  );
};

export default myTickets;