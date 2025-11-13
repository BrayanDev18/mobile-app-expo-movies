export interface CastDetailsProps {
  id: number;
  cast_id: number;
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  homepage: string;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface CastImagesRecord {
  cast_id: number;
  profiles: string;
}

export interface CastImagesResponse {
  cast_id: number;
  profiles: CastImageProfileProps[];
}

export interface CastImageProfileProps {
  aspect_ratio: number;
  height: number;
  file_path: string;
  width: number;
}

export interface CastCreditsResponse {
  cast: CastCreditProps[];
}

export interface CastCreditRecord {
  id: number;
  name: string | null;
  character: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  credit_id: string;
  order: number;
  original_title: string;
  original_language: string;
  overview: string;
  release_date: string;
  video: boolean;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genre_ids: string;
  cast_id: number;
}

export interface CastCreditProps {
  id: number;
  name: string;
  character: string;
  poster_path: string;
  backdrop_path: string;
  adult: boolean;
  credit_id: string;
  order: number;
  original_title: string;
  original_language: string;
  overview: string;
  release_date: string;
  video: boolean;
  popularity: number;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  cast_id: number;
}
