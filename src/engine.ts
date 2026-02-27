import i18next from "i18next";
import ICU from "i18next-icu";
import HttpBackend from "i18next-http-backend";
import { I18nEngine } from "./types";

export class I18nextEngine implements I18nEngine {
  async init(config: any) {
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

  t(key: string, options?: any) {
    return i18next.t(key, options);
  }

  async changeLanguage(locale: string) {
    await i18next.changeLanguage(locale);
  }

  getLanguage() {
    return i18next.language;
  }

  async loadNamespaces(ns: string | string[]) {
    // 修复：使用 Promise 版本（兼容类型，避免回调参数错误）
    await new Promise((resolve, reject) => {
      i18next.loadNamespaces(ns, (err) => {
        if (err) reject(err);
        else resolve(void 0);
      });
    });
  }
}
