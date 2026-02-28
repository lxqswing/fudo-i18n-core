import { I18nextEngine } from './engine.js';
import { EventEmitter } from './events.js';
import { ResourceManager } from './resource.js';
import { Lifecycle } from './lifecycle.js';
import { PluginSystem } from './plugin.js';

class I18nCore {
    constructor() {
        this.engine = new I18nextEngine();
        this.emitter = new EventEmitter();
        this.resources = new ResourceManager();
        this.lifecycle = new Lifecycle();
        this.plugins = new PluginSystem();
    }
    async init(config) {
        var _a;
        if (this.lifecycle.isInitialized())
            return;
        this.config = config;
        await this.engine.init({
            lng: config.defaultLocale,
            fallbackLng: config.defaultLocale,
            supportedLngs: config.supportedLocales,
            ns: config.namespaces || ["common"],
            defaultNS: ((_a = config.namespaces) === null || _a === void 0 ? void 0 : _a[0]) || "common",
            preload: config.preload,
            backend: config.backend,
        });
        this.lifecycle.markInitialized();
        this.plugins.apply(this);
        this.emitter.emit("ready");
    }
    t(key, options) {
        return this.engine.t(key, options);
    }
    async setLocale(locale) {
        if (!this.config.supportedLocales.includes(locale)) {
            throw new Error(`Unsupported locale: ${locale}`);
        }
        await this.engine.changeLanguage(locale);
        // 关键：清空已加载标记，让下次 t() 重新加载
        this.resources.clear();
        // 自动重新加载当前已经用过的 namespace（否则不刷新）
        // 修复：给 ResourceManager 添加 getLoadedNamespaces 方法，避免直接访问私有属性
        const loadedNamespaces = this.resources.getLoadedNamespaces();
        for (const ns of loadedNamespaces) {
            await this.loadNamespace(ns);
        }
        this.emitter.emit("localeChanged", locale);
    }
    getLocale() {
        return this.engine.getLanguage();
    }
    async loadNamespace(ns) {
        if (this.resources.isLoaded(ns))
            return;
        await this.engine.loadNamespaces(ns);
        this.resources.markLoaded(ns);
        this.emitter.emit("namespaceLoaded", ns);
    }
    on(event, callback) {
        this.emitter.on(event, callback);
    }
    off(event, callback) {
        this.emitter.off(event, callback);
    }
    use(plugin) {
        this.plugins.use(plugin);
    }
}

export { I18nCore };
//# sourceMappingURL=core.js.map
