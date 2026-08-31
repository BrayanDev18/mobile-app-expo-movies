import { MediaType } from '@/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ViewedMedia {
  id: number;
  title: string;
  mediaType: MediaType;
}

interface ViewedMediaState {
  viewed: ViewedMedia[];
  recordView: (media: ViewedMedia) => void;
  clearViewed: () => void;
}

const MAX_ENTRIES = 20;

const LEGACY_KEYS: { storageKey: string; mediaType: MediaType }[] = [
  { storageKey: 'flixora-viewed-movies-store', mediaType: 'movie' },
  { storageKey: 'flixora-viewed-series-store', mediaType: 'tv' },
];

export const useViewedMediaStore = create<ViewedMediaState>()(
  persist(
    (set) => ({
      viewed: [],
      recordView: (media) =>
        set((state) => ({
          viewed: [
            media,
            ...state.viewed.filter(
              (item) => !(item.id === media.id && item.mediaType === media.mediaType)
            ),
          ].slice(0, MAX_ENTRIES),
        })),
      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'flixora-viewed-media-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // One-time import of the two pre-merge history stores
        if (state && state.viewed.length === 0) {
          Promise.all(
            LEGACY_KEYS.map(async ({ storageKey, mediaType }) => {
              const raw = await AsyncStorage.getItem(storageKey);

              if (!raw) return [];

              const legacy = JSON.parse(raw)?.state?.viewed ?? [];

              await AsyncStorage.removeItem(storageKey);

              return legacy.map((item: { id: number; title: string }) => ({ ...item, mediaType }));
            })
          )
            .then(([movies, series]) => {
              const merged = [...movies, ...series].slice(0, MAX_ENTRIES);

              if (merged.length) {
                useViewedMediaStore.setState((current) =>
                  current.viewed.length === 0 ? { viewed: merged } : current
                );
              }
            })
            .catch(() => {
              // Legacy data is best-effort; a parse failure just starts fresh
            });
        }
      },
    }
  )
);

export const selectLastViewed = (mediaType: MediaType) => (state: ViewedMediaState) =>
  state.viewed.find((item) => item.mediaType === mediaType);
