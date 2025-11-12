import { movieDetailsTable, moviesDb } from '@/expo-sqlite/db';
import { MovieDetailsProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { formatImagePaths, mapMovieToDb, parseLocalMovie } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useMovieDetails = (movieId: number) => {
  const { data: movieDetails, isLoading: isMovieDetailsLoading } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: async () => {
      const local = moviesDb
        .select()
        .from(movieDetailsTable)
        .where(eq(movieDetailsTable.id, movieId))
        .get();

      if (local) {
        console.log(`💾 Loaded movie ${movieId} from local DB`);
        return parseLocalMovie(local as any);
      }

      const { data } = await moviesApi.get<MovieDetailsProps>(`/movie/${movieId}`);

      const movieToSave = mapMovieToDb(data);

      await moviesDb.insert(movieDetailsTable).values(movieToSave).onConflictDoUpdate({
        target: movieDetailsTable.id,
        set: movieToSave,
      });

      return formatImagePaths(data);
    },
  });

  return {
    movieDetails: movieDetails as MovieDetailsProps,
    isMovieDetailsLoading,
  };
};
