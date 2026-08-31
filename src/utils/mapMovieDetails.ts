import { MovieDetails, MovieDetailsProps } from '@/interfaces';
import { tmdbImage } from './tmdbImage';

export const mapMovieDetails = (data: MovieDetails): MovieDetailsProps => ({
  id: data.id,
  title: data.title,
  originalTitle: data.original_title,
  tagline: data.tagline,
  overview: data.overview,
  poster: tmdbImage(data.poster_path),
  backdrop: tmdbImage(data.backdrop_path),
  releaseDate: data.release_date,
  runtime: data.runtime,
  rating: data.vote_average,
  voteCount: data.vote_count,
  popularity: data.popularity,
  genres: data.genres ?? [],
  status: data.status,
  budget: data.budget,
  revenue: data.revenue,
  homepage: data.homepage,
  imdbId: data.imdb_id,
  productionCompanies: data.production_companies ?? [],
  productionCountries: data.production_countries ?? [],
  spokenLanguages: data.spoken_languages ?? [],
  isAdult: data.adult,
  hasVideo: data.video,
  originalLanguage: data.original_language,
});
