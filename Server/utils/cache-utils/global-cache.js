const { useMemory } = require("../memory");

let globalMemory = useMemory(null, "globalMemory").toUpdate(
  async (memory) => {},
);

module.exports = { globalMemory };
