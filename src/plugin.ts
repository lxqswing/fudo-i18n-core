import { I18nPlugin } from "./types";

export class PluginSystem {
  private plugins: I18nPlugin[] = [];

  use(plugin: I18nPlugin) {
    this.plugins.push(plugin);
  }

  apply(core: any) {
    this.plugins.forEach((p) => p.setup(core));
  }
}
