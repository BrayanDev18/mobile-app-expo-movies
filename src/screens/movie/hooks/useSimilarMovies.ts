import { MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useSimilarMovies = (movieId: number) => {
  const {
    data: similarMovies = [],
    isLoading: isSimilarMoviesLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieSimilar', movieId],
    queryFn: async () => {
      const { data } = await moviesApi.get<MoviesByCategoryResponse>(
        `/movie/${movieId}/similar`
      );

      return mapMovies(data.results);
    },
  });

  return { similarMovies, isSimilarMoviesLoading, isError, refetch };
};
