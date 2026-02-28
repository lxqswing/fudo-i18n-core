import { I18nConfig } from "./types";
export declare class I18nCore {
    private engine;
    private emitter;
    private resources;
    private lifecycle;
    private plugins;
    private config;
    init(config: I18nConfig): Promise<void>;
    t(key: string, options?: any): string;
    setLocale(locale: string): Promise<void>;
    getLocale(): string;
    loadNamespace(ns: string): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    use(plugin: any): void;
}
