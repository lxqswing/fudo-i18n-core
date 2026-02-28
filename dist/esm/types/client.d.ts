import { I18nCore } from "./core";
export declare function getClientI18n(): I18nCore;
/**
 * SSR/Server 安全版本
 * 每次请求返回独立实例
 */
export declare function createI18nInstance(): I18nCore;
