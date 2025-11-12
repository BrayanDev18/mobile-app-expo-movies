import { movieReviewsTable, moviesDb } from '@/expo-sqlite/db';
import { MovieReviewProps, MovieReviewsResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { parseJSON } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useMovieReview = (movieId: number) => {
  const { data: movieReviews, isLoading: isMovieReviewsLoading } = useQuery({
    queryKey: ['movieReviews', movieId],
    queryFn: async () => {
      const movieReviewsFromLocal = await moviesDb
        .select()
        .from(movieReviewsTable)
        .where(eq(movieReviewsTable.movie_id, movieId));

      if (movieReviewsFromLocal.length > 0) {
        const parsedReviews = movieReviewsFromLocal.map((review) => ({
          ...review,
          movie_id: movieId,
          author_details: parseJSON(review.author_details, []),
        }));

        console.log(`💾 Loaded movie reviews ${movieId} from local DB`);

        return parsedReviews;
      }

      const {
        data: { results: movieReviewFromApi },
      } = await moviesApi.get<MovieReviewsResponse>(`/movie/${movieId}/reviews`);

      const mappedMovieReview = movieReviewFromApi.map((review) => ({
        id: review.id,
        movie_id: movieId,
        author: review.author,
        author_details: JSON.stringify(review.author_details),
        content: review.content,
        created_at: review.created_at,
        url: review.url,
      }));

      for (const review of mappedMovieReview) {
        await moviesDb.insert(movieReviewsTable).values(review);
      }

      return mappedMovieReview;
    },
  });

  return {
    movieReviews: movieReviews as MovieReviewProps[],
    isMovieReviewsLoading,
  };
};
