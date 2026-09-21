class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();
    this.listenListeners = [];

    this.maxListeners = options.maxListeners ?? 10;
  }

  // ==========================================
  // Event listeners
  // ==========================================

  on(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push({
      listener,
      original: listener,
      once: false,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  once(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const wrapper = (...args) => {
      this.off(event, listener);
      return listener(...args);
    };

    this.events.get(event).push({
      listener: wrapper,
      original: listener,
      once: true,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  prependListener(event, listener) {
    this.#validateListener(listener);

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).unshift({
      listener,
      original: listener,
      once: false,
    });

    this.#checkMaxListeners(event);

    return this;
  }

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
      original: listener,
      once: true,
    });

    this.#checkMaxListeners(event);

    return this;
  }

  // ==========================================
  // Global event listeners
  // ==========================================

  onListen(listener) {
    this.#validateListener(listener);

    this.listenListeners.push({
      listener,
      original: listener,
    });

    return this;
  }

  offListen(listener) {
    const index = this.listenListeners.findIndex(
      (entry) => entry.original === listener,
    );

    if (index !== -1) {
      this.listenListeners.splice(index, 1);
    }

    return this;
  }

  removeAllListenListeners() {
    this.listenListeners = [];

    return this;
  }

  listenListenersList() {
    return this.listenListeners.map((entry) => entry.original);
  }

  listenListenerCount() {
    return this.listenListeners.length;
  }

  // ==========================================
  // Emit
  // ==========================================

  fire(event, ...data) {
    const eventInfo = {
      event,
      data,
      timestamp: Date.now(),
    };

    // --------------------------------------
    // Notify ALL global listeners
    // --------------------------------------

    for (const entry of [...this.listenListeners]) {
      entry.listener(eventInfo);
    }

    // --------------------------------------
    // Notify event-specific listeners
    // --------------------------------------

    const listeners = this.events.get(event);

    if (!listeners || listeners.length === 0) {
      return false;
    }

    for (const entry of [...listeners]) {
      entry.listener(...data);
    }

    return true;
  }

  // ==========================================
  // Remove event listener
  // ==========================================

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

  // ==========================================
  // Remove all event listeners
  // ==========================================

  removeAllListeners(event) {
    if (event === undefined) {
      this.events.clear();
    } else {
      this.events.delete(event);
    }

    return this;
  }

  // ==========================================
  // Information
  // ==========================================

  listeners(event) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return [];
    }

    return listeners.map((entry) => entry.original);
  }

  rawListeners(event) {
    const listeners = this.events.get(event);

    if (!listeners) {
      return [];
    }

    return listeners.map((entry) => entry.listener);
  }

  listenerCount(event) {
    return this.events.get(event)?.length ?? 0;
  }

  eventNames() {
    return [...this.events.keys()];
  }

  has(event) {
    return this.events.has(event);
  }

  // ==========================================
  // Max listeners
  // ==========================================

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

  // ==========================================
  // Internal
  // ==========================================

  #validateListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }
  }

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
  constructor(type, isMajor = false, sector = null, data = null, id = null) {
    this.type = type;
    this.timestamp = Date.now();
    this.isMajor = isMajor;
    this.sector = sector;
    this.data = data;
    this.id = id
      ? id
      : `${type}-${this.timestamp}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

export { ClassicEvent };
export default EventEmitter;
