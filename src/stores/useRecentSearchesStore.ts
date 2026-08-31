import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_RECENT_SEARCHES = 8;

interface RecentSearchesState {
  searches: string[];
  addSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (query) => {
        const term = query.trim();

        if (term.length < 2) return;

        set((state) => ({
          searches: [
            term,
            ...state.searches.filter((item) => item.toLowerCase() !== term.toLowerCase()),
          ].slice(0, MAX_RECENT_SEARCHES),
        }));
      },
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: StorageKeys.recentSearches,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
