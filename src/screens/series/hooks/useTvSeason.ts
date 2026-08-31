import { MovieApiRoutes } from '@/constants';
import { TvSeasonDetailsProps, TvSeasonDetailsResponse } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';

import { useQuery } from '@tanstack/react-query';

export const useTvSeason = (seriesId: number, seasonNumber: number) => {
  const {
    data: season,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('tvSeason', seriesId, seasonNumber),
    enabled: !!seriesId && seasonNumber >= 0,
    queryFn: async (): Promise<TvSeasonDetailsProps> => {
      const { data } = await moviesApi.get<TvSeasonDetailsResponse>(
        MovieApiRoutes.tvSeason(seriesId, seasonNumber)
      );

      return {
        id: data.id,
        name: data.name,
        overview: data.overview,
        poster: data.poster_path ?? null,
        airDate: data.air_date,
        episodes: (data.episodes ?? []).map((episode) => ({
          id: episode.id,
          name: episode.name,
          overview: episode.overview,
          still: episode.still_path ?? null,
          episodeNumber: episode.episode_number,
          airDate: episode.air_date,
          runtime: episode.runtime,
          rating: episode.vote_average,
        })),
      };
    },
  });

  return { season, isLoading, isError, refetch };
};
