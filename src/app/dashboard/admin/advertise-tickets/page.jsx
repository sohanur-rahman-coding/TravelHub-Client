

import Advertisetable from "@/components/Dashboard/Advertisetable";
import { getAllTicketsForAdmin } from "@/lib/actions/manageUser";

export default async function AdvertiseTicketsPage() {
  const tickets = await getAllTicketsForAdmin();
  const approvedTickets = tickets.filter(t => t.verificationStatus === "approved");
  // console.log("Approved tickets for advertising:", approvedTickets);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Advertise Tickets</h2>
      <p className="text-sm text-default-500 mb-4">
        Manage and advertise admin-approved tickets on the homepage.
      </p>
      <Advertisetable ticketsData={approvedTickets} />
    </div>
  );
}