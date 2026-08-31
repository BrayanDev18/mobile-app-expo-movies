import { MediaType, MovieImages } from '@/interfaces';
import { moviesApi, tmdbImageLanguages, tmdbKey } from '@/services';
import { mapImages } from '@/utils';
import { useQuery } from '@tanstack/react-query';

interface MediaImagesResponse {
  backdrops: MovieImages[];
  logos: MovieImages[];
  posters: MovieImages[];
}

export const useMovieImages = (movieId: number, mediaType: MediaType = 'movie') => {
  const {
    data: movieImages,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieImages', mediaType, movieId),
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const { data } = await moviesApi.get<MediaImagesResponse>(
        `/${mediaType}/${movieId}/images`,
        { params: { include_image_language: tmdbImageLanguages() } }
      );

      return {
        backdrops: mapImages(data.backdrops),
        logos: mapImages(data.logos),
        posters: mapImages(data.posters),
      };
    },
  });

  return { movieImages, isLoading, isError, refetch };
};
