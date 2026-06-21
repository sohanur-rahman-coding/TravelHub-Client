"use server";
const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";
export async function addTicketAction(ticketData) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      },
    );
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
