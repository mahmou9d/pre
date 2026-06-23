export const storage = {
    getToken: (key: 'access' | 'refresh'): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
    },

    setToken: (key: 'access' | 'refresh', value: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, value);
    },

    removeToken: (key: 'access' | 'refresh'): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },

    clearAll: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }
};