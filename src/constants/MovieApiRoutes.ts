export const MovieApiRoutes = {
  //Movies
  trendingAll: (time: string) => `/trending/all/${time}`,
  moviesByCategory: (category: string) => `/movie/${category}`,

  //providers
  movieProviders: '/watch/providers/movie',
  details: (id: number) => `movie/${id}`,
} as const;
