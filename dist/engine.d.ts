import { I18nEngine } from "./types";
export declare class I18nextEngine implements I18nEngine {
    init(config: any): Promise<void>;
    t(key: string, options?: any): any;
    changeLanguage(locale: string): Promise<void>;
    getLanguage(): string;
    loadNamespaces(ns: string | string[]): Promise<void>;
}
