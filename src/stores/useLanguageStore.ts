import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';
// Import the i18n module directly — the translate barrel re-exports useTranslate,
// which depends on this store.
import { i18n } from '../translate/i18n';

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
      // Keep the non-reactive `translate()`/`intlLocale()` callers (query functions,
      // interceptors) in step with the persisted choice from the first render on.
      onRehydrateStorage: () => (state) => {
        if (state?.language) i18n.locale = state.language;
      },
    }
  )
);
