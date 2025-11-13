import { castCreditsTable, castDetailsTable, castImagesTable, moviesDb } from '@/expo-sqlite/db';
import {
  CastCreditProps,
  CastCreditsResponse,
  CastDetailsProps,
  CastImageProfileProps,
  CastImagesRecord,
  CastImagesResponse,
} from '@/interfaces';
import { moviesApi } from '@/services';
import { parseJSON } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const useCastDetails = (castId: number) => {
  const { data: castDetails, isLoading: isCastDetailsLoading } = useQuery({
    queryKey: ['castDetails', castId],
    queryFn: async () => {
      const castDetailsFromLocal = await moviesDb
        .select()
        .from(castDetailsTable)
        .where(eq(castDetailsTable.cast_id, castId));

      if (castDetailsFromLocal.length > 0) {
        console.log(`💾 Loaded cast details ${castId} from local DB`);

        const parsedCastDetails = castDetailsFromLocal.map((cast) => ({
          ...cast,
          cast_id: castId,
          also_known_as: parseJSON(cast.also_known_as, []),
        }));

        return parsedCastDetails[0];
      }

      const { data: castDetailsFromApi } = await moviesApi.get(`/person/${castId}`);

      const mappedCast = {
        ...castDetailsFromApi,
        profile_path: `${IMAGE_BASE}/${castDetailsFromApi.profile_path}`,
        also_known_as: JSON.stringify(castDetailsFromApi.also_known_as),
        cast_id: castId,
      };

      await moviesDb.insert(castDetailsTable).values(mappedCast).onConflictDoUpdate({
        target: castDetailsTable.id,
        set: mappedCast,
      });

      return {
        ...mappedCast,
        also_known_as: parseJSON(mappedCast.also_known_as, []),
      };
    },
  });

  const { data: castImages, isLoading: isCastImagesLoading } = useQuery({
    queryKey: ['castImages', castId],
    queryFn: async () => {
      const castImagesFromLocal = await moviesDb
        .select()
        .from(castImagesTable)
        .where(eq(castImagesTable.cast_id, castId));

      if (castImagesFromLocal.length > 0) {
        console.log(`💾 Loaded cast images ${castId} from local DB`);
        return {
          cast_id: castImagesFromLocal[0].cast_id,
          profiles: parseJSON<CastImageProfileProps[]>(castImagesFromLocal[0].profiles, []),
        };
      }

      const {
        data: { profiles: movieImagesFromApi },
      } = await moviesApi.get<{ profiles: CastImageProfileProps[] }>(`/person/${castId}/images`);

      const mappedImages = movieImagesFromApi.map((image) => ({
        width: image.width,
        height: image.height,
        file_path: `${IMAGE_BASE}/${image.file_path}`,
        aspect_ratio: image.aspect_ratio,
      }));

      const newCastImages: CastImagesRecord = {
        cast_id: castId,
        profiles: JSON.stringify(mappedImages),
      };

      await moviesDb.insert(castImagesTable).values(newCastImages);

      return {
        cast_id: castId,
        profiles: mappedImages,
      };
    },
  });

  const { data: castCredits, isLoading: isCastCreditsLoading } = useQuery({
    queryKey: ['castCredits', castId],
    queryFn: async () => {
      const castCreditsFromLocal = await moviesDb
        .select()
        .from(castCreditsTable)
        .where(eq(castCreditsTable.cast_id, castId));

      if (castCreditsFromLocal.length > 0) {
        console.log(`💾 Loaded movie similar ${castId} from local DB`);
        const parsedCredits = castCreditsFromLocal.map((credit) => ({
          ...credit,
          genre_ids: parseJSON(credit.genre_ids, []),
        }));

        return parsedCredits;
      }

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

      for (const credit of mappedCast) {
        await moviesDb.insert(castCreditsTable).values(credit).onConflictDoUpdate({
          target: castCreditsTable.id,
          set: credit,
        });
      }

      return mappedCast.map((credit) => ({
        ...credit,
        genre_ids: parseJSON(credit.genre_ids, []),
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
