class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push(listener);

    return this;
  }

  fire(event, ...args) {
    const listeners = this.events.get(event);

    if (!listeners) return false;

    for (const listener of listeners) {
      listener(...args);
    }

    return true;
  }

  off(event, listener) {
    const listeners = this.events.get(event);

    if (!listeners) return this;

    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      this.events.delete(event);
    }

    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };

    return this.on(event, wrapper);
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }

    return this;
  }
}

export default EventEmitter;
