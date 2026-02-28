import i18next from "i18next";
import { createInstance } from "i18next"; // 新增：导入创建实例的方法
import ICU from "i18next-icu";
import HttpBackend from "i18next-http-backend";
import type { I18nEngine } from "./types";

let FsBackend: any;

export class I18nextEngine implements I18nEngine {
  private instance: typeof i18next; // 新增：私有实例，避免全局污染

  constructor() {
    // 修复：每个引擎实例创建独立的 i18next 实例
    this.instance = createInstance();
  }

  async init(config: any) {
    if (typeof window === "undefined") {
      // Node 环境：直接 require fs-backend（最稳定）
      try {
        FsBackend = require("i18next-fs-backend");
        this.instance.use(FsBackend); // 修复：使用私有实例
      } catch (err) {
        throw new Error(
          "Cannot find module 'i18next-fs-backend'. Please install it via npm.",
        );
      }
    } else {
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

  t(key: string, options?: any): string {
    return this.instance.t(key, options) as string; // 修复：使用私有实例
  }

  async changeLanguage(locale: string) {
    await this.instance.changeLanguage(locale); // 修复：使用私有实例
  }

  getLanguage() {
    return this.instance.language; // 修复：使用私有实例
  }

  async loadNamespaces(ns: string | string[]) {
    await new Promise<void>((resolve, reject) => {
      this.instance.loadNamespaces(ns, (err) =>
        err ? reject(err) : resolve(),
      ); // 修复：使用私有实例
    });
  }
}
