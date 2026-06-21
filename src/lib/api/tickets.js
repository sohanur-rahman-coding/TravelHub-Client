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
