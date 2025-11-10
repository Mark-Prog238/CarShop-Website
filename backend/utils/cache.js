const cacheStore = new Map();

export function setCache(key, value, ttlMs = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  cacheStore.set(key, { value, expiresAt });
}

export function getCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.value;
}


