import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ViewedMovie {
  id: number;
  title: string;
}

interface ViewedMoviesState {
  viewed: ViewedMovie[];
  recordView: (movie: ViewedMovie) => void;
  clearViewed: () => void;
}

export const useViewedMoviesStore = create<ViewedMoviesState>()(
  persist(
    (set) => ({
      viewed: [],
      recordView: (movie) =>
        set((state) => ({
          viewed: [movie, ...state.viewed.filter((item) => item.id !== movie.id)].slice(0, 10),
        })),
      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'flixora-viewed-movies-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
