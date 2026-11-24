import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';

// Before i18n the default name was persisted as the literal 'Guest'; both it and an
// empty name mean "no name set" and render the translated guest label.
export const hasCustomName = (name: string) => !!name && name !== 'Guest';

interface ProfileState {
  name: string;
  hasOnboarded: boolean;
  setName: (name: string) => void;
  completeOnboarding: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      hasOnboarded: false,
      setName: (name) => {
        const trimmed = name.trim();

        if (!trimmed) return;

        set({ name: trimmed });
      },
      completeOnboarding: () => set({ hasOnboarded: true }),
    }),
    {
      name: StorageKeys.profile,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
