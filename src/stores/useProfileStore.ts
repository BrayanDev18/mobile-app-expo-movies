import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProfileState {
  name: string;
  hasOnboarded: boolean;
  setName: (name: string) => void;
  completeOnboarding: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Guest',
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
