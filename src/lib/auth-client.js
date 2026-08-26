import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_ENDPOINT,

  fetchOptions: {
    credentials: "include", // Ensure cookies are sent with requests
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
