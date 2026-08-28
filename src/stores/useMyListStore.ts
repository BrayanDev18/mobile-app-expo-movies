import { MovieProps } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const keyOf = (movie: Pick<MovieProps, 'id' | 'mediaType'>) =>
  `${movie.mediaType ?? 'movie'}-${movie.id}`;

interface MyListState {
  saved: MovieProps[];
  toggleSaved: (movie: MovieProps) => void;
  removeSaved: (movie: MovieProps) => void;
  clearSaved: () => void;
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set) => ({
      saved: [],
      toggleSaved: (movie) =>
        set((state) => {
          const exists = state.saved.some((item) => keyOf(item) === keyOf(movie));

          return {
            saved: exists
              ? state.saved.filter((item) => keyOf(item) !== keyOf(movie))
              : [movie, ...state.saved],
          };
        }),
      removeSaved: (movie) =>
        set((state) => ({
          saved: state.saved.filter((item) => keyOf(item) !== keyOf(movie)),
        })),
      clearSaved: () => set({ saved: [] }),
    }),
    {
      name: 'flixora-my-list-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
