import { useMemory } from "../memory.js";

export let productMemoryCache = useMemory(null, "productMemoryCache", 60).toUpdate(
  async (memory) => {},
);

export default { productMemoryCache };
