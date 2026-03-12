import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieImages, MovieImagesProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: `${IMAGE_BASE_URL}${image.file_path}`,
    aspectRatio: image.aspect_ratio,
  }));

export const useEpisodeImages = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const { data: episodeImages, isLoading: isEpisodeImagesLoading } = useQuery({
    queryKey: ['episodeImages', seriesId, seasonNumber, episodeNumber],
    queryFn: async () => {
      const { data } = await moviesApi.get(
        MovieApiRoutes.tvEpisodeImages(seriesId, seasonNumber, episodeNumber)
      );

      return {
        backdrops: mapImages(data.stills),
        logos: [] as MovieImagesProps[],
        posters: [] as MovieImagesProps[],
      };
    },
    enabled: seriesId > 0 && seasonNumber >= 0 && episodeNumber > 0,
  });

  return {
    episodeImages,
    isEpisodeImagesLoading,
  };
};
