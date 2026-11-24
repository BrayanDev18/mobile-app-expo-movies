import { StorageKeys } from '@/stores';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { Query, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

// Shared so code outside React (prefetch on press-in) talks to the same cache.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: 30 * MINUTE,
    },
  },
});

// Only the home rails are persisted: they are what a cold start shows first, and
// they are small. Detail payloads (images, reviews, credits) would bloat storage
// — Android's AsyncStorage caps out around 6MB.
const PERSISTED_QUERY_ROOTS = new Set([
  'trending',
  'trendingPeople',
  'movies',
  'tv',
  'discoverMovies',
  'discoverTv',
  'movieRecommendations',
  'tvRecommendations',
]);

const shouldDehydrateQuery = (query: Query) =>
  query.state.status === 'success' && PERSISTED_QUERY_ROOTS.has(String(query.queryKey[0]));

// Bump when a mapper changes the shape of persisted data: a mismatching buster
// discards the stored cache instead of handing old shapes to new code.
const CACHE_BUSTER = 'home-rails-v1';

export const queryPersistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: createAsyncStoragePersister({
    storage: AsyncStorage,
    key: StorageKeys.queryCache,
    throttleTime: 2000,
  }),
  // Restored data older than staleTime renders at once and refetches in the
  // background; anything past maxAge is dropped.
  maxAge: 24 * HOUR,
  buster: CACHE_BUSTER,
  dehydrateOptions: { shouldDehydrateQuery },
};
