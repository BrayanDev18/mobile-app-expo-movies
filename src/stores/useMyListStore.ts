import { MovieProps, MyListFlag, SavedMediaProps } from '@/interfaces';
import { mediaKey } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { StorageKeys } from './storageKeys';
import { createJSONStorage, persist } from 'zustand/middleware';

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

// Shared upsert: apply a patch to the existing item (or a fresh base), prune
// when nothing is left, keep newest-first insertion for new items.
const upsertItem = (
  items: SavedMediaProps[],
  movie: MovieProps,
  patch: (current: SavedMediaProps) => Partial<SavedMediaProps>
): SavedMediaProps[] => {
  const key = mediaKey(movie);
  const existing = items.find((item) => mediaKey(item) === key);
  const base = existing ?? asSavedItem(movie);
  const updated = { ...base, ...patch(base) };

  if (isEmptyItem(updated)) return items.filter((item) => mediaKey(item) !== key);

  if (!existing) return [updated, ...items];

  return items.map((item) => (mediaKey(item) === key ? updated : item));
};

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
        set((state) => ({
          items: upsertItem(state.items, movie, (current) => ({ [flag]: !current[flag] })),
        })),
      setRating: (movie, userRating) =>
        set((state) => ({
          items: upsertItem(state.items, movie, () => ({ userRating })),
        })),
      removeItem: (movie) =>
        set((state) => {
          const key = mediaKey(movie);

          return { items: state.items.filter((item) => mediaKey(item) !== key) };
        }),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: StorageKeys.myList,
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
