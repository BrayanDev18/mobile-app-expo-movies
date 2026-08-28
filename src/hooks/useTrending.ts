import { MovieApiRoutes } from '@/constants';
import { TrendingResultProps, TrendingWindow } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapTrendingMedia } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useTrending = (
  mediaType: 'all' | 'movie' | 'tv',
  window: TrendingWindow = 'week'
) => {
  const {
    data: trending = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['trending', mediaType, window],
    queryFn: async () => {
      const { data } = await moviesApi.get<{ results: TrendingResultProps[] }>(
        MovieApiRoutes.trending(mediaType, window)
      );

      return mapTrendingMedia(data.results);
    },
  });

  return { trending, isLoading, isError, refetch };
};
