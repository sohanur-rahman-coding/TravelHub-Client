import { headers } from "next/headers";
import { auth } from "../auth";
import { getTokenServer } from "../getTokenServer";
import { authClient } from "../auth-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.SERVER_URL ||
  "http://localhost:5000";

export const getUserSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) return null;

    const res = await fetch(
      `${BASE_URL}/api/user/${encodeURIComponent(session.user.email)}`,
      {
        cache: "no-store",
      },
    );

    if (res.ok) {
      const dbUser = await res.json();

      if (dbUser) {
        return {
          ...session.user,
          ...dbUser,
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

// get all user for admin (donee)
export const getAllUsersForAdmin = async () => {
  try {
    const token = await getTokenServer();
    console.log(token, "tok");
    const res = await fetch(`${BASE_URL}/api/users`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fetch failed");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
