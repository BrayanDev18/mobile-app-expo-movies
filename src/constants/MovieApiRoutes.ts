export const MovieApiRoutes = {
  //Movies
  trendingAll: (time: string) => `/trending/all/${time}`,
  trendingMovies: (time: string) => `/trending/movie/${time}`,
  moviesByCategory: (category: string) => `/movie/${category}`,
  movieGenres: '/genre/movie/list',
  movieProviders: '/watch/providers/movie',
  details: (id: number) => `movie/${id}`,

  // TV Series
  tvByCategory: (category: string) => `/tv/${category}`,
  trendingTv: (time: string) => `/trending/tv/${time}`,
  tvGenres: '/genre/tv/list',
  tvProviders: '/watch/providers/tv',
  tvDetails: (id: number) => `/tv/${id}`,
  tvSeason: (seriesId: number, seasonNumber: number) => `/tv/${seriesId}/season/${seasonNumber}`,

  // TV Episodes
  tvEpisodeDetails: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
  tvEpisodeCredits: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
  tvEpisodeImages: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`,
  tvEpisodeVideos: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`,
  // Search
  searchMulti: (query: string) => `/search/multi?query=${query}`,
  searchMovies: (query: string) => `/search/movie?query=${query}`,
  searchTv: (query: string) => `/search/tv?query=${query}`,
  searchPerson: (query: string) => `/search/person?query=${query}`,

  // Discover
  discoverMovies: '/discover/movie',
  discoverTv: '/discover/tv',

  // Trending People
  trendingPeople: (time: string) => `/trending/person/${time}`,
} as const;
