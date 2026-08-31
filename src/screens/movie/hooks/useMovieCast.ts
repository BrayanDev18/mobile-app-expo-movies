import { MediaType, MovieCast, MovieCastProps, MovieCrewProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';

interface CreditsResponse {
  cast: MovieCast[];
  crew: (MovieCast & { job?: string })[];
}

export const useMovieCast = (movieId: number, mediaType: MediaType = 'movie') => {
  const { data, isLoading: isMovieCastLoading } = useQuery({
    queryKey: ['movieCast', mediaType, movieId],
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const { data } = await moviesApi.get<CreditsResponse>(`/${mediaType}/${movieId}/credits`);

      const cast: MovieCastProps[] = data.cast.map((member) => ({
        id: member.id,
        name: member.name ?? '',
        character: member.character ?? '',
        avatar: tmdbImage(member.profile_path, 'w342') ?? '',
      }));

      const crew: MovieCrewProps[] = (data.crew ?? []).map((member) => ({
        id: member.id,
        name: member.name ?? '',
        character: member.job ?? '',
        job: member.job ?? '',
        avatar: tmdbImage(member.profile_path, 'w342') ?? '',
      }));

      return { cast, crew };
    },
  });

  return {
    movieCast: data?.cast ?? [],
    movieCrew: data?.crew ?? [],
    isMovieCastLoading,
  };
};
