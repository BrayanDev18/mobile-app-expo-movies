import { MovieApiRoutes } from '@/constants';
import { GenreProps, MediaType } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieGenres = (mediaType: MediaType = 'movie') => {
  const {
    data: genres = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieGenres', mediaType),
    queryFn: async () => {
      const { data } = await moviesApi.get<{ genres: GenreProps[] }>(
        MovieApiRoutes.genres(mediaType)
      );

      return data.genres;
    },
  });

  return { genres, isLoading, isError, refetch };
};
