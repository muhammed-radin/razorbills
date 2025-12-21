import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
        // ...
        resolve({ user, token });
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