export class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const cached = this.store.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return cached.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cache = new InMemoryCache();
export default cache;
