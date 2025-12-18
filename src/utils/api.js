const apiBase = import.meta.env.VITE_API_ENDPOINT;
const api = {
  products() {
    let base = apiBase;
    return base;
  }
};

export { api };
