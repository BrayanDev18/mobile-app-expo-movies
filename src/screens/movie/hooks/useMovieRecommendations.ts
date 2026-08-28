import { MovieApiRoutes } from '@/constants';
import { MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useMovieRecommendations = (movieId?: number) => {
  const {
    data: movies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieRecommendations', movieId],
    enabled: !!movieId,
    queryFn: async () => {
      const { data } = await moviesApi.get<MoviesByCategoryResponse>(
        MovieApiRoutes.movieRecommendations(movieId as number)
      );

      return mapMovies(data.results);
    },
  });

  return { movies, isLoading, isError, refetch };
};
