import { MovieApiRoutes } from '@/constants';
import { TvSeasonDetailsResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useTvSeason = (seriesId: number, seasonNumber: number) => {
  const {
    data: season,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tvSeason', seriesId, seasonNumber],
    enabled: !!seriesId && seasonNumber >= 0,
    queryFn: async () => {
      const { data } = await moviesApi.get<TvSeasonDetailsResponse>(
        MovieApiRoutes.tvSeason(seriesId, seasonNumber)
      );

      return {
        id: data.id,
        name: data.name,
        overview: data.overview,
        poster: tmdbImage(data.poster_path),
        airDate: data.air_date,
        episodes: (data.episodes ?? []).map((episode) => ({
          id: episode.id,
          name: episode.name,
          overview: episode.overview,
          still: tmdbImage(episode.still_path),
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
