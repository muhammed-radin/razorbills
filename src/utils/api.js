const apiBase = import.meta.env.VITE_API_ENDPOINT;
const api = {
    products() {
        let base = apiBase;
        if (!base.endsWith('/')) {
            base += '/';
        }
        if (import.meta.env.DEV){
            return base + 'api/products';
        } else {
            return base;
        }
    }
}

export { api };