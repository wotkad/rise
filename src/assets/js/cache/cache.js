export class CacheManager {
  constructor(options = {}) {
    const {
      duration = 5 * 60 * 1000, // 5 минут по умолчанию
      storage = 'memory', // 'memory' или 'localStorage'
      prefix = 'cache_' // префикс для ключей в localStorage
    } = options;

    this.duration = duration;
    this.storageType = storage;
    this.prefix = prefix;
    
    // Для memory-кеша
    this.memoryCache = new Map();
  }

  get(key) {
    const fullKey = this.prefix + key;
    
    // Получаем данные в зависимости от типа хранилища
    let entry;
    if (this.storageType === 'localStorage') {
      const cached = localStorage.getItem(fullKey);
      entry = cached ? JSON.parse(cached) : null;
    } else {
      entry = this.memoryCache.get(fullKey);
    }

    if (!entry) return null;

    // Проверяем срок годности
    if (this._isEntryExpired(entry)) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key, data) {
    const fullKey = this.prefix + key;
    const entry = {
      data,
      timestamp: Date.now()
    };

    if (this.storageType === 'localStorage') {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } else {
      this.memoryCache.set(fullKey, entry);
    }
  }

  delete(key) {
    const fullKey = this.prefix + key;
    
    if (this.storageType === 'localStorage') {
      localStorage.removeItem(fullKey);
    } else {
      this.memoryCache.delete(fullKey);
    }
  }

  clear() {
    if (this.storageType === 'localStorage') {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } else {
      this.memoryCache.clear();
    }
  }

  has(key) {
    const fullKey = this.prefix + key;
    
    if (this.storageType === 'localStorage') {
      return localStorage.getItem(fullKey) !== null;
    }
    return this.memoryCache.has(fullKey);
  }

  isExpired(key) {
    const fullKey = this.prefix + key;
    
    let entry;
    if (this.storageType === 'localStorage') {
      const cached = localStorage.getItem(fullKey);
      entry = cached ? JSON.parse(cached) : null;
    } else {
      entry = this.memoryCache.get(fullKey);
    }

    if (!entry) return true;
    
    return this._isEntryExpired(entry);
  }

  // Внутренний метод для проверки просроченности записи
  _isEntryExpired(entry) {
    return Date.now() - entry.timestamp > this.duration;
  }
}

// Экспортируем стандартные инстансы для удобства
export const memoryCache = new CacheManager({ storage: 'memory' });
export const persistentCache = new CacheManager({ storage: 'localStorage' });

// Дефолтный кеш (memory)
export const appCache = memoryCache;