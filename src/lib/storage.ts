
// Simple storage utility with localStorage fallback
const storage = {
  data: new Map<string, any>(),
  
  set(key: string, value: any) {
    this.data.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  },
  
  get(key: string) {
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    try {
      const item = localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : null;
      if (parsed) {
        this.data.set(key, parsed);
      }
      return parsed;
    } catch (e) {
      return null;
    }
  },
  
  remove(key: string) {
    this.data.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('LocalStorage not available');
    }
  },
  
  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (e) {
      console.warn('LocalStorage not available, using memory storage keys');
      return Array.from(this.data.keys());
    }
  },
  
  getByPrefix(prefix: string): Array<{ key: string; value: any }> {
    const results: Array<{ key: string; value: any }> = [];
    
    // Get from memory storage
    for (const [key, value] of this.data.entries()) {
      if (key.startsWith(prefix)) {
        results.push({ key, value });
      }
    }
    
    // Get from localStorage if available
    try {
      const allKeys = Object.keys(localStorage);
      const prefixKeys = allKeys.filter(key => key.startsWith(prefix));
      for (const key of prefixKeys) {
        if (!this.data.has(key)) {
          const value = this.get(key);
          if (value) {
            results.push({ key, value });
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage not available, using memory storage only');
    }
    
    return results;
  }
};

export default storage;
