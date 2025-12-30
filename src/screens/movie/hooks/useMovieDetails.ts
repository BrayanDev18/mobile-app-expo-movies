import { MovieApiRoutes } from '@/constants';
import { MovieDetails, MovieDetailsProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovieToDb } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useMovieDetails = (movieId: number) => {
  const { data: movieDetails, isLoading: isMovieDetailsLoading } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: async () => {
      const { data: movieDetails } = await moviesApi.get<MovieDetails>(
        MovieApiRoutes.details(movieId)
      );

      return mapMovieToDb(movieDetails);
    },
  });

  return {
    movieDetails: movieDetails as MovieDetailsProps,
    isMovieDetailsLoading,
  };
};
