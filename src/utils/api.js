import axios from "axios";
import { decryptObj } from "./crypt";
import { authClient } from "@/lib/auth-client";

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
  async getUser(decryptData = true) {
    const { data: session } = await authClient.getSession();
    if (!session || !session.user) {
      return null;
    }
    let userData = session.user;
    if (decryptData) {
      userData = decryptObj(userData, false, ["emailVerified"]);
    }
    userData.session = session;
    return userData;
  },
  actions: {
    logOut() {
      return authClient.signOut();
    },
  },
};

export { api };
