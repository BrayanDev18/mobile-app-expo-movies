import {
  CastCreditProps,
  CastCreditsResponse,
  CastDetailsProps,
  CastImageProfileProps,
  CastImagesResponse,
} from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const useCastDetails = (castId: number) => {
  const { data: castDetails, isLoading: isCastDetailsLoading } = useQuery({
    queryKey: ['castDetails', castId],
    queryFn: async () => {
      const { data: castDetailsFromApi } = await moviesApi.get(`/person/${castId}`);

      const mappedCast = {
        ...castDetailsFromApi,
        profile_path: `${IMAGE_BASE}/${castDetailsFromApi.profile_path}`,
        also_known_as: JSON.stringify(castDetailsFromApi.also_known_as),
        cast_id: castId,
      };

      return {
        ...mappedCast,
        also_known_as: mappedCast.also_known_as,
      };
    },
  });

  const { data: castImages, isLoading: isCastImagesLoading } = useQuery({
    queryKey: ['castImages', castId],
    queryFn: async () => {
      const {
        data: { profiles: movieImagesFromApi },
      } = await moviesApi.get<{ profiles: CastImageProfileProps[] }>(`/person/${castId}/images`);

      const mappedImages = movieImagesFromApi.map((image) => ({
        width: image.width,
        height: image.height,
        file_path: `${IMAGE_BASE}/${image.file_path}`,
        aspect_ratio: image.aspect_ratio,
      }));

      return {
        cast_id: castId,
        profiles: mappedImages,
      };
    },
  });

  const { data: castCredits, isLoading: isCastCreditsLoading } = useQuery({
    queryKey: ['castCredits', castId],
    queryFn: async () => {
      const {
        data: { cast: castCreditsFromApi },
      } = await moviesApi.get<CastCreditsResponse>(`/person/${castId}/movie_credits`);

      const mappedCast = castCreditsFromApi.map((cast) => ({
        ...cast,
        backdrop_path: `${IMAGE_BASE}/${cast.backdrop_path}`,
        poster_path: `${IMAGE_BASE}/${cast.poster_path}`,
        genre_ids: JSON.stringify(cast.genre_ids ?? []),
        cast_id: castId,
      }));

      return mappedCast.map((credit) => ({
        ...credit,
        genre_ids: credit.genre_ids,
      }));
    },
  });

  return {
    castDetails: castDetails as CastDetailsProps,
    isCastDetailsLoading,

    castImages: castImages as CastImagesResponse,
    isCastImagesLoading,

    castCredits: castCredits as CastCreditProps[],
    isCastCreditsLoading,
  };
};
