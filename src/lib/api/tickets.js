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

//  ভেন্ডরের রিকোয়েস্টেড বুকিংগুলো আনার ফাংশন
export async function getVendorBookings(email) {
  try {
    if (!email) return [];
    
    const res = await fetch(`${BASE_URL}/api/bookings/vendor/${email}`, {
      cache: "no-store", 
    });

    if (!res.ok) throw new Error("Failed to fetch vendor bookings");
    return await res.json();
  } catch (error) {
    console.error("Error in getVendorBookings:", error);
    return [];
  }
}
//  ইউজারের নিজের বুক করা টিকিটগুলো (Full Details সহ) আনার ফাংশন
export async function getUserBookings(email) {
  try {
    if (!email) return [];

    const res = await fetch(`${BASE_URL}/api/bookings/user/${email}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch user bookings");
    return await res.json();
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return [];
  }
}

// transition 
export async function getUserTransactions(email) {
  try {
    if (!email) return [];

    const res = await fetch(`${BASE_URL}/api/transactions/${email}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch transactions");
    return await res.json();
  } catch (error) {
    return [];
  }
}

// revenue
export async function getVendorStats(email) {
  try {
    if (!email) return null;

    const res = await fetch(`${BASE_URL}/api/vendor/${email}/stats`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch vendor stats");
    return await res.json();
  } catch (error) {
    return null;
  }
}
