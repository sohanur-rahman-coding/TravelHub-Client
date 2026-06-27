"use server";
import { revalidatePath } from "next/cache";
import { authClient } from "../auth-client";
import { getTokenServer } from "../getTokenServer";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// approved or reject ,, admin (done)
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const token = await getTokenServer();
    const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verificationStatus: status }),
    });

    if (!res.ok) throw new Error("Update failed");

    revalidatePath("/dashboard/admin/manage-tickets");
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export async function getAllTicketsForAdmin() {
  try {
    const BASE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    const response = await fetch(`${BASE_URL}/api/tickets?limit=1000`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch tickets for admin");

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tickets");
  }
}
// update role for admin (done)
export const updateUserRole = async (userId, role) => {
  try {
     const token = await getTokenServer()
    const res = await fetch(`${BASE_URL}/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) throw new Error("Update failed");

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    throw error;
  }
};
// mark as a fraud by admin (done)
export const markVendorAsFraud = async (userId) => {
  try {
     const token = await getTokenServer()
    const res = await fetch(`${BASE_URL}/api/users/${userId}/fraud`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Marking fraud failed");

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export async function updateProfileAPI(email, updateData) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/user/${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
}
