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
}

export interface MovieImagesProps {
  aspect_ratio: number | null;
  file_path: string | null;
  movie_id: number;
}

export interface MovieDetailsProps {
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

export interface MovieCastResponse {
  cast: MovieCastProps[];
}

export interface MovieCastProps {
  id: number;
  name: string | null;
  character: string | null;
  profile_path: string | null;
  movie_id: number;
}

export interface MoviesByCategoryResponse {
  results: MovieByCategoryProps[];
  total_pages: number;
  total_results: number;
}

export interface MovieByCategoryProps {
  id: number;
  title: string;
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

export interface MovieProvidersProps {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}
