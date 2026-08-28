import { MovieApiRoutes } from '@/constants';
import { TrendingResultProps, TrendingWindow } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapTrendingPeople } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useTrendingPeople = (window: TrendingWindow = 'week') => {
  const {
    data: people = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['trendingPeople', window],
    queryFn: async () => {
      const { data } = await moviesApi.get<{ results: TrendingResultProps[] }>(
        MovieApiRoutes.trending('person', window)
      );

      return mapTrendingPeople(data.results);
    },
  });

  return { people, isLoading, isError, refetch };
};
