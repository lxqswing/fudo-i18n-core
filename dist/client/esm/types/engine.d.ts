import type { I18nEngine } from "./types";
export declare class I18nextEngine implements I18nEngine {
    private instance;
    constructor();
    init(config: any): Promise<void>;
    t(key: string, options?: any): string;
    changeLanguage(locale: string): Promise<void>;
    getLanguage(): string;
    loadNamespaces(ns: string | string[]): Promise<void>;
}
