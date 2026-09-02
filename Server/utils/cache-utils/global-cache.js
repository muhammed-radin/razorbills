import { useMemory } from "../memory.js";

export let globalMemory = useMemory(null, "globalMemory").toUpdate(
  async (memory) => {},
);

export default { globalMemory };
