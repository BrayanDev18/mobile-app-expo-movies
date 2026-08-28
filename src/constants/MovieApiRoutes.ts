import { MediaType, TrendingWindow } from '@/interfaces';

export const MovieApiRoutes = {
  trending: (mediaType: MediaType | 'all' | 'person', window: TrendingWindow) =>
    `/trending/${mediaType}/${window}`,
  moviesByCategory: (category: string) => `/movie/${category}`,
  discoverMovies: '/discover/movie',
  movieGenres: '/genre/movie/list',
  searchMulti: '/search/multi',
  movieRecommendations: (id: number) => `/movie/${id}/recommendations`,
  details: (id: number) => `movie/${id}`,
  watchProviders: '/watch/providers/movie',
  collection: (id: number) => `/collection/${id}`,
} as const;
