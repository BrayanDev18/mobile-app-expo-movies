import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { i18n } from '../translate';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: i18n.locale,
      setLanguage: (language) => {
        i18n.locale = language;
        set({ language });
      },
    }),
    {
      name: process.env.EXPO_PUBLIC_LOCALSTORAGE_LANGUAGE_KEY ?? 'language-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
