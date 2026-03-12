export interface MovieProps {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string | null;
  rating: number;
  releaseDate: string;
  category?: string;
  media_type?: 'movie' | 'tv';
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

export interface MovieCrew {
  id: number;
  name: string | null;
  job: string | null;
  department: string | null;
  profile_path: string | null;
}

export interface MovieCrewProps {
  id: number;
  name: string;
  job: string;
  department: string;
  avatar: string | null;
}

export interface MoviesByCategoryResponse {
  results: MovieByCategoryProps[];
  total_pages: number;
  total_results: number;
}

export interface TvSeriesByCategoryProps {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  adult: boolean;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  original_language: string;
  backdrop_path: string;
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

// TV Series Detail interfaces

export interface TvSeriesDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: TvCreatedByProps[];
  episode_run_time: number[];
  first_air_date: string;
  genres?: GenreProps[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  networks: TvNetworkProps[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompanyProps[];
  production_countries: ProductionCountryProps[];
  seasons: TvSeasonProps[];
  spoken_languages: SpokenLanguageProps[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface TvCreatedByProps {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface TvNetworkProps {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TvSeasonProps {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TvEpisodeProps {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
}

export interface TvEpisodeDetail {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  production_code: string | null;
  crew: TvEpisodeCrewMember[];
  guest_stars: TvEpisodeGuestStar[];
}

export interface TvEpisodeCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
}

export interface TvEpisodeGuestStar {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  credit_id: string;
  order: number;
}

export interface EpisodeDetailsProps {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  airDate: string | null;
  stillPath: string | null;
  rating: number;
  voteCount: number;
  runtime: number | null;
  productionCode: string | null;
  crew: TvEpisodeCrewMember[];
  guestStars: TvEpisodeGuestStar[];
}

// Person / People interfaces

export interface PersonProps {
  id: number;
  name: string;
  avatar: string | null;
  department: string;
  knownFor: MovieProps[];
}

export interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: TmdbKnownFor[];
}

export interface TmdbKnownFor {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

export interface SeriesDetailsProps {
  id: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  firstAirDate?: string;
  lastAirDate?: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[];
  rating: number;
  voteCount: number;
  popularity?: number;
  genres: GenreProps[];
  status?: string;
  homepage?: string;
  inProduction: boolean;
  networks: TvNetworkProps[];
  createdBy: TvCreatedByProps[];
  seasons: TvSeasonProps[];
  productionCompanies: ProductionCompanyProps[];
  productionCountries: ProductionCountryProps[];
  spokenLanguages: SpokenLanguageProps[];
  isAdult?: boolean;
  originalLanguage?: string;
  type?: string;
}
