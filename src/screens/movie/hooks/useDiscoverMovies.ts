import { MovieApiRoutes } from '@/constants';
import { MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies } from '@/utils';
import { useQuery } from '@tanstack/react-query';

import * as Localization from 'expo-localization';

export interface DiscoverMoviesFilters {
  genreId?: number;
  providerId?: number;
  yearFrom?: number;
  yearTo?: number;
}

export const deviceRegion = () => Localization.getLocales()[0]?.regionCode ?? 'US';

export const discoverMoviesQuery = (
  { genreId, providerId, yearFrom, yearTo }: DiscoverMoviesFilters,
  region: string
) => ({
  queryKey: ['discoverMovies', genreId, providerId, yearFrom, yearTo, region],
  queryFn: async () => {
    const { data } = await moviesApi.get<MoviesByCategoryResponse>(MovieApiRoutes.discoverMovies, {
      params: {
        sort_by: 'popularity.desc',
        ...(genreId && { with_genres: genreId }),
        ...(providerId && { with_watch_providers: providerId, watch_region: region }),
        ...(yearFrom && { 'primary_release_date.gte': `${yearFrom}-01-01` }),
        ...(yearTo && { 'primary_release_date.lte': `${yearTo}-12-31` }),
      },
    });

    return mapMovies(data.results);
  },
});

export const useDiscoverMovies = (filters: DiscoverMoviesFilters) => {
  const {
    data: movies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery(discoverMoviesQuery(filters, deviceRegion()));

  return { movies, isLoading, isError, refetch };
};
