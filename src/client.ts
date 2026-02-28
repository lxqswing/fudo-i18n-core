import { I18nCore } from "./core";

const GLOBAL_KEY = "__FUDO_I18N__";

export function getClientI18n() {
  if (typeof window === "undefined") {
    throw new Error("getClientI18n must run in browser");
  }

  if (!(window as any)[GLOBAL_KEY]) {
    (window as any)[GLOBAL_KEY] = new I18nCore();
  }

  return (window as any)[GLOBAL_KEY] as I18nCore;
}
/**
 * SSR/Server 安全版本
 * 每次请求返回独立实例
 */
export function createI18nInstance() {
  return new I18nCore();
}
