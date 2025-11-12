import { movieImagesTable, moviesDb } from '@/expo-sqlite/db';
import { MovieImagesProps, MovieImagesResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const useMovieImages = (movieId: number) => {
  const { data: movieImages, isLoading: isMovieImagesLoading } = useQuery({
    queryKey: ['movieImages', movieId],
    queryFn: async () => {
      const movieImagesFromLocal = await moviesDb
        .select()
        .from(movieImagesTable)
        .where(eq(movieImagesTable.movie_id, movieId));

      if (movieImagesFromLocal.length > 0) {
        console.log(`💾 Loaded movie similar ${movieId} from local DB`);
        return movieImagesFromLocal;
      }

      const {
        data: { backdrops: movieImagesFromApi },
      } = await moviesApi.get<MovieImagesResponse>(`/movie/${movieId}/images`, {
        params: {
          language: 'en',
        },
      });

      const mappedImages = movieImagesFromApi.map((image) => ({
        file_path: `${IMAGE_BASE}/${image.file_path}`,
        aspect_ratio: image.aspect_ratio,
        movie_id: movieId,
      }));

      for (const image of mappedImages) {
        await moviesDb.insert(movieImagesTable).values(image);
      }

      return mappedImages;
    },
  });

  return {
    movieImages: movieImages as MovieImagesProps[],
    isMovieImagesLoading,
  };
};
