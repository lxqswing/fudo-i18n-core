(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('i18next'), require('i18next-icu'), require('i18next-http-backend')) :
    typeof define === 'function' && define.amd ? define(['exports', 'i18next', 'i18next-icu', 'i18next-http-backend'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.I18nCore = {}, global.i18next, global.i18nextICU, global.i18nextHttpBackend));
})(this, (function (exports, i18next, ICU, HttpBackend) { 'use strict';

    let FsBackend;
    class I18nextEngine {
        constructor() {
            // 修复：每个引擎实例创建独立的 i18next 实例
            this.instance = i18next.createInstance();
        }
        async init(config) {
            if (typeof window === "undefined") {
                // Node 环境：直接 require fs-backend（最稳定）
                try {
                    FsBackend = require("i18next-fs-backend");
                    this.instance.use(FsBackend); // 修复：使用私有实例
                }
                catch (err) {
                    throw new Error("Cannot find module 'i18next-fs-backend'. Please install it via npm.");
                }
            }
            else {
                // 浏览器环境使用 http-backend
                this.instance.use(HttpBackend); // 修复：使用私有实例
            }
            // 公共插件：ICU 支持
            this.instance.use(ICU); // 修复：使用私有实例
            await this.instance.init({
                ...config,
                interpolation: {
                    escapeValue: false,
                },
            });
        }
        t(key, options) {
            return this.instance.t(key, options); // 修复：使用私有实例
        }
        async changeLanguage(locale) {
            await this.instance.changeLanguage(locale); // 修复：使用私有实例
        }
        getLanguage() {
            return this.instance.language; // 修复：使用私有实例
        }
        async loadNamespaces(ns) {
            await new Promise((resolve, reject) => {
                this.instance.loadNamespaces(ns, (err) => err ? reject(err) : resolve()); // 修复：使用私有实例
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

    const GLOBAL_KEY = "__FUDO_I18N__";
    function getClientI18n() {
        if (typeof window === "undefined") {
            throw new Error("getClientI18n must run in browser");
        }
        if (!window[GLOBAL_KEY]) {
            window[GLOBAL_KEY] = new I18nCore();
        }
        return window[GLOBAL_KEY];
    }
    /**
     * SSR/Server 安全版本
     * 每次请求返回独立实例
     */
    function createI18nInstance() {
        return new I18nCore();
    }

    // index.ts
    function createI18n() {
        return new I18nCore();
    }

    exports.I18nCore = I18nCore;
    exports.createI18n = createI18n;
    exports.createI18nInstance = createI18nInstance;
    exports.getClientI18n = getClientI18n;

}));
//# sourceMappingURL=index.umd.js.map
