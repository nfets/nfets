/**
 * In-memory localStorage for Jest workers.
 * Node's --localstorage-file uses SQLite; parallel Jest workers share one file
 * and fail with "database is locked" (macOS + Node 26 in CI).
 */
const store = new Map();

const localStorage = {
  getItem(key) {
    return store.has(String(key)) ? store.get(String(key)) : null;
  },
  setItem(key, value) {
    store.set(String(key), String(value));
  },
  removeItem(key) {
    store.delete(String(key));
  },
  clear() {
    store.clear();
  },
  key(index) {
    return [...store.keys()][index] ?? null;
  },
  get length() {
    return store.size;
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorage,
  configurable: true,
  enumerable: true,
  writable: true,
});
