import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcpDFsKkpD68g1gC5k8o00cudzq_gV2zk",
  authDomain: "razorbills-server.firebaseapp.com",
  projectId: "razorbills-server",
  storageBucket: "razorbills-server.firebasestorage.app",
  messagingSenderId: "405184941818",
  appId: "1:405184941818:web:cc8b1748e54a609eac8343",
  measurementId: "G-0F0QLNGZSS",
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

    alert(
      `A verification link has been sent to ${hiddenEmail}. Please check your inbox to complete your account setup.`,
    );
    alert(
      "Also, please check your spam/junk folder if you don't see it in your inbox.",
    );
    return true;
  } catch (error) {
    console.error("Error setting up verification:", error);

    if (error.code === "auth/requires-recent-login") {
      alert(
        "For security reasons, please log out, sign back in, and try clicking verify immediately.",
      );
    } else {
      alert(`Failed: ${error.message}`);
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
            resolve({ user, token });
          } else {
            // 1. Alert the user they must verify their email
            alert("Please verify your email address before logging in.");

            const confirmed = window.confirm(
              "Would you like us to send a verification email to your inbox?",
            );
            // 2. Trigger a Firebase verification email to their inbox
            if (confirmed) {
              sendVerificationToUnverifiedUser(user)
                .then(() => console.log("Verification email sent!"))
                .catch((err) =>
                  console.error("Error sending verification:", err),
                );
            } else {
              reject({
                errorCode: "email-not-verified",
                errorMessage: "User email not verified.",
              });
            }
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
