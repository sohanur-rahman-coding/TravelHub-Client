import Advertisetable from "@/components/Dashboard/Advertisetable";
import { getAllTicketsForAdmin } from "@/lib/actions/manageUser";

export const dynamic = "force-dynamic";

export default async function AdvertiseTicketsPage() {
  const response = await getAllTicketsForAdmin();

  const ticketsArray = Array.isArray(response)
    ? response
    : response?.tickets || [];

  const approvedTickets = ticketsArray.filter(
    (t) => t.verificationStatus === "approved",
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Advertise Tickets
      </h2>
      <p className="text-sm text-default-500 mb-4">
        Manage and advertise admin-approved tickets on the homepage.
      </p>
      <Advertisetable ticketsData={approvedTickets} />
    </div>
  );
}
