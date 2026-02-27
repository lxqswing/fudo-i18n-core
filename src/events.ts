type Listener = (...args: any[]) => void;

export class EventEmitter {
  private events: Record<string, Listener[]> = {};

  on(event: string, callback: Listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  off(event: string, callback: Listener) {
    this.events[event] = this.events[event]?.filter((fn) => fn !== callback);
  }

  once(event: string, callback: Listener) {
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  emit(event: string, ...args: any[]) {
    this.events[event]?.forEach((fn) => fn(...args));
  }
}
