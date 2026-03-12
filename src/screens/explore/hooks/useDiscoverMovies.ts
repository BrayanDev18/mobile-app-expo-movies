import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useDiscoverMovies = (genreId: number | null, sortBy: string = 'popularity.desc') => {
  const { data: movies = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['discover-movies', genreId, sortBy],
    enabled: genreId !== null,
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.discoverMovies, {
        params: {
          with_genres: genreId,
          sort_by: sortBy,
        },
      });

      if (!results?.length) return [];

      return results.map((m: any) => ({
        id: m.id,
        title: m.title ?? '',
        overview: m.overview ?? '',
        poster: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : '',
        backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}${m.backdrop_path}` : null,
        rating: m.vote_average ?? 0,
        releaseDate: m.release_date ?? '',
        media_type: 'movie' as const,
      }));
    },
  });

  return {
    movies: movies as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
