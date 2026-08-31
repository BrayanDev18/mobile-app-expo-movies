export type MediaType = 'movie' | 'tv';
export type TrendingWindow = 'day' | 'week';

export interface MovieProps {
  id: number;
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  releaseDate: string;
  category?: string;
  mediaType?: MediaType;
}

export interface TrendingResultProps {
  id: number;
  media_type: MediaType | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
}

export type MyListFlag = 'watchlist' | 'watched' | 'favorite';

export interface SavedMediaProps extends MovieProps {
  watchlist: boolean;
  watched: boolean;
  favorite: boolean;
  userRating: number | null;
  savedAt: number;
}

export interface PersonProps {
  id: number;
  name: string;
  avatar: string | null;
  knownFor?: string;
}

export interface SimilarMoviesResponse {
  results: SimilarMoviesProps[];
}

export interface SimilarMoviesProps {
  id: number;
  title: string | null;
  release_date: number | null;
  movie_id: number;
  poster_path: string | null;
}

export interface MovieVideoResponse {
  results: MovieVideosProps[];
}

export interface MovieVideosProps {
  key: string;
  name: string | null;
  site: string | null;
  type: string | null;
  size: number | null;
  movie_id: number;
  official: boolean | null;
  published_at: number | null;
  last_updated: number;
}

export interface MovieReviewsResponse {
  results: MovieReviewProps[];
}

export interface MovieReviewProps {
  id: string;
  author: string | null;
  author_details: string | any;
  content: string | null;
  created_at: number | null;
  url: string | null;
  movie_id: number;
}

export interface MovieImagesResponse {
  backdrops: MovieImagesProps[];
  logos: MovieImagesProps[];
  posters: MovieImagesProps[];
}

export interface MovieImages {
  aspect_ratio: number | null;
  file_path: string | null;
}

export interface MovieImagesProps {
  aspectRatio: number | null;
  url: string | null;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres?: GenreProps[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompanyProps[];
  production_countries: ProductionCountryProps[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguageProps[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetailsProps {
  id: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  releaseDate?: string;
  runtime?: number;
  rating: number;
  voteCount: number;
  popularity?: number;
  genres: GenreProps[];
  status?: string;
  budget?: number;
  revenue?: number;
  homepage?: string;
  imdbId?: string;
  productionCompanies: ProductionCompanyProps[];
  productionCountries: ProductionCountryProps[];
  spokenLanguages: SpokenLanguageProps[];
  isAdult?: boolean;
  hasVideo?: boolean;
  originalLanguage?: string;
}

export interface GenreProps {
  id: number;
  name: string;
}

export interface ProductionCompanyProps {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountryProps {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguageProps {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieCastProps {
  id: number;
  name: string;
  character: string;
  avatar: string;
}

export interface MovieCast {
  id: number;
  name: string | null;
  character: string | null;
  profile_path: string | null;
}

export interface MovieCrewProps extends MovieCastProps {
  job: string;
}

export interface MoviesByCategoryResponse {
  results: MovieByCategoryProps[];
  total_pages: number;
  total_results: number;
}

export interface MovieByCategoryProps {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  adult: boolean;
  poster_path: string;
  release_date: string;
  vote_average: number;
  original_language: string;
  backdrop_path: string;
  category: string;
}

export interface WatchProvidersResponse {
  results: WatchProviderProps[];
}

export interface WatchProviderProps {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
  display_priorities?: Record<string, number>;
}

export interface StreamingProviderProps {
  id: number;
  name: string;
  logo: string | null;
}

export interface CollectionDetailsResponse {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieByCategoryProps[];
}

export interface CollectionProps {
  id: number;
  name: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  parts: MovieProps[];
}

export interface MovieProvidersResponse {
  results: MovieProvidersProps[];
}

export interface ProviderProps {
  _id: number;
  logo: string;
  name: string;
}

export interface MovieProvidersProps {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface RegionWatchProvidersProps {
  link?: string;
  flatrate?: MovieProvidersProps[];
  rent?: MovieProvidersProps[];
  buy?: MovieProvidersProps[];
}
