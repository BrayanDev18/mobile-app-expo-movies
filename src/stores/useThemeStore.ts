import Storage from 'expo-sqlite/kv-store';
import { colorScheme } from 'nativewind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        colorScheme.set(newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        colorScheme.set(theme);
      },
    }),
    {
      name: process.env.EXPO_PUBLIC_APP_THEME_STORE ?? 'app-theme',
      storage: createJSONStorage(() => Storage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating theme:', error);
            colorScheme.set('light');
            return;
          }
          if (state?.theme) {
            colorScheme.set(state.theme);
          }
        };
      },
    }
  )
);
