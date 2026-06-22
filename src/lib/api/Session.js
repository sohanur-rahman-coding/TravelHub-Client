import { headers } from "next/headers";
import { auth } from "../auth";
const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) return null;

    const res = await fetch(`${BASE_URL}/api/users`, { cache: "no-store" });

    if (res.ok) {
      const allUsers = await res.json();

      const dbUser = allUsers.find((u) => u.email === session.user.email);

      if (dbUser) {
        return {
          ...session.user,
          isFraud: dbUser.isFraud || false,
        };
      }
    }

    return session.user;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
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
