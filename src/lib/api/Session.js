import { headers } from "next/headers";
import { auth } from "../auth";
const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getAllUsersForAdmin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/users`, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (error) {
    console.error(error);
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


