import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_ENDPOINT,

  fetchOptions: {
    credentials: "include", // Ensure cookies are sent with requests
  },

  plugins: [anonymousClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
