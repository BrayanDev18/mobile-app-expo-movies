import { MoviesByCategoryResponse } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapMovies } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useSimilarMovies = (movieId: number) => {
  const {
    data: similarMovies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieSimilar', movieId),
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const { data } = await moviesApi.get<MoviesByCategoryResponse>(
        `/movie/${movieId}/similar`
      );

      return mapMovies(data.results);
    },
  });

  return { similarMovies, isLoading, isError, refetch };
};
