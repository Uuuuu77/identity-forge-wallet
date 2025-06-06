
// Simple storage utility with localStorage fallback
export const storage = {
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
  }
};
