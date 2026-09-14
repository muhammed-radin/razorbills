class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();

    this.maxListeners = options.maxListeners ?? 10;

    // Global event listener
    this.onListen = null;
  }

  // --------------------------------
  // Add listener
  // --------------------------------
  on(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const listeners = this.events.get(event);

    listeners.push({
      listener,
      once: false,
      original: listener,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  // --------------------------------
  // Add one-time listener
  // --------------------------------
  once(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const wrapper = (...args) => {
      this.off(event, listener);
      return listener(...args);
    };

    const listeners = this.events.get(event);

    listeners.push({
      listener: wrapper,
      once: true,
      original: listener,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  // --------------------------------
  // Add listener at beginning
  // --------------------------------
  prependListener(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).unshift({
      listener,
      once: false,
      original: listener,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  // --------------------------------
  // Add one-time listener at beginning
  // --------------------------------
  prependOnceListener(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const wrapper = (...args) => {
      this.off(event, listener);
      return listener(...args);
    };

    this.events.get(event).unshift({
      listener: wrapper,
      once: true,
      original: listener,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  // --------------------------------
  // Emit event
  // --------------------------------
  fire(event, ...data) {
    const timestamp = Date.now();

    // Global listener
    if (typeof this.onListen === "function") {
      this.onListen({
        event,
        data,
        timestamp,
      });
    }

    const listeners = this.events.get(event);

    if (!listeners || listeners.length === 0) {
      return false;
    }

    // Copy prevents problems if listeners
    // modify the event while it is executing.
    for (const entry of [...listeners]) {
      entry.listener(...data);
    }

    return true;
  }

  // --------------------------------
  // Remove listener
  // --------------------------------
  off(event, listener) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return this;
    }

    const index = listeners.findIndex((entry) => entry.original === listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  // --------------------------------
  // Remove all listeners
  // --------------------------------
  removeAllListeners(event) {
    if (event === undefined) {
      this.events.clear();
    } else {
      this.events.delete(event);
    }

    return this;
  }

  // --------------------------------
  // Get listeners
  // --------------------------------
  listeners(event) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return [];
    }

    return listeners.map((entry) => entry.original);
  }

  // --------------------------------
  // Get raw listeners
  // --------------------------------
  rawListeners(event) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return [];
    }

    return listeners.map((entry) => entry.listener);
  }

  // --------------------------------
  // Listener count
  // --------------------------------
  listenerCount(event) {
    return this.events.get(event)?.length ?? 0;
  }

  // --------------------------------
  // Event names
  // --------------------------------
  eventNames() {
    return [...this.events.keys()];
  }

  // --------------------------------
  // Check event
  // --------------------------------
  has(event) {
    return this.events.has(event);
  }

  // --------------------------------
  // Max listeners
  // --------------------------------
  setMaxListeners(number) {
    if (typeof number !== "number" || number < 0 || !Number.isFinite(number)) {
      throw new TypeError("maxListeners must be a non-negative finite number");
    }

    this.maxListeners = number;

    return this;
  }

  getMaxListeners() {
    return this.maxListeners;
  }

  // --------------------------------
  // Internal validation
  // --------------------------------
  #validateListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
  }

  // --------------------------------
  // Internal max listener check
  // --------------------------------
  #checkMaxListeners(event) {
    if (this.maxListeners === 0) {
      return;
    }

    const count = this.listenerCount(event);

    if (count > this.maxListeners) {
      console.warn(
        `Possible EventEmitter memory leak detected. ` +
          `${count} "${String(event)}" listeners added. ` +
          `Maximum is ${this.maxListeners}.`,
      );
    }
  }
}

class ClassicEvent {
  constructor(type, isMajor = false, sector = null, data = null) {
    this.type = type;
    this.timestamp = Date.now();
    this.isMajor = isMajor;
    this.sector = sector;
    this.data = data;
  }
}

export { ClassicEvent };
export default EventEmitter;
