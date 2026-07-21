const { db } = require("./db");

class Memory {
  constructor(data) {
    this._memory = data;
    this.isExpired = false;
    this.createdAt = new Date();
    this.expireTime = null;
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

  expireTimeout(timeout) {
    this.expireTime = new Date(Date.now() + timeout);
    setTimeout(() => {
      this.isExpired = true;
      this._memory = null;
    }, timeout);
  }

  async expire() {
    this.isExpired = true;
    this._memory = null;
  }

  sizeMB() {
    // Convert object to a string
    const str = JSON.stringify(this._memory);

    // Get bytes using TextEncoder
    const bytes = new TextEncoder().encode(str).length;

    // Convert bytes to Megabytes
    const mb = bytes / (1024 * 1024);

    return mb;
  }
}

// backward-compatible factory

const CacheTable = {};

function useMemory(data, id, timeout, updateFn) {
  if (id) {
    CacheTable[id] = new Memory(data);
    if (timeout) {
      CacheTable[id].expireTimeout(timeout);
    }
    if (updateFn) {
      CacheTable[id].toUpdate(updateFn);
    }
    return CacheTable[id];
  }
  return new Memory(data);
}

function getMemory(id) {
  return CacheTable[id] || null;
}

function clearMemory(id) {
  if (CacheTable[id]) {
    delete CacheTable[id];
  }
}

function clearAllMemory() {
  for (const id in CacheTable) {
    delete CacheTable[id];
  }
}

function setMemory(id, data) {
  if (CacheTable[id]) {
    CacheTable[id].set(data);
  } else {
    CacheTable[id] = new Memory(data);
  }
}

module.exports = {
  Memory,
  useMemory,
  getMemory,
  clearMemory,
  clearAllMemory,
  setMemory,
  CacheTable,
};
