import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { encrypt } from "../crypt";
import { generateHashLink } from "../route-util";

export default function onUserGoogleSignIn(setIsInputDisabled) {
  function navigate(path) {
    window.location.href = generateHashLink(path);
  }

  function setInputDisabledState(state) {
    if (typeof setIsInputDisabled === "function") {
      setIsInputDisabled(state);
    }
  }

  toast.promise(
    () =>
      new Promise((resolveui, rejectui) => {
        try {
          authClient.signIn
            .social({
              provider: "google",
              callbackURL: generateHashLink("/?auth=google&success=true"),
              scopes: ["profile", "email", "openid"],
            })
            .then((response) => {
              sessionStorage.removeItem("session");
            })
            .catch((error) => {
              console.error("Google Sign-In error:", error);
              rejectui(
                `${error.errorMessage || error.message || error.response?.data?.message || "Unknown error"}`,
              );
            });
        } catch (error) {
          console.error("Google Sign-In error:", error);
          rejectui(
            `${error.errorMessage || error.message || error.response?.data?.message || "Unknown error"}`,
          );
        }
      }),
    {
      loading: "Signing in...",
      success: (msg) => {
        setInputDisabledState(false);
        return `${msg}`;
      },
      error: (err) => {
        setInputDisabledState(false);
        return `Sign-in failed: ${err || err.errorMessage || err.message || err.response?.data?.message || "Unknown error"}`;
      },
    },
  );
}
