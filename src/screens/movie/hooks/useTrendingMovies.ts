import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieByCategoryProps, MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useTrendingMovies = () => {
  const {
    data: trendingMovies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['trending-movies'],
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.trendingMovies('day'));

      if (!results || results.length === 0) return [];

      return results.map((movie: MovieByCategoryProps) => ({
        id: movie.id,
        title: movie.title ?? movie.original_title,
        overview: movie.overview,
        poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
      }));
    },
  });

  return {
    trendingMovies: trendingMovies as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
