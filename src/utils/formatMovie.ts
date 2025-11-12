import { MovieDetailsProps } from '@/interfaces';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const parseJSON = <T>(value: unknown, fallback: T): T => {
  if (!value) return fallback;

  try {
    return typeof value === 'string' ? JSON.parse(value) : (value as T);
  } catch {
    return fallback;
  }
};

export const formatImagePaths = (movie: any) => ({
  ...movie,
  backdrop_path: movie.backdrop_path ? `${IMAGE_BASE}${movie.backdrop_path}` : null,
  poster_path: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
});

export const parseLocalMovie = (local: MovieDetailsProps) => ({
  ...formatImagePaths(local),
  genres: parseJSON(local.genres, []),
  production_companies: parseJSON(local.production_companies, []),
  production_countries: parseJSON(local.production_countries, []),
  spoken_languages: parseJSON(local.spoken_languages, []),
});

export const mapMovieToDb = (data: MovieDetailsProps) => ({
  id: data.id,
  adult: data.adult,
  backdrop_path: data.backdrop_path,
  budget: data.budget,
  genres: JSON.stringify(data.genres || []),
  homepage: data.homepage,
  imdb_id: data.imdb_id,
  original_language: data.original_language,
  original_title: data.original_title,
  overview: data.overview,
  popularity: data.popularity,
  poster_path: data.poster_path,
  production_companies: JSON.stringify(data.production_companies || []),
  production_countries: JSON.stringify(data.production_countries || []),
  release_date: data.release_date,
  revenue: data.revenue,
  runtime: data.runtime,
  spoken_languages: JSON.stringify(data.spoken_languages || []),
  status: data.status,
  tagline: data.tagline,
  title: data.title,
  video: data.video,
  vote_average: data.vote_average,
  vote_count: data.vote_count,
});
