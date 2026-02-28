export interface I18nConfig {
    defaultLocale: string;
    supportedLocales: string[];
    namespaces?: string[];
    backend?: {
        loadPath: string;
    };
    preload?: string[];
}
export interface I18nEngine {
    init(config: any): Promise<void>;
    t(key: string, options?: any): string;
    changeLanguage(locale: string): Promise<void>;
    getLanguage(): string;
    loadNamespaces(ns: string | string[]): Promise<void>;
}
export type I18nEvent = "ready" | "localeChanged" | "namespaceLoaded";
export interface I18nPlugin {
    name: string;
    setup(core: any): void;
}
