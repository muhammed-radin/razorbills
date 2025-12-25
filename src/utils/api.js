import axios from "axios";
import { decrypt, decryptStrict } from "./crypt";

const apiBase = import.meta.env.VITE_API_ENDPOINT;
const api = {
  base(path = "") {
    let base = apiBase + path;
    return base;
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
  getUser() {
    let userData = localStorage.getItem("user_data");

    if (userData) {
      let data = JSON.parse(decrypt(userData));
      return data;
    }
    return null;
  },
  actions: {
    logOut() {
      let user = api.getUser();
      return new Promise((resolve, reject) => {
        axios.post(api.base("/api/auth/logout"), {
          email: user ? user.email : null,
        }).then((response) => {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      })
    }
  }
};

export { api };
