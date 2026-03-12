import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieCast, MovieCastProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useEpisodeCredits = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const { data: episodeCredits, isLoading: isEpisodeCreditsLoading } = useQuery({
    queryKey: ['episodeCredits', seriesId, seasonNumber, episodeNumber],
    queryFn: async () => {
      const { data } = await moviesApi.get(
        MovieApiRoutes.tvEpisodeCredits(seriesId, seasonNumber, episodeNumber)
      );

      const allCast = [...(data.cast ?? []), ...(data.guest_stars ?? [])];

      return allCast.map(
        (person: MovieCast): MovieCastProps => ({
          id: person.id,
          name: person.name ?? '',
          character: person.character ?? '',
          avatar: person.profile_path ? `${IMAGE_BASE_URL}/${person.profile_path}` : '',
        })
      );
    },
    enabled: seriesId > 0 && seasonNumber >= 0 && episodeNumber > 0,
  });

  return {
    episodeCredits: (episodeCredits ?? []) as MovieCastProps[],
    isEpisodeCreditsLoading,
  };
};
