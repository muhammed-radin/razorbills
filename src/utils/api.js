const apiBase = import.meta.env.VITE_API_ENDPOINT;
const api = {
  base(path = "") {
    let base = apiBase+path;
    return base;
  }
};

export { api };
