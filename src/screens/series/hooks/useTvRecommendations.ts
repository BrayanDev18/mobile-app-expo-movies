import { MovieApiRoutes } from '@/constants';
import { TvByCategoryResponse } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapTvShows } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useTvRecommendations = (seriesId?: number) => {
  const {
    data: series = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('tvRecommendations', seriesId),
    enabled: !!seriesId,
    queryFn: async () => {
      const { data } = await moviesApi.get<TvByCategoryResponse>(
        MovieApiRoutes.tvRecommendations(seriesId as number)
      );

      return mapTvShows(data.results);
    },
  });

  return { series, isLoading, isError, refetch };
};
