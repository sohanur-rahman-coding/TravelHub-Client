"use server";

import { revalidatePath } from "next/cache";
import { getTokenServer } from "../getTokenServer";
import { authClient } from "../auth-client";

const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

// add new ticket(done)
export async function addTicketAction(ticketData) {
  try {
    const token = await getTokenServer();
    const response = await fetch(`${BASE_URL}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
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
// update ticket for vendor (done)
export const updateTicket = async (ticketData) => {
  try {
    console.log("---- Server Action Started ----");
    console.log("1. Received Data:", ticketData);

    const { _id, ...bodyData } = ticketData;

    if (!_id) {
      throw new Error("Ticket ID missing");
    }

    const token = await getTokenServer();
    console.log("2. Token retrieved successfully:", !!token);

    const fetchUrl = `${BASE_URL}/api/tickets/${_id}`;
    console.log("3. Calling Backend API:", fetchUrl);

    const response = await fetch(fetchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token?.token || token}`,
      },
      body: JSON.stringify(bodyData),
    });

    console.log("4. Backend Response Status:", response.status);

    // 🟢 যদি ব্যাকএন্ড থেকে এরর আসে, তবে টেক্সট হিসেবে ক্যাচ করা
    if (!response.ok) {
      const errorText = await response.text();
      console.error("5. Backend Error Response:", errorText);
      throw new Error(`Backend Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("6.Success:", result);
    return result;
  } catch (error) {
    console.error(" Next.js Server Action Error:", error);
    throw new Error(error.message || "Failed to update ticket");
  }
};
// delete ticket(done)
export const deleteTicket = async (ticketId) => {
  try {
    const token = await getTokenServer();
    const response = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
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
// advertisement data for admin (done)
export const toggleAdvertiseTicket = async (ticketId, currentState) => {
  try {
    const token = await getTokenServer();
    const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/advertise`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
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

// approve or reject by vendor (done)
export async function updateBookingStatus(bookingId, status) {
  try {
    const token = await getTokenServer();
    console.log(token, "tok");
    const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update booking status");
    return await res.json();
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    throw error;
  }
}

// pay to stripe ( done )
export async function updateBookingToPaid(bookingId) {
  try {
    const token = await getTokenServer();
    console.log(token, "tok");
    const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/pay`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to process payment update");
    return await res.json();
  } catch (error) {
    console.error("Error in updateBookingToPaid:", error);
    throw error;
  }
}
