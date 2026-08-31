import { MovieProps, MyListFlag, SavedMediaProps } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const keyOf = (movie: Pick<MovieProps, 'id' | 'mediaType'>) =>
  `${movie.mediaType ?? 'movie'}-${movie.id}`;

const asSavedItem = (movie: MovieProps): SavedMediaProps => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  poster: movie.poster,
  backdrop: movie.backdrop,
  rating: movie.rating,
  releaseDate: movie.releaseDate,
  mediaType: movie.mediaType ?? 'movie',
  watchlist: false,
  watched: false,
  favorite: false,
  userRating: null,
  savedAt: Date.now(),
});

const isEmptyItem = (item: SavedMediaProps) =>
  !item.watchlist && !item.watched && !item.favorite && item.userRating === null;

interface MyListState {
  items: SavedMediaProps[];
  toggleFlag: (movie: MovieProps, flag: MyListFlag) => void;
  setRating: (movie: MovieProps, userRating: number | null) => void;
  removeItem: (movie: Pick<MovieProps, 'id' | 'mediaType'>) => void;
  clearAll: () => void;
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set) => ({
      items: [],
      toggleFlag: (movie, flag) =>
        set((state) => {
          const existing = state.items.find((item) => keyOf(item) === keyOf(movie));

          if (!existing) {
            return { items: [{ ...asSavedItem(movie), [flag]: true }, ...state.items] };
          }

          const updated = { ...existing, [flag]: !existing[flag] };

          return {
            items: isEmptyItem(updated)
              ? state.items.filter((item) => keyOf(item) !== keyOf(movie))
              : state.items.map((item) => (keyOf(item) === keyOf(movie) ? updated : item)),
          };
        }),
      setRating: (movie, userRating) =>
        set((state) => {
          const existing = state.items.find((item) => keyOf(item) === keyOf(movie));

          if (!existing) {
            if (userRating === null) return state;

            return { items: [{ ...asSavedItem(movie), userRating }, ...state.items] };
          }

          const updated = { ...existing, userRating };

          return {
            items: isEmptyItem(updated)
              ? state.items.filter((item) => keyOf(item) !== keyOf(movie))
              : state.items.map((item) => (keyOf(item) === keyOf(movie) ? updated : item)),
          };
        }),
      removeItem: (movie) =>
        set((state) => ({
          items: state.items.filter((item) => keyOf(item) !== keyOf(movie)),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'flixora-my-list-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted: unknown, version) => {
        if (version === 0) {
          const legacy = persisted as { saved?: MovieProps[] };

          return {
            items: (legacy?.saved ?? []).map((movie) => ({
              ...asSavedItem(movie),
              watchlist: true,
            })),
          };
        }

        return persisted as MyListState;
      },
    }
  )
);
