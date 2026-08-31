import {
  MediaType,
  MovieByCategoryProps,
  MovieProps,
  PersonProps,
  TrendingResultProps,
  TvResultProps,
} from '@/interfaces';
import { tmdbImage } from './tmdbImage';

export const mapMovies = (results: MovieByCategoryProps[] = []): MovieProps[] =>
  results.map((movie) => ({
    id: movie.id,
    title: movie.title ?? movie.original_title ?? '',
    overview: movie.overview,
    poster: tmdbImage(movie.poster_path),
    backdrop: tmdbImage(movie.backdrop_path),
    rating: movie.vote_average,
    releaseDate: movie.release_date,
  }));

export const mapTvShows = (results: TvResultProps[] = []): MovieProps[] =>
  results.map((show) => ({
    id: show.id,
    title: show.name ?? show.original_name ?? '',
    overview: show.overview,
    poster: tmdbImage(show.poster_path),
    backdrop: tmdbImage(show.backdrop_path),
    rating: show.vote_average,
    releaseDate: show.first_air_date,
    mediaType: 'tv' as const,
  }));

export const mapTrendingMedia = (results: TrendingResultProps[] = []): MovieProps[] =>
  results
    .filter(
      (item): item is TrendingResultProps & { media_type: MediaType } =>
        item.media_type === 'movie' || item.media_type === 'tv'
    )
    .map((item) => ({
      id: item.id,
      title: item.title ?? item.name ?? item.original_title ?? '',
      overview: item.overview ?? '',
      poster: tmdbImage(item.poster_path),
      backdrop: tmdbImage(item.backdrop_path),
      rating: item.vote_average ?? 0,
      releaseDate: item.release_date ?? item.first_air_date ?? '',
      mediaType: item.media_type,
    }));

export const mapTrendingPeople = (results: TrendingResultProps[] = []): PersonProps[] =>
  results
    .filter((item) => item.media_type === 'person')
    .map((item) => ({
      id: item.id,
      name: item.name ?? '',
      avatar: tmdbImage(item.profile_path, 'w342'),
      knownFor: item.known_for_department,
    }));
