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
      ns: config.namespaces,
      preload: config.preload,
      backend: config.backend,
    });

    this.lifecycle.markInitialized();
    this.plugins.apply(this);
    this.emitter.emit("ready");
  }

  t(key: string, options?: any) {
    const ns = resolveNamespace(key);

    if (!this.resources.isLoaded(ns)) {
      this.loadNamespace(ns);
    }

    return this.engine.t(key, options);
  }

  async setLocale(locale: string) {
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
