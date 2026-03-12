import { IMAGE_BASE_URL } from '@/constants';
import { MovieCast, MovieCastProps, MovieCrew, MovieCrewProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieCast = (movieId: number) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['movieCast', movieId],
    queryFn: async () => {
      const {
        data: { cast: castFromApi, crew: crewFromApi },
      } = await moviesApi.get(`/movie/${movieId}/credits`);

      const mappedCast: MovieCastProps[] = (castFromApi ?? []).map((c: MovieCast) => ({
        id: c.id,
        name: c.name ?? '',
        character: c.character ?? '',
        avatar: c.profile_path ? `${IMAGE_BASE_URL}${c.profile_path}` : null,
      }));

      const mappedCrew: MovieCrewProps[] = (crewFromApi ?? []).map((c: MovieCrew) => ({
        id: c.id,
        name: c.name ?? '',
        job: c.job ?? '',
        department: c.department ?? '',
        avatar: c.profile_path ? `${IMAGE_BASE_URL}${c.profile_path}` : null,
      }));

      return { cast: mappedCast, crew: mappedCrew };
    },
  });

  return {
    movieCast: (data?.cast ?? []) as MovieCastProps[],
    movieCrew: (data?.crew ?? []) as MovieCrewProps[],
    isMovieCastLoading: isLoading,
    isError,
    refetch,
  };
};
