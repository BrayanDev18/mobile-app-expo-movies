import { MediaType } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MediaScopeState {
  scope: MediaType;
  setScope: (scope: MediaType) => void;
}

export const useMediaScopeStore = create<MediaScopeState>()(
  persist(
    (set) => ({
      scope: 'movie',
      setScope: (scope) => set({ scope }),
    }),
    {
      name: StorageKeys.mediaScope,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
