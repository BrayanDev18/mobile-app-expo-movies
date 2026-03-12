import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import * as Localization from 'expo-localization';

interface MovieWatchProvidersProps {
  id: number;
  results: string;
}

const getProvidersByRegion = (results: MovieWatchProvidersProps['results'], region: string) => {
  return results[region as any] ?? results.US ?? null;
};

export const useMovieWatchProviders = (movieId: number) => {
  const region = Localization.getLocales()[0].regionCode ?? 'US';

  const { data: movieWatchProviders, isLoading: isMovieWatchProviders } = useQuery({
    queryKey: ['movieWatchProviders', movieId],
    queryFn: async () => {
      const { data } = await moviesApi.get<MovieWatchProvidersProps>(
        `/movie/${movieId}/watch/providers`
      );

      return getProvidersByRegion(data.results, region);
    },
  });

  return { movieWatchProviders, isMovieWatchProviders };
};
