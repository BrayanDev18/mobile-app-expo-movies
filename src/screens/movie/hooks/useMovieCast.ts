import { IMAGE_BASE_URL } from '@/constants';
import { MovieCast, MovieCastProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieCast = (movieId: number) => {
  const { data: movieCast, isLoading: isMovieCastLoading } = useQuery({
    queryKey: ['movieCast', movieId],
    queryFn: async () => {
      const {
        data: { cast: movieCastFromApi },
      } = await moviesApi.get(`/movie/${movieId}/credits`);

      const mappedCast = movieCastFromApi.map((cast: MovieCast) => ({
        id: cast.id,
        name: cast.name,
        character: cast.character,
        avatar: `${IMAGE_BASE_URL}/${cast.profile_path}`,
      }));

      return mappedCast;
    },
  });

  return {
    movieCast: movieCast as MovieCastProps[],
    isMovieCastLoading,
  };
};
