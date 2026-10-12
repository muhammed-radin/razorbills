import axios from "axios";
import { decrypt, decryptObj, encrypt, decryptField } from "./crypt";

const getAuthClient = async () =>
  (await import("@/lib/auth-client")).authClient;

const apiBase = import.meta.env.VITE_API_ENDPOINT;
const ACTION_HEADER = {
  "server-api-key": import.meta.env.VITE_SERVER_API_KEY,
  "actions-api-key": import.meta.env.VITE_ACTION_ACESS_TOKEN,
};

const API_KEY_HEADER = {
  "server-api-key": import.meta.env.VITE_SERVER_API_KEY,
};

axios.defaults.headers.common["server-api-key"] =
  import.meta.env.VITE_SERVER_API_KEY;
axios.defaults.headers.common["actions-api-key"] =
  import.meta.env.VITE_ACTION_ACESS_TOKEN;

const api = {
  API_KEY_HEADER,
  ACTION_HEADER,
  client: new axios.create({
    baseURL: apiBase,
    headers: ACTION_HEADER,
    withCredentials: true, // Ensure cookies are sent with requests
  }),
  enableDecryption: true,
  enableEncryption: true,
  base(path = "") {
    // THIS FUNCTION USED FOR RECOVER OLD VERSIONS OF API CALLS, NEW ONES SHOULD USE api.client DIRECTLY
    // TO Prevent any issues with the base URL, we can ensure it always ends with a slash
    // if (!apiBase.endsWith("/")) {
    //   apiBase += "/";
    // }
    return path;
  },
  categories(id) {
    if (id) {
      return api.base("/api/categories/" + id);
    }
    return api.base("/api/categories");
  },
  products(id) {
    if (id) {
      return api.base("/api/products/" + id);
    }
    return api.base("/api/products");
  },
  auth() {
    return api.base("/api/auth");
  },
  cart(path = "") {
    return api.base("/api/cart" + (path ? `/${path}` : ""));
  },
  wishlists() {
    return api.base("/api/wishlists");
  },
  address(path = "") {
    return api.base("/api/address" + (path ? `/${path}` : ""));
  },
  orders(path = "") {
    return api.base("/api/orders" + (path ? `/${path}` : ""));
  },
  comments(productId = "") {
    return api.base("/api/comments" + (productId ? `/${productId}` : ""));
  },
  interactions(path = "") {
    return api.base("/api/interactions" + (path ? `/${path}` : ""));
  },
  users(path = "") {
    return api.base("/api/users" + (path ? `/${path}` : ""));
  },
  settings() {
    return api.base("/api/users/settings");
  },
  async getUser(decryptData = true, fullData = false) {
    const authClient = await getAuthClient();
    const { data: session } = await authClient.getSession();
    if (!session || !session.user) {
      return null;
    }
    let userData = session.user;
    if (fullData) {
      const response = await api.client.get("/api/users/profile/");
      userData = response.data;
    }
    if (decryptData) {
      userData = decryptObj(userData, false, ["emailVerified"]);
    }
    // Names are end-to-end encrypted at rest; always present decrypted.
    if (userData && typeof userData.name === "string") {
      userData = { ...userData, name: decryptField(userData.name) };
    }
    userData.session = session;
    return userData;
  },
  async getSession() {
    // Session cache with TTL: reuse for 5 minutes so route changes
    // don't hammer /api/auth/get-session (and the auth rate limiter).
    const SESSION_TTL_MS = 5 * 60 * 1000;
    try {
      const raw = sessionStorage.getItem("session");
      const at = Number(sessionStorage.getItem("session_at") || 0);
      if (raw && at && Date.now() - at < SESSION_TTL_MS) {
        const session = JSON.parse(decrypt(raw));
        return { ...session, updated: null };
      }
    } catch {
      // Corrupt cache: fall through to a live fetch.
    }
    const authClient = await getAuthClient();
    const live = await authClient.getSession();
    // Names are end-to-end encrypted at rest: present them decrypted to
    // every consumer (navbar, sidebar, greetings). Build a fresh wrapper
    // (never mutate the auth client's internal state) and cache that, so
    // cached and live sessions share one decrypted shape.
    const session =
      live?.data?.user && typeof live.data.user.name === "string"
        ? {
            ...live,
            data: {
              ...live.data,
              user: {
                ...live.data.user,
                name: decryptField(live.data.user.name),
              },
            },
          }
        : live;
    // Cache positive sessions only: caching a null (pre-login) response
    // poisons post-signup state and shows logged-out UI to new users.
    if (session?.data) {
      try {
        sessionStorage.setItem("session", encrypt(JSON.stringify(session)));
        sessionStorage.setItem("session_at", String(Date.now()));
      } catch {
        // Storage full/blocked: session still returned live.
      }
    }
    return { ...session, updated: new Date().toISOString() }; // Add updated timestamp
  },
  actions: {
    async logOut() {
      sessionStorage.clear();
      localStorage.clear();
      const authClient = await getAuthClient();
      return authClient.signOut();
    },
  },
};

export { api };
