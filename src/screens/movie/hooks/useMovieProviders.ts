import { movieProvidersTable, moviesDb } from '@/expo-sqlite/db';
import { MovieProvidersProps, MovieProvidersResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const useMovieProviders = () => {
  const { data: movieProviders, isLoading: isMovieProvidersLoading } = useQuery({
    queryKey: ['movieProviders'],
    queryFn: async () => {
      const movieProvidersFromLocal = await moviesDb
        .select()
        .from(movieProvidersTable)

      if (movieProvidersFromLocal.length > 0) {
        console.log(`💾 Loaded movie providers from local DB`);
        return movieProvidersFromLocal;
      }

      const {
        data: { results: movieProvidersFromApi },
      } = await moviesApi.get<MovieProvidersResponse>('/watch/providers/movie');

      const mappedProviders = movieProvidersFromApi.map((provider) => ({
        provider_id: provider.provider_id,
        logo_path: `${IMAGE_BASE}/${provider.logo_path}`,
        provider_name: provider.provider_name
      }));

      for (const provider of mappedProviders) {
        await moviesDb.insert(movieProvidersTable).values(provider);
      }

      return mappedProviders;
    },
  });

  return {
    movieProviders: movieProviders as MovieProvidersProps[],
    isMovieProvidersLoading,
  };
};
