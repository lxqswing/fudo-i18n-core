import { I18nConfig } from "./types";
import { I18nextEngine } from "./engine";
import { EventEmitter } from "./events";
import { ResourceManager } from "./resource";
import { resolveNamespace } from "./resolver";
import { Lifecycle } from "./lifecycle";
import { PluginSystem } from "./plugin";

export class I18nCore {
  private engine = new I18nextEngine();
  private emitter = new EventEmitter();
  private resources = new ResourceManager();
  private lifecycle = new Lifecycle();
  private plugins = new PluginSystem();
  private config!: I18nConfig;

  async init(config: I18nConfig) {
    if (this.lifecycle.isInitialized()) return;

    this.config = config;

    await this.engine.init({
      lng: config.defaultLocale,
      fallbackLng: config.defaultLocale,
      supportedLngs: config.supportedLocales,
      ns: config.namespaces || ["common"],
      defaultNS: config.namespaces?.[0] || "common",
      preload: config.preload,
      backend: config.backend,
    });

    this.lifecycle.markInitialized();
    this.plugins.apply(this);
    this.emitter.emit("ready");
  }

  t(key: string, options?: any) {
    return this.engine.t(key, options);
  }

  async setLocale(locale: string) {
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

  async loadNamespace(ns: string) {
    if (this.resources.isLoaded(ns)) return;

    await this.engine.loadNamespaces(ns);
    this.resources.markLoaded(ns);
    this.emitter.emit("namespaceLoaded", ns);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.emitter.off(event, callback);
  }

  use(plugin: any) {
    this.plugins.use(plugin);
  }
}
