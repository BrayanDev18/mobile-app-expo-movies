import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { TvEpisodeProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface SeasonResponse {
  episodes: {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    season_number: number;
    air_date: string | null;
    still_path: string | null;
    vote_average: number;
    runtime: number | null;
  }[];
}

export const useSeasonEpisodes = (seriesId: number, seasonNumber: number) => {
  const {
    data: episodes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['seasonEpisodes', seriesId, seasonNumber],
    queryFn: async () => {
      const { data } = await moviesApi.get<SeasonResponse>(
        MovieApiRoutes.tvSeason(seriesId, seasonNumber)
      );

      return (data.episodes ?? []).map(
        (ep): TvEpisodeProps => ({
          id: ep.id,
          name: ep.name,
          overview: ep.overview,
          episode_number: ep.episode_number,
          season_number: ep.season_number,
          air_date: ep.air_date,
          still_path: ep.still_path ? `${IMAGE_BASE_URL}${ep.still_path}` : null,
          vote_average: ep.vote_average,
          runtime: ep.runtime,
        })
      );
    },
    enabled: seriesId > 0 && seasonNumber >= 0,
  });

  return { episodes, isLoading, isError, refetch };
};
