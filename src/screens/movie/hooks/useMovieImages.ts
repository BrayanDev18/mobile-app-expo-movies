import { MediaType, MovieImages, MovieImagesProps } from '@/interfaces';
import { tmdbImage } from '@/utils';
import { moviesApi, tmdbImageLanguages } from '@/services';
import { useQuery } from '@tanstack/react-query';

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: tmdbImage(image.file_path),
    aspectRatio: image.aspect_ratio,
  }));

interface MediaImagesResponse {
  backdrops: MovieImages[];
  logos: MovieImages[];
  posters: MovieImages[];
}

export const useMovieImages = (movieId: number, mediaType: MediaType = 'movie') => {
  const { data: movieImages, isLoading: isMovieImagesLoading } = useQuery({
    queryKey: ['movieImages', mediaType, movieId],
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

  return {
    movieImages: movieImages,
    isMovieImagesLoading,
  };
};
