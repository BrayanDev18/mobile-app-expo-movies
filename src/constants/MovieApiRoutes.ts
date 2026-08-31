import { MediaType, TrendingWindow } from '@/interfaces';

export const MovieApiRoutes = {
  trending: (mediaType: MediaType | 'all' | 'person', window: TrendingWindow) =>
    `/trending/${mediaType}/${window}`,
  moviesByCategory: (category: string) => `/movie/${category}`,
  discoverMovies: '/discover/movie',
  movieGenres: '/genre/movie/list',
  genres: (mediaType: MediaType) => `/genre/${mediaType}/list`,
  watchProvidersByMedia: (mediaType: MediaType) => `/watch/providers/${mediaType}`,
  searchMulti: '/search/multi',
  movieRecommendations: (id: number) => `/movie/${id}/recommendations`,
  details: (id: number) => `movie/${id}`,
  watchProviders: '/watch/providers/movie',
  collection: (id: number) => `/collection/${id}`,
  tvByCategory: (category: string) => `/tv/${category}`,
  discoverTv: '/discover/tv',
  tvDetails: (id: number) => `/tv/${id}`,
  tvSeason: (id: number, seasonNumber: number) => `/tv/${id}/season/${seasonNumber}`,
  tvRecommendations: (id: number) => `/tv/${id}/recommendations`,
} as const;
