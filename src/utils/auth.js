import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { alert } from "@/components/dialog-alert-provider";
import { useContext } from "react";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
provider.addScope("email");

const sendVerificationToUnverifiedUser = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No logged-in user found.");
    return;
  }

  try {
    // 1. Grab the unverified email from Google's fallback payload
    const googleProfile = user.providerData.find(
      (p) => p.providerId === "google.com",
    );
    const hiddenEmail = googleProfile?.email;

    if (!hiddenEmail) {
      throw new Error(
        "Could not extract any email from the Google OAuth payload.",
      );
    }

    // 2. Safely trigger the verification flow without throwing operation-not-allowed

    await verifyBeforeUpdateEmail(user, hiddenEmail);

    alert.info({
      title: "Verification Email Sent",
      description: `A verification link has been sent to ${hiddenEmail}. Please check your inbox to complete your account setup. \n\n If you don't see it, please check your spam/junk folder.`,
    });
    return true;
  } catch (error) {
    console.error("Error setting up verification:", error);

    if (error.code === "auth/requires-recent-login") {
      alert.error({
        title: "Security Alert",
        description:
          "For security reasons, please log out, sign back in, and try clicking verify immediately.",
      });
    } else {
      alert.error({
        title: "Error",
        description: `Failed: ${error.message}`,
      });
    }

    return false;
  }
};

function clickToGProvider() {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)

        if (user) {
          if (user.emailVerified) {
            // User is verified, resolve the promise with user and token
            resolve({ user, credential });
          } else {
            // 1. Alert the user they must verify their email
            alert.info({
              title: "Email not verified",
              description:
                "Please verify your email address before logging in.",
              buttonText: "Continue",
              onClose: () => {
                reject({
                  errorCode: "email-not-verified",
                  errorMessage:
                    "User email not verified. Please verify your email address before logging in.",
                });

                alert
                  .confirm({
                    title: "Send verification email?",
                    description:
                      "Would you like us to send a verification email to your inbox?",
                    buttonText: "Send Email",
                    secondaryButtonText: "Cancel",
                  })
                  .then((confirmed) => {
                    // 2. Trigger a Firebase verification email to their inbox
                    if (confirmed) {
                      sendVerificationToUnverifiedUser(user)
                        .then(() => {})
                        .catch((err) =>
                          console.error("Error sending verification:", err),
                        );
                    } else {
                      reject({
                        errorCode: "email-not-verified",
                        errorMessage: "User email not verified.",
                      });
                    }
                  });
              },
            });
          }
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        reject({ errorCode, errorMessage, email, credential });
      });
  });
}

export { clickToGProvider, app, getAuth };
