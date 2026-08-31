import { GenreProps, SpokenLanguageProps, TmdbPaginated } from './movie.interface';

export interface TvResultProps {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
}

export type TvByCategoryResponse = TmdbPaginated<TvResultProps>;

export interface TvNetworkProps {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface TvCreatorProps {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface TvSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  vote_average: number;
}

export interface TvSeasonProps {
  id: number;
  name: string;
  overview: string;
  poster: string | null;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null;
  rating: number;
}

export interface TvEpisodeToAir {
  id: number;
  name: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
}

export interface TvEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TvSeasonDetailsResponse {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episodes: TvEpisode[];
}

export interface TvEpisodeProps {
  id: number;
  name: string;
  overview: string;
  still: string | null;
  episodeNumber: number;
  airDate: string | null;
  runtime: number | null;
  rating: number;
}

export interface TvSeasonDetailsProps {
  id: number;
  name: string;
  overview: string;
  poster: string | null;
  airDate: string | null;
  episodes: TvEpisodeProps[];
}

export interface NextEpisodeProps {
  name: string;
  airDate: string | null;
  episodeNumber: number;
  seasonNumber: number;
}

export interface TvDetails {
  id: number;
  name: string;
  original_name: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  genres?: GenreProps[];
  status: string;
  in_production: boolean;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  homepage: string;
  networks: TvNetworkProps[];
  created_by: TvCreatorProps[];
  seasons: TvSeason[];
  next_episode_to_air: TvEpisodeToAir | null;
  original_language: string;
  spoken_languages: SpokenLanguageProps[];
  type: string;
}

export interface TvDetailsProps {
  id: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  firstAirDate?: string;
  lastAirDate?: string;
  rating: number;
  voteCount: number;
  genres: GenreProps[];
  status?: string;
  inProduction?: boolean;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime?: number;
  homepage?: string;
  networks: TvNetworkProps[];
  createdBy: TvCreatorProps[];
  seasons: TvSeasonProps[];
  nextEpisode: NextEpisodeProps | null;
  originalLanguage?: string;
  spokenLanguages: SpokenLanguageProps[];
  type?: string;
}
