import i18next from 'i18next';
import ICU from 'i18next-icu';
import HttpBackend from 'i18next-http-backend';

class I18nextEngine {
    async init(config) {
        await i18next
            .use(ICU)
            .use(HttpBackend)
            .init({
            ...config,
            interpolation: {
                escapeValue: false,
            },
        });
    }
    t(key, options) {
        return i18next.t(key, options);
    }
    async changeLanguage(locale) {
        await i18next.changeLanguage(locale);
    }
    getLanguage() {
        return i18next.language;
    }
    async loadNamespaces(ns) {
        // 修复：使用 Promise 版本（兼容类型，避免回调参数错误）
        await new Promise((resolve, reject) => {
            i18next.loadNamespaces(ns, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(void 0);
            });
        });
    }
}

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
        this.events[event] = this.events[event]?.filter((fn) => fn !== callback);
    }
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    emit(event, ...args) {
        this.events[event]?.forEach((fn) => fn(...args));
    }
}

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
}

function resolveNamespace(key) {
    return key.split(".")[0];
}

class Lifecycle {
    constructor() {
        this.initialized = false;
    }
    isInitialized() {
        return this.initialized;
    }
    markInitialized() {
        this.initialized = true;
    }
}

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

class I18nCore {
    constructor() {
        this.engine = new I18nextEngine();
        this.emitter = new EventEmitter();
        this.resources = new ResourceManager();
        this.lifecycle = new Lifecycle();
        this.plugins = new PluginSystem();
    }
    async init(config) {
        if (this.lifecycle.isInitialized())
            return;
        this.config = config;
        await this.engine.init({
            lng: config.defaultLocale,
            fallbackLng: config.defaultLocale,
            supportedLngs: config.supportedLocales,
            ns: config.namespaces,
            preload: config.preload,
            backend: config.backend,
        });
        this.lifecycle.markInitialized();
        this.plugins.apply(this);
        this.emitter.emit("ready");
    }
    t(key, options) {
        const ns = resolveNamespace(key);
        if (!this.resources.isLoaded(ns)) {
            this.loadNamespace(ns);
        }
        return this.engine.t(key, options);
    }
    async setLocale(locale) {
        if (!this.config.supportedLocales.includes(locale)) {
            throw new Error(`Unsupported locale: ${locale}`);
        }
        await this.engine.changeLanguage(locale);
        this.resources.clear();
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

function createI18n() {
    return new I18nCore();
}

export { createI18n };
//# sourceMappingURL=index.esm.js.map
