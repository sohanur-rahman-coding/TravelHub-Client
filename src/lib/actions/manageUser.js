"use server";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: status }),
    });
    
    if (!res.ok) throw new Error("Update failed");
    
    revalidatePath("/dashboard/admin/manage-tickets");
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getAllTicketsForAdmin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/tickets`, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (error) {
    return [];
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) throw new Error("Update failed");

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const markVendorAsFraud = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/fraud`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Marking fraud failed");

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    throw error;
  }
};