const { useMemory } = require("../memory");

let productMemoryCache = useMemory(null, "productMemoryCache", 60).toUpdate(
  async (memory) => {},
);

module.exports = { productMemoryCache };
