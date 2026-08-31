import { TvDetails, TvDetailsProps } from '@/interfaces';
import { tmdbImage } from './tmdbImage';

export const mapTvDetails = (data: TvDetails): TvDetailsProps => ({
  id: data.id,
  title: data.name,
  originalTitle: data.original_name,
  tagline: data.tagline,
  overview: data.overview,
  poster: tmdbImage(data.poster_path),
  backdrop: tmdbImage(data.backdrop_path),
  firstAirDate: data.first_air_date,
  lastAirDate: data.last_air_date,
  rating: data.vote_average,
  voteCount: data.vote_count,
  genres: data.genres ?? [],
  status: data.status,
  inProduction: data.in_production,
  numberOfSeasons: data.number_of_seasons,
  numberOfEpisodes: data.number_of_episodes,
  episodeRunTime: data.episode_run_time?.[0],
  homepage: data.homepage,
  networks: data.networks ?? [],
  createdBy: data.created_by ?? [],
  seasons: (data.seasons ?? []).map((season) => ({
    id: season.id,
    name: season.name,
    overview: season.overview,
    poster: tmdbImage(season.poster_path),
    seasonNumber: season.season_number,
    episodeCount: season.episode_count,
    airDate: season.air_date,
    rating: season.vote_average,
  })),
  nextEpisode: data.next_episode_to_air
    ? {
        name: data.next_episode_to_air.name,
        airDate: data.next_episode_to_air.air_date,
        episodeNumber: data.next_episode_to_air.episode_number,
        seasonNumber: data.next_episode_to_air.season_number,
      }
    : null,
  originalLanguage: data.original_language,
  spokenLanguages: data.spoken_languages ?? [],
  type: data.type,
});
