"use server";

import { revalidatePath } from "next/cache";

const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export async function addTicketAction(ticketData) {
  try {
    const response = await fetch(`${BASE_URL}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add ticket");
    }
    return data;
  } catch (error) {
    console.error("Error adding ticket:", error);
    throw new Error("Failed to add ticket");
  }
}

export const updateTicket = async (ticketData) => {
  try {
    const { _id, ...bodyData } = ticketData;

    if (!_id) {
      throw new Error("Ticket ID missing");
    }

    const response = await fetch(`${BASE_URL}/api/tickets/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update ticket");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in updateTicketAction:", error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete ticket");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in deleteTicketAction:", error);
    throw error;
  }
};

export const toggleAdvertiseTicket = async (ticketId, currentState) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/advertise`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ advertise: !currentState }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update advertisement");
    }

    revalidatePath("/dashboard/admin/advertise-tickets");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
