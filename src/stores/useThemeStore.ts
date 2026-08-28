import Storage from 'expo-sqlite/kv-store';
import { Appearance } from 'react-native';
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
        Appearance.setColorScheme(newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        Appearance.setColorScheme(theme);
      },
    }),
    {
      name: process.env.EXPO_PUBLIC_APP_THEME_STORE ?? 'app-theme',
      storage: createJSONStorage(() => Storage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating theme:', error);
            Appearance.setColorScheme('light');
            return;
          }
          if (state?.theme) {
            Appearance.setColorScheme(state.theme);
          }
        };
      },
    }
  )
);
