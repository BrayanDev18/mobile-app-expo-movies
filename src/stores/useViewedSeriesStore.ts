import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ViewedSeries {
  id: number;
  title: string;
}

interface ViewedSeriesState {
  viewed: ViewedSeries[];
  recordView: (series: ViewedSeries) => void;
  clearViewed: () => void;
}

export const useViewedSeriesStore = create<ViewedSeriesState>()(
  persist(
    (set) => ({
      viewed: [],
      recordView: (series) =>
        set((state) => ({
          viewed: [series, ...state.viewed.filter((item) => item.id !== series.id)].slice(0, 10),
        })),
      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'flixora-viewed-series-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
