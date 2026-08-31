import { MediaType, MovieVideoResponse } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapVideos } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useMovieVideos = (movieId: number, mediaType: MediaType = 'movie') => {
  const {
    data: movieVideos = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieVideos', mediaType, movieId),
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const { data } = await moviesApi.get<MovieVideoResponse>(
        `/${mediaType}/${movieId}/videos`
      );

      return mapVideos(data.results).reverse();
    },
  });

  return { movieVideos, isLoading, isError, refetch };
};
