import i18next from 'i18next';

class I18nextEngine {
    async init(config) {
        // attach plugins and initialize
        // load optional plugins dynamically to avoid bundlers parsing ESM .d.mts files
        try {
            const pkg = 'i18next-icu';
            const icuMod = await import(pkg);
            const ICU = icuMod && (icuMod.default || icuMod);
            if (ICU)
                i18next.use(ICU);
        }
        catch (e) {
            // plugin not available; continue
        }
        try {
            const pkg2 = 'i18next-http-backend';
            const backendMod = await import(pkg2);
            const HttpBackend = backendMod && (backendMod.default || backendMod);
            if (HttpBackend)
                i18next.use(HttpBackend);
        }
        catch (e) {
            // backend plugin not available; continue
        }
        await i18next.init(config);
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
        if (!this.events[event])
            return;
        if (!callback) {
            delete this.events[event];
            return;
        }
        this.events[event] = this.events[event].filter(fn => fn !== callback);
    }
    emit(event, ...args) {
        var _a;
        (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.forEach(fn => fn(...args));
    }
}

class I18nCore {
    constructor() {
        this.engine = new I18nextEngine();
        this.emitter = new EventEmitter();
        this.initialized = false;
    }
    async init(config) {
        if (this.initialized)
            return;
        this.config = config;
        await this.engine.init({
            lng: config.defaultLocale,
            fallbackLng: config.defaultLocale,
            supportedLngs: config.supportedLocales,
            ns: config.namespaces,
            backend: config.backend,
            interpolation: {
                escapeValue: true
            }
        });
        this.initialized = true;
        this.emitter.emit('ready');
    }
    t(key, options) {
        return this.engine.t(key, options);
    }
    async setLocale(locale) {
        if (!this.config.supportedLocales.includes(locale)) {
            throw new Error(`Unsupported locale: ${locale}`);
        }
        await this.engine.changeLanguage(locale);
        this.emitter.emit('localeChanged', locale);
    }
    getLocale() {
        return this.engine.getLanguage();
    }
    on(event, callback) {
        this.emitter.on(event, callback);
    }
    off(event, callback) {
        this.emitter.off(event, callback);
    }
    async loadLocale(locale) {
        // For engines that support lazy loading, changing language will trigger backend load
        if (!this.config.supportedLocales.includes(locale)) {
            throw new Error(`Unsupported locale: ${locale}`);
        }
        await this.engine.changeLanguage(locale);
    }
}

function createI18n() {
    return new I18nCore();
}

export { I18nCore, createI18n };
