import { moviesDb, movieWatchProvidersTable } from '@/expo-sqlite/db';
import { moviesApi } from '@/services';
import { parseJSON } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import * as Localization from 'expo-localization';

interface MovieWatchProvidersProps {
  id: number;
  results: string;
}

export const useMovieWatchProviders = (movieId: number) => {
  const region = Localization.getLocales()[0].regionCode ?? 'US';

  const { data: movieWatchProviders, isLoading: isMovieWatchProviders } = useQuery({
    queryKey: ['movieWatchProviders', movieId],
    queryFn: async () => {
      const MovieWatchProvidersFromLocal = moviesDb
        .select()
        .from(movieWatchProvidersTable)
        .where(eq(movieWatchProvidersTable.movie_id, movieId))
        .get();

      if (MovieWatchProvidersFromLocal?.results) {
        const parsed = parseJSON(MovieWatchProvidersFromLocal.results, []);

        return parsed[region as any];
      }

      const { data } = await moviesApi.get<MovieWatchProvidersProps>(
        `/movie/${movieId}/watch/providers`
      );

      const newWatchProviders = {
        movie_id: movieId,
        results: JSON.stringify(data.results),
      };

      await moviesDb.insert(movieWatchProvidersTable).values(newWatchProviders).onConflictDoUpdate({
        target: movieWatchProvidersTable.movie_id,
        set: newWatchProviders,
      });

      return data.results[region as any];
    },
  });

  return { movieWatchProviders, isMovieWatchProviders };
};
