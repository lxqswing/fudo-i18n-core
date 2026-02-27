export class Lifecycle {
  private initialized = false;

  isInitialized() {
    return this.initialized;
  }

  markInitialized() {
    this.initialized = true;
  }
}
