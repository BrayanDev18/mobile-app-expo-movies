import { MovieApiRoutes } from '@/constants';
import { TvByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapTvShows } from '@/utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { dedupeMedia, deviceRegion } from '../../movie/hooks/useDiscoverMovies';

export interface DiscoverTvFilters {
  genreId?: number;
  networkId?: number;
  providerId?: number;
  originalLanguage?: string;
  firstAirDateFrom?: string;
  yearFrom?: number;
  yearTo?: number;
  showType?: number;
  minVotes?: number;
}

// TMDB rejects page numbers above 500
const MAX_PAGES = 500;

const discoverTvParams = (filters: DiscoverTvFilters, region: string) => {
  const {
    genreId,
    networkId,
    providerId,
    originalLanguage,
    firstAirDateFrom,
    yearFrom,
    yearTo,
    showType,
    minVotes,
  } = filters;

  // firstAirDateFrom and yearFrom both target first_air_date.gte — the explicit
  // date wins so callers can't silently drop one of them
  const airDateFrom = firstAirDateFrom ?? (yearFrom ? `${yearFrom}-01-01` : undefined);

  return {
    sort_by: 'popularity.desc',
    ...(genreId && { with_genres: genreId }),
    ...(networkId && { with_networks: networkId }),
    ...(providerId && { with_watch_providers: providerId, watch_region: region }),
    ...(originalLanguage && { with_original_language: originalLanguage }),
    ...(airDateFrom && { 'first_air_date.gte': airDateFrom }),
    ...(yearTo && { 'first_air_date.lte': `${yearTo}-12-31` }),
    ...(showType !== undefined && { with_type: showType }),
    ...(minVotes && { 'vote_count.gte': minVotes }),
  };
};

const filtersKey = (filters: DiscoverTvFilters, region: string) => [
  filters.genreId,
  filters.networkId,
  filters.providerId,
  filters.originalLanguage,
  filters.firstAirDateFrom,
  filters.yearFrom,
  filters.yearTo,
  filters.showType,
  filters.minVotes,
  region,
];

export const discoverTvQuery = (filters: DiscoverTvFilters) => {
  const region = deviceRegion();

  return {
    queryKey: ['discoverTv', ...filtersKey(filters, region)],
    queryFn: async () => {
      const { data } = await moviesApi.get<TvByCategoryResponse>(MovieApiRoutes.discoverTv, {
        params: discoverTvParams(filters, region),
      });

      return mapTvShows(data.results);
    },
  };
};

export const useDiscoverTv = (filters: DiscoverTvFilters) => {
  const { data: series = [], isLoading, isError, refetch } = useQuery(discoverTvQuery(filters));

  return { series, isLoading, isError, refetch };
};

export const useDiscoverTvInfinite = (filters: DiscoverTvFilters) => {
  const region = deviceRegion();

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['discoverTvInfinite', ...filtersKey(filters, region)],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const { data } = await moviesApi.get<TvByCategoryResponse>(MovieApiRoutes.discoverTv, {
          params: { ...discoverTvParams(filters, region), page: pageParam },
        });

        return { series: mapTvShows(data.results), totalPages: data.total_pages };
      },
      getNextPageParam: (lastPage, pages) =>
        pages.length < Math.min(lastPage.totalPages, MAX_PAGES) ? pages.length + 1 : undefined,
    });

  const series = dedupeMedia(data?.pages.flatMap((page) => page.series) ?? []);

  return { series, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage };
};
