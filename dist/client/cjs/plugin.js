class PluginSystem {
    constructor() {
        this.plugins = [];
    }
    use(plugin) {
        this.plugins.push(plugin);
    }
    apply(core) {
        this.plugins.forEach((p) => p.setup(core));
    }
}

export { PluginSystem };
//# sourceMappingURL=plugin.js.map
