import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import * as Localization from 'expo-localization';

interface TvWatchProvidersResponse {
  id: number;
  results: Record<string, any>;
}

const getProvidersByRegion = (results: Record<string, any>, region: string) => {
  return results[region] ?? results.US ?? null;
};

export const useSeriesWatchProviders = (seriesId: number) => {
  const region = Localization.getLocales()[0].regionCode ?? 'US';

  const { data: seriesWatchProviders, isLoading: isSeriesWatchProvidersLoading } = useQuery({
    queryKey: ['seriesWatchProviders', seriesId],
    queryFn: async () => {
      const { data } = await moviesApi.get<TvWatchProvidersResponse>(
        `/tv/${seriesId}/watch/providers`
      );

      return getProvidersByRegion(data.results, region);
    },
  });

  return { seriesWatchProviders, isSeriesWatchProvidersLoading };
};
