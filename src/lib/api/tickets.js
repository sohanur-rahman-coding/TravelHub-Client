const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export async function getAddedTicketsByVendor(vendorEmail) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/tickets?email=${encodeURIComponent(vendorEmail)}`,
    );

    if (!response.ok) throw new Error("Failed to fetch tickets");

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tickets");
  }
}
// get advertisement data

export async function getAdvertisementData() {
  const res = await fetch(`${BASE_URL}/api/tickets/advertised`);
  const data = await res.json();
  return data;
}

// get all approved tickets
export async function getAllApprovedTickets() {
  try {
    const response = await fetch(`${BASE_URL}/api/tickets?status=approved`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch approved tickets");

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch approved tickets");
  }
}
