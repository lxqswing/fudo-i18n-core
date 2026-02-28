class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, callback) {
        if (!this.events[event])
            this.events[event] = [];
        this.events[event].push(callback);
    }
    off(event, callback) {
        var _a;
        this.events[event] = (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.filter((fn) => fn !== callback);
    }
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    emit(event, ...args) {
        var _a;
        (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.forEach((fn) => fn(...args));
    }
}

export { EventEmitter };
//# sourceMappingURL=events.js.map
