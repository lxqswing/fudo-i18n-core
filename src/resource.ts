export class ResourceManager {
  private loaded: Set<string> = new Set();

  markLoaded(ns: string) {
    this.loaded.add(ns);
  }

  isLoaded(ns: string) {
    return this.loaded.has(ns);
  }

  clear() {
    this.loaded.clear();
  }
}
