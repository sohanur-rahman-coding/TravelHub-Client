import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenServer = async () => {
  try {
    const { token } = await auth.api.getToken({
      headers: await headers(),
    });
    return token || null;
  } catch (error) {
    console.error("Error getting token on server:", error);
    return null;
  }
};
