import { MovieApiRoutes } from '@/constants';
import { TvByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapTvShows } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export type TvCategory = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated';

export const useTvByCategory = (category: TvCategory) => {
  const {
    data: series = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tv', category],
    queryFn: async () => {
      const { data } = await moviesApi.get<TvByCategoryResponse>(
        MovieApiRoutes.tvByCategory(category)
      );

      return mapTvShows(data.results);
    },
  });

  return { series, isLoading, isError, refetch };
};
