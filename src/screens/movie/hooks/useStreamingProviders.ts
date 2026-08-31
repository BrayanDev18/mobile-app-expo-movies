import { MovieApiRoutes } from '@/constants';
import { MediaType, WatchProvidersResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { deviceRegion } from './useDiscoverMovies';

const PROVIDERS_LIMIT = 8;

// Skip TMDB's aggregator and rental/variant listings so only primary services show
const EXCLUDED_TERMS = ['justwatch', 'channel', 'store', 'premium', 'with ads'];

export const useStreamingProviders = (mediaType: MediaType = 'movie') => {
  const region = deviceRegion();

  const {
    data: providers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['streamingProviders', mediaType, region],
    queryFn: async () => {
      const { data } = await moviesApi.get<WatchProvidersResponse>(
        MovieApiRoutes.watchProvidersByMedia(mediaType),
        {
          params: { watch_region: region },
        }
      );

      const seenBrands = new Set<string>();

      return data.results
        .filter((provider) => provider.logo_path)
        .sort(
          (a, b) =>
            (a.display_priorities?.[region] ?? a.display_priority ?? 999) -
            (b.display_priorities?.[region] ?? b.display_priority ?? 999)
        )
        .filter((provider) => {
          const name = provider.provider_name.toLowerCase();

          if (EXCLUDED_TERMS.some((term) => name.includes(term))) return false;

          const brand = name.split(' ')[0];

          if (seenBrands.has(brand)) return false;

          seenBrands.add(brand);
          return true;
        })
        .slice(0, PROVIDERS_LIMIT)
        .map((provider) => ({
          id: provider.provider_id,
          name: provider.provider_name,
          logo: tmdbImage(provider.logo_path, 'w185'),
        }));
    },
  });

  return { providers, isLoading, isError, refetch };
};
