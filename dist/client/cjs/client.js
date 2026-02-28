import { I18nCore } from './core.js';

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

export { createI18nInstance, getClientI18n };
//# sourceMappingURL=client.js.map
