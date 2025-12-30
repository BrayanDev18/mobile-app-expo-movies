import { MovieReviewProps, MovieReviewsResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieReview = (movieId: number) => {
  const { data: movieReviews, isLoading: isMovieReviewsLoading } = useQuery({
    queryKey: ['movieReviews', movieId],
    queryFn: async () => {
      const {
        data: { results: movieReviewFromApi },
      } = await moviesApi.get<MovieReviewsResponse>(`/movie/${movieId}/reviews`);

      const mappedMovieReview = movieReviewFromApi.map((review) => ({
        id: review.id,
        movie_id: movieId,
        author: review.author,
        author_details: review.author_details,
        content: review.content,
        created_at: review.created_at,
        url: review.url,
      }));

      return mappedMovieReview;
    },
  });

  return {
    movieReviews: movieReviews as MovieReviewProps[],
    isMovieReviewsLoading,
  };
};
