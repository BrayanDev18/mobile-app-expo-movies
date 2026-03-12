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

export const useSeriesImages = (seriesId: number) => {
  const language = Localization.getLocales()[0]?.languageCode ?? 'en';

  const { data: seriesImages, isLoading: isSeriesImagesLoading } = useQuery({
    queryKey: ['seriesImages', seriesId],
    queryFn: async () => {
      const { data } = await moviesApi.get(`/tv/${seriesId}/images`, {
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
    seriesImages,
    isSeriesImagesLoading,
  };
};
