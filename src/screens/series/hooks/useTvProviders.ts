import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProvidersResponse, ProviderProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useTvProviders = () => {
  const { data: tvProviders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tvProviders'],
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get<MovieProvidersResponse>(MovieApiRoutes.tvProviders);

      return results.map((p) => ({
        _id: p.provider_id,
        logo: `${IMAGE_BASE_URL}${p.logo_path}`,
        name: p.provider_name,
      }));
    },
  });

  return {
    tvProviders: tvProviders as ProviderProps[],
    isLoading,
    isError,
    refetch,
  };
};
