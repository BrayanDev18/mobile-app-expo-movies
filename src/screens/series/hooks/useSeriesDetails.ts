import { MovieApiRoutes } from '@/constants';
import { SeriesDetailsProps, TvSeriesDetails } from '@/interfaces';
import { moviesApi } from '@/services';
import { mapSeriesToDb } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useSeriesDetails = (seriesId: number) => {
  const { data: seriesDetails, isLoading: isSeriesDetailsLoading } = useQuery({
    queryKey: ['seriesDetails', seriesId],
    queryFn: async () => {
      const { data } = await moviesApi.get<TvSeriesDetails>(MovieApiRoutes.tvDetails(seriesId));
      return mapSeriesToDb(data);
    },
  });

  return {
    seriesDetails: seriesDetails as SeriesDetailsProps,
    isSeriesDetailsLoading,
  };
};
