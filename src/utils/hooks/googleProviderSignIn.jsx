import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { clickToGProvider } from "../auth";
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
          clickToGProvider()
            .then(({ user, credential }) => {
              // extract uid, displayName, photoURL, email,  from user
              const {
                uid,
                displayName,
                photoURL,
                email,
                accessToken,
                emailVerified,
                idToken,
              } = user;
              // You can now use the user info and token as needed
              // uid encrypted for getting uniqe user id
              let encryptedData = {
                id: encrypt(uid),
                name: encrypt(displayName),
                avatar: encrypt(photoURL),
                email: email,
                provider: "google",
                emailVerified,
              };

              authClient.signIn
                .social({
                  provider: "google",
                  idToken: {
                    token: credential.idToken,
                    accessToken: credential.accessToken,
                  },
                  callbackURL: generateHashLink("/"),
                  additionalData: encryptedData,
                  scopes: ["profile", "email", "openid"],
                })
                .then((response) => {
                  if (
                    response.data &&
                    response.data.user &&
                    response.data.token
                  ) {
                    resolveui("Google Sign-In successful");
                    sessionStorage.removeItem("session"); // Clear any existing session data
                    navigate("/");
                  } else {
                    rejectui("Google Sign-In failed");
                  }
                })
                .catch((error) => {
                  console.error("Google Sign-In error:", error);
                  rejectui(
                    `${error.errorMessage || error.message || error.response?.data?.message || "Unknown error"}`,
                  );
                });
            })
            .catch((err) => {
              console.warn("Google Sign-In error:", err);
              rejectui(
                `${err.errorMessage || err.message || err.response?.data?.message || "Unknown error"}`,
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
