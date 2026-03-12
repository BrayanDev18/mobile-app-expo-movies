import { MovieApiRoutes } from '@/constants';
import { GenreProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface GenreListResponse {
  genres: GenreProps[];
}

export const useMovieGenres = () => {
  const {
    data: genres = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: async () => {
      const { data } = await moviesApi.get<GenreListResponse>(MovieApiRoutes.movieGenres);
      return data.genres;
    },
    staleTime: 1000 * 60 * 60,
  });

  return {
    genres: genres as GenreProps[],
    isLoading,
    isError,
    refetch,
  };
};
