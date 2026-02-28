class ResourceManager {
    constructor() {
        this.loaded = new Set();
    }
    markLoaded(ns) {
        this.loaded.add(ns);
    }
    isLoaded(ns) {
        return this.loaded.has(ns);
    }
    clear() {
        this.loaded.clear();
    }
    getLoadedNamespaces() {
        return Array.from(this.loaded);
    }
}

export { ResourceManager };
//# sourceMappingURL=resource.js.map
