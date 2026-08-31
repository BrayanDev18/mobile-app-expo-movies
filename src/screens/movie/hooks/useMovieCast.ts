import { MediaType, MovieCast, MovieCrewProps } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapCastMembers, tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';

interface CreditsResponse {
  cast: MovieCast[];
  crew: (MovieCast & { job?: string })[];
}

export const useMovieCast = (movieId: number, mediaType: MediaType = 'movie') => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieCast', mediaType, movieId),
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const { data } = await moviesApi.get<CreditsResponse>(`/${mediaType}/${movieId}/credits`);

      const crew: MovieCrewProps[] = (data.crew ?? []).map((member) => ({
        id: member.id,
        name: member.name ?? '',
        character: member.job ?? '',
        job: member.job ?? '',
        avatar: tmdbImage(member.profile_path, 'w342') ?? '',
      }));

      return { cast: mapCastMembers(data.cast), crew };
    },
  });

  return {
    movieCast: data?.cast ?? [],
    movieCrew: data?.crew ?? [],
    isLoading,
    isError,
    refetch,
  };
};
