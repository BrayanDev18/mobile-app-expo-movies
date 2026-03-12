import { IMAGE_BASE_URL } from '@/constants';
import { MovieByCategoryProps, MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useSimilarMovies = (movieId: number) => {
  const { data: similarMovies, isLoading: isSimilarMoviesLoading } = useQuery({
    queryKey: ['movieSimilar', movieId],
    queryFn: async () => {
      const {
        data: { results: similarMovies },
      } = await moviesApi.get(`/movie/${movieId}/similar`);

      const mappedSimilarMovies = similarMovies.map((movie: MovieByCategoryProps) => ({
        id: movie.id,
        title: movie.title ?? movie.original_title,
        overview: movie.overview,
        poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
      }));

      return mappedSimilarMovies;
    },
  });

  return {
    similarMovies: similarMovies as MovieProps[],
    isSimilarMoviesLoading,
  };
};
