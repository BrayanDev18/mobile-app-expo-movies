import { IMAGE_BASE_URL } from '@/constants';
import { MovieImages, MovieImagesProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

import * as Localization from 'expo-localization';

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: `${IMAGE_BASE_URL}${image.file_path}`,
    aspectRatio: image.aspect_ratio,
  }));

export const useMovieImages = (movieId: number) => {
  const language = Localization.getLocales()[0]?.languageCode ?? 'en';

  const { data: movieImages, isLoading: isMovieImagesLoading } = useQuery({
    queryKey: ['movieImages', movieId],
    queryFn: async () => {
      const { data } = await moviesApi.get(`/movie/${movieId}/images`, {
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
