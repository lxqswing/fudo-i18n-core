import { I18nPlugin } from "./types";
export declare class PluginSystem {
    private plugins;
    use(plugin: I18nPlugin): void;
    apply(core: any): void;
}
