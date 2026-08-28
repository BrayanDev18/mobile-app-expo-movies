import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProfileState {
  name: string;
  setName: (name: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Guest',
      setName: (name) => {
        const trimmed = name.trim();

        if (!trimmed) return;

        set({ name: trimmed });
      },
    }),
    {
      name: 'flixora-profile-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
