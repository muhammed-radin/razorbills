const db = require("./db");

class Memory {
  constructor(data) {
    this._memory = data;
    this.updateFn = () => {};
  }

  set(newData) {
    this._memory = newData;
    return this._memory;
  }

  toUpdate(fn) {
    this.updateFn = fn;
    return this;
  }

  async update(...params) {
    await this.updateFn(this, ...params);
  }

  get() {
    return this._memory;
  }
}

// backward-compatible factory
function useMemory(data) {
  return new Memory(data);
}

module.exports = { Memory, useMemory };
