import { moviesDb, movieVideosTable } from '@/expo-sqlite/db';
import { MovieVideoResponse, MovieVideosProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useMovieVideos = (movieId: number) => {
  const { data: movieVideos, isLoading: isMovieVideosLoading } = useQuery({
    queryKey: ['movieVideos', movieId],
    queryFn: async () => {
      const localVideos = await moviesDb
        .select()
        .from(movieVideosTable)
        .where(eq(movieVideosTable.movie_id, movieId));

      if (localVideos.length > 0) {
        console.log(`💾 Loaded movie videos ${movieId} from local DB`);
        return localVideos;
      }

      const {
        data: { results: videosFromApi },
      } = await moviesApi.get<MovieVideoResponse>(`/movie/${movieId}/videos`);

      const newMovieVideos = videosFromApi.map((video) => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        size: video.size ?? 0,
        official: video.official ?? false,
        published_at: video.published_at ?? null,
        movie_id: movieId,
        last_updated: Math.floor(Date.now() / 1000),
      }));

      for (const video of newMovieVideos) {
        await moviesDb.insert(movieVideosTable).values(video).onConflictDoUpdate({
          target: movieVideosTable.key,
          set: video,
        });
      }

      return newMovieVideos;
    },
  });

  return {
    movieVideos: movieVideos as MovieVideosProps[],
    isMovieVideosLoading,
  };
};
