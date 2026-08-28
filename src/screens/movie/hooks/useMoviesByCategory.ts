import { MovieApiRoutes } from '@/constants';
import { MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useMoviesByCategory = (category: string) => {
  const {
    data: movies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movies', category],
    queryFn: async () => {
      const { data } = await moviesApi.get<MoviesByCategoryResponse>(
        MovieApiRoutes.moviesByCategory(category)
      );

      return mapMovies(data.results).map((movie) => ({ ...movie, category }));
    },
  });

  return { movies, isLoading, isError, refetch };
};
