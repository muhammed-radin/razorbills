import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { toast } from "sonner";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_ENDPOINT,

  fetchOptions: {
    credentials: "include", // Ensure cookies are sent with requests
    onError: (ctx) => {
      // Check if the response status is a 429 Rate Limit
      if (ctx.response.status === 429) {
        const retryAfter =
          ctx.response.headers.get("X-Retry-After") || "a few seconds";

        toast.error(
          `Too many requests! Please wait ${retryAfter} before trying again.`,
        );
        return;
      } else if (ctx.response.status === 401) {
        if (!ctx.request.url.includes("/sign-in")) {
          toast.error("Unauthorized access! Please log in again to continue.");
        }
        return;
      } else if (ctx.response.status === 403) {
        toast.error(
          "Forbidden! You don't have permission to perform this action.",
        );
        return;
      } else if (ctx.response.status === 404) {
        toast.error(
          "Resource not found! The requested resource does not exist.",
        );
        return;
      } else if (ctx.response.status === 500) {
        toast.error(
          "Internal server error! Please try again later or contact support.",
        );
        return;
      }

      // Handle other errors generically
      toast.error(ctx.error.message || "An unexpected error occurred.");
    },
  },

  plugins: [anonymousClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
