import { authClient } from "../auth-client";

const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export async function getAddedTicketsByVendor(vendorEmail) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/tickets?email=${encodeURIComponent(vendorEmail)}&limit=1000`,
      { cache: "no-store" },
    );

    if (!response.ok) throw new Error("Failed to fetch tickets");

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tickets");
  }
}
// get advertisement data

export async function getAdvertisementData() {
  try {
    const res = await fetch(`${BASE_URL}/api/tickets/advertised`);
    if (!res.ok) throw new Error("Failed to fetch advertisement data");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getAdvertisementData:", error);
    return [];
  }
}

export async function getAllApprovedTickets(filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append("status", "approved");

    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    if (filters.type && filters.type !== "All")
      params.append("type", filters.type);
    if (filters.sortPrice && filters.sortPrice !== "default")
      params.append("sortPrice", filters.sortPrice);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const BASE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    const response = await fetch(
      `${BASE_URL}/api/tickets?${params.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Failed to fetch approved tickets");

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch approved tickets");
  }
}

//   Vendor: Get all booking requests sent to this vendor (done)
export async function getVendorBookings(email) {
  try {
    if (!email) return [];
     const { data: token } = await authClient.token();

    const res = await fetch(`${BASE_URL}/api/bookings/vendor/${email}`, {
      cache: "no-store",
      headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch vendor bookings");
    return await res.json();
  } catch (error) {
    console.error("Error in getVendorBookings:", error);
    return [];
  }
}
//  get  user booked ticket (done)
export async function getUserBookings(email) {
  try {
    if (!email) return [];
    const { data: token } = await authClient.token();

    const res = await fetch(`${BASE_URL}/api/bookings/user/${email}`, {
      cache: "no-store",
       headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch user bookings");
    return await res.json();
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    return [];
  }
}

// transition(done)
export async function getUserTransactions(email) {
  try {
    if (!email) return [];
     const { data: token } = await authClient.token();

    const res = await fetch(`${BASE_URL}/api/transactions/${email}`, {
      cache: "no-store",
      headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token?.token}`,
        },
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
