import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
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
      name: StorageKeys.language,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
