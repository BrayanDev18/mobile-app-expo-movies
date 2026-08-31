import { MediaType, MovieImages, MovieImagesProps } from '@/interfaces';
import { tmdbImage } from '@/utils';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

import * as Localization from 'expo-localization';

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: tmdbImage(image.file_path),
    aspectRatio: image.aspect_ratio,
  }));

export const useMovieImages = (movieId: number, mediaType: MediaType = 'movie') => {
  const language = Localization.getLocales()[0]?.languageCode ?? 'en';

  const { data: movieImages, isLoading: isMovieImagesLoading } = useQuery({
    queryKey: ['movieImages', mediaType, movieId],
    queryFn: async () => {
      const { data } = await moviesApi.get(`/${mediaType}/${movieId}/images`, {
        params: { language },
      });

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
