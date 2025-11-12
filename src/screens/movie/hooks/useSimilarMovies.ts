import { moviesDb, similarMoviesTable } from '@/expo-sqlite/db';
import { SimilarMoviesProps, SimilarMoviesResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useSimilarMovies = (movieId: number) => {
  const { data: similarMovies, isLoading: isSimilarMoviesLoading } = useQuery({
    queryKey: ['movieSimilar', movieId],
    queryFn: async () => {
      const similarMoviesFromLocal = await moviesDb
        .select()
        .from(similarMoviesTable)
        .where(eq(similarMoviesTable.movie_id, movieId));

      if (similarMoviesFromLocal.length > 0) {
        console.log(`💾 Loaded movie similar ${movieId} from local DB`);
        return similarMoviesFromLocal;
      }

      const {
        data: { results: similarMoviesFromApi },
      } = await moviesApi.get<SimilarMoviesResponse>(`/movie/${movieId}/similar`);

      const mappedSimilarMovies = similarMoviesFromApi.map((similar) => {
        return {
          id: similar.id,
          title: similar.title,
          poster_path: `https://image.tmdb.org/t/p/w500${similar.poster_path}`,
          release_date: similar.release_date,
          movie_id: movieId,
        };
      });

      for (const similar of mappedSimilarMovies) {
        await moviesDb.insert(similarMoviesTable).values(similar).onConflictDoUpdate({
          target: similarMoviesTable.id,
          set: similar,
        });
      }

      return mappedSimilarMovies;
    },
  });

  return {
    similarMovies: similarMovies as SimilarMoviesProps[],
    isSimilarMoviesLoading,
  };
};
