import { MovieApiRoutes } from '@/constants';
import { GenreProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieGenres = () => {
  const {
    data: genres = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: async () => {
      const { data } = await moviesApi.get<{ genres: GenreProps[] }>(MovieApiRoutes.movieGenres);

      return data.genres;
    },
  });

  return { genres, isLoading, isError, refetch };
};
