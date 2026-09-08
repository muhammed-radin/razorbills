import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { clickToGProvider } from "../auth";
import { encrypt } from "../crypt";
import { generateHashLink } from "../route-util";

export default function onUserGoogleSignIn() {
  function navigate(path) {
    window.location.href = generateHashLink(path);
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
                    resolveui("Google Sign-Up successful");
                    navigate("/");
                  } else {
                    rejectui("Google Sign-Up failed");
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
              console.warn("Google Sign-Up error:", err);
              rejectui(
                `${err.errorMessage || err.message || err.response?.data?.message || "Unknown error"}`,
              );
            });
        } catch (error) {
          console.error("Google Sign-Up error:", error);
          rejectui(
            `${error.errorMessage || error.message || error.response?.data?.message || "Unknown error"}`,
          );
        }
      }),
    {
      loading: "Signing up...",
      success: (msg) => `${msg}`,
      error: (err) => {
        console.log(err);
        return `Sign-up failed: ${err || err.errorMessage || err.message || err.response?.data?.message || "Unknown error"}`;
      },
    },
  );
}
