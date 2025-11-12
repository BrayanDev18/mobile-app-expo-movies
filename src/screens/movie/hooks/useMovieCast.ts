import { movieCastTable, moviesDb } from '@/expo-sqlite/db';
import { MovieCastProps, MovieCastResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const useMovieCast = (movieId: number) => {
  const { data: movieCast, isLoading: isMovieCastLoading } = useQuery({
    queryKey: ['movieCast', movieId],
    queryFn: async () => {
      const castFromLocal = await moviesDb
        .select()
        .from(movieCastTable)
        .where(eq(movieCastTable.movie_id, movieId));

      if (castFromLocal.length > 0) {
        console.log(`💾 Loaded movie similar ${movieId} from local DB`);
        return castFromLocal;
      }

      const {
        data: { cast: movieCastFromApi },
      } = await moviesApi.get<MovieCastResponse>(`/movie/${movieId}/credits`);

      const mappedCast = movieCastFromApi.map((cast) => ({
        id: cast.id,
        name: cast.name,
        character: cast.character,
        profile_path: `${IMAGE_BASE}/${cast.profile_path}`,
        movie_id: movieId,
      }));

      for (const cast of mappedCast) {
        await moviesDb.insert(movieCastTable).values(cast).onConflictDoUpdate({
          target: movieCastTable.id,
          set: cast,
        });
      }

      return mappedCast;
    },
  });

  return {
    movieCast: movieCast as MovieCastProps[],
    isMovieCastLoading,
  };
};
