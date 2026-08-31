import { MovieApiRoutes } from '@/constants';
import { MovieProps, MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies, mediaKey } from '@/utils';
import { useInfiniteQuery } from '@tanstack/react-query';

import * as Localization from 'expo-localization';

export interface DiscoverMoviesFilters {
  genreId?: number;
  providerId?: number;
  yearFrom?: number;
  yearTo?: number;
}

export const deviceRegion = () => Localization.getLocales()[0]?.regionCode ?? 'US';

// TMDB rejects page numbers above 500
const MAX_PAGES = 500;

export const dedupeMedia = (movies: MovieProps[]) => {
  const seen = new Set<string>();

  return movies.filter((movie) => {
    const key = mediaKey(movie);

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const discoverMoviesParams = (
  { genreId, providerId, yearFrom, yearTo }: DiscoverMoviesFilters,
  region: string
) => ({
  sort_by: 'popularity.desc',
  ...(genreId && { with_genres: genreId }),
  ...(providerId && { with_watch_providers: providerId, watch_region: region }),
  ...(yearFrom && { 'primary_release_date.gte': `${yearFrom}-01-01` }),
  ...(yearTo && { 'primary_release_date.lte': `${yearTo}-12-31` }),
});

export const discoverMoviesQuery = (filters: DiscoverMoviesFilters, region: string) => ({
  queryKey: [
    'discoverMovies',
    filters.genreId,
    filters.providerId,
    filters.yearFrom,
    filters.yearTo,
    region,
  ],
  queryFn: async () => {
    const { data } = await moviesApi.get<MoviesByCategoryResponse>(MovieApiRoutes.discoverMovies, {
      params: discoverMoviesParams(filters, region),
    });

    return mapMovies(data.results);
  },
});

export const useDiscoverMoviesInfinite = (filters: DiscoverMoviesFilters) => {
  const region = deviceRegion();

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'discoverMoviesInfinite',
        filters.genreId,
        filters.providerId,
        filters.yearFrom,
        filters.yearTo,
        region,
      ],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const { data } = await moviesApi.get<MoviesByCategoryResponse>(
          MovieApiRoutes.discoverMovies,
          { params: { ...discoverMoviesParams(filters, region), page: pageParam } }
        );

        return { movies: mapMovies(data.results), totalPages: data.total_pages };
      },
      getNextPageParam: (lastPage, pages) =>
        pages.length < Math.min(lastPage.totalPages, MAX_PAGES) ? pages.length + 1 : undefined,
    });

  const movies = dedupeMedia(data?.pages.flatMap((page) => page.movies) ?? []);

  return { movies, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage };
};
