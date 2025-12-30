import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProvidersResponse, ProviderProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieProviders = () => {
  const { data: movieProviders, isLoading: isMovieProvidersLoading } = useQuery({
    queryKey: ['movieProviders'],
    queryFn: async () => {
      const {
        data: { results: movieProvidersFromApi },
      } = await moviesApi.get<MovieProvidersResponse>(MovieApiRoutes.movieProviders);

      const mappedProviders = movieProvidersFromApi.map((provider) => ({
        _id: provider.provider_id,
        logo: `${IMAGE_BASE_URL}/${provider.logo_path}`,
        name: provider.provider_name,
      }));

      return mappedProviders;
    },
  });

  return {
    movieProviders: movieProviders as ProviderProps[],
    isMovieProvidersLoading,
  };
};
