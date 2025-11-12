import { moviesDb, moviesTable } from '@/expo-sqlite/db';
import { MovieByCategoryProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useMoviesByCategory = (category: string) => {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['movies', category],
    queryFn: async () => {
      const moviesFromLocal = await moviesDb
        .select()
        .from(moviesTable)
        .where(eq(moviesTable.category, category));

      if (moviesFromLocal.length > 0) {
        console.log(`💾 Loaded ${category} from local DB`);
        return moviesFromLocal;
      }

      const {
        data: { results: moviesFromApi },
      } = await moviesApi.get(`/movie/${category}`);

      if (!moviesFromApi || moviesFromApi.length === 0) {
        return [];
      }

      const newMoviesArray = moviesFromApi.map((movie: MovieByCategoryProps) => ({
        id: movie.id,
        adult: movie.adult,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        original_language: movie.original_language,
        vote_average: movie.vote_average,
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        category,
      }));

      for (const movie of newMoviesArray) {
        await moviesDb.insert(moviesTable).values(movie).onConflictDoUpdate({
          target: moviesTable.id,
          set: movie,
        });
      }

      return newMoviesArray;
    },
  });

  return {
    movies: movies as MovieByCategoryProps[],
    isLoading,
  };
};
