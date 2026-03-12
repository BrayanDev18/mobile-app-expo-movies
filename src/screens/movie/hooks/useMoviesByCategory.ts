import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieByCategoryProps, MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMoviesByCategory = (category: string) => {
  const { data: movies = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['movies', category],
    queryFn: async () => {
      const {
        data: { results: apiMovies },
      } = await moviesApi.get(MovieApiRoutes.moviesByCategory(category));

      if (!apiMovies || apiMovies.length === 0) {
        return [];
      }

      const newMoviesArray = apiMovies.map((movie: MovieByCategoryProps) => ({
        id: movie.id,
        title: movie.title ?? movie.original_title,
        overview: movie.overview,
        poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        category,
      }));

      return newMoviesArray;
    },
  });

  return {
    movies: movies as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
