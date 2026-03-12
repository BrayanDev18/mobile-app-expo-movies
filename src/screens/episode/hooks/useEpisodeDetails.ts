import { MovieApiRoutes } from '@/constants';
import { EpisodeDetailsProps, TvEpisodeDetail } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapEpisodeToProps } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useEpisodeDetails = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const { data: episodeDetails, isLoading: isEpisodeDetailsLoading } = useQuery({
    queryKey: ['episodeDetails', seriesId, seasonNumber, episodeNumber],
    queryFn: async () => {
      const { data } = await moviesApi.get<TvEpisodeDetail>(
        MovieApiRoutes.tvEpisodeDetails(seriesId, seasonNumber, episodeNumber)
      );
      return mapEpisodeToProps(data);
    },
    enabled: seriesId > 0 && seasonNumber >= 0 && episodeNumber > 0,
  });

  return {
    episodeDetails: episodeDetails as EpisodeDetailsProps,
    isEpisodeDetailsLoading,
  };
};
