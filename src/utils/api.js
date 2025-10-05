const apiBase = import.meta.env.VITE_API_ENDPOINT;
const api = {
  products() {
    let base = apiBase;
    if (import.meta.env.DEV) {
      if (!base.endsWith("/")) {
        base += "/";
      }
      return base + "api/products";
    } else {
      return base;
    }
  },
};

export { api };
