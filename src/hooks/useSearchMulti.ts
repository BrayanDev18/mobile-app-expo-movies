import { MovieApiRoutes } from '@/constants';
import { TrendingResultProps } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapTrendingMedia, mapTrendingPeople } from '@/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const MIN_QUERY_LENGTH = 2;

export const useSearchMulti = (query: string) => {
  const trimmed = query.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: tmdbKey('searchMulti', trimmed),
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await moviesApi.get<{ results: TrendingResultProps[] }>(
        MovieApiRoutes.searchMulti,
        { params: { query: trimmed } }
      );

      return {
        media: mapTrendingMedia(data.results),
        people: mapTrendingPeople(data.results),
      };
    },
  });

  return {
    media: data?.media ?? [],
    people: data?.people ?? [],
    isSearching: enabled && isFetching,
    hasQuery: enabled,
    isError,
    refetch,
  };
};
