import { MovieApiRoutes } from '@/constants';
import { GenreProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useTvGenres = () => {
  const { data: genres = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: async () => {
      const { data } = await moviesApi.get<{ genres: GenreProps[] }>(MovieApiRoutes.tvGenres);
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
