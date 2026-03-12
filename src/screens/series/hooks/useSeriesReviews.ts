import { MovieReviewProps, MovieReviewsResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useSeriesReviews = (seriesId: number) => {
  const { data: seriesReviews, isLoading: isSeriesReviewsLoading } = useQuery({
    queryKey: ['seriesReviews', seriesId],
    queryFn: async () => {
      const {
        data: { results: reviewsFromApi },
      } = await moviesApi.get<MovieReviewsResponse>(`/tv/${seriesId}/reviews`);

      return reviewsFromApi.map((review) => ({
        id: review.id,
        movie_id: seriesId,
        author: review.author,
        author_details: review.author_details,
        content: review.content,
        created_at: review.created_at,
        url: review.url,
      }));
    },
  });

  return {
    seriesReviews: seriesReviews as MovieReviewProps[],
    isSeriesReviewsLoading,
  };
};
