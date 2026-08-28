import {
  CastCreditProps,
  CastDetailsProps,
  CastImageProfileProps,
  CastImagesResponse,
  PersonSocialLinkProps,
} from '@/interfaces';
import { moviesApi } from '@/services';
import { tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';

interface PersonCreditItem {
  id: number;
  title?: string;
  character?: string | null;
  job?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  popularity?: number;
  [key: string]: unknown;
}

interface PersonFullResponse extends Omit<CastDetailsProps, 'cast_id'> {
  movie_credits?: { cast: PersonCreditItem[]; crew: PersonCreditItem[] };
  images?: { profiles: CastImageProfileProps[] };
  external_ids?: {
    instagram_id?: string | null;
    twitter_id?: string | null;
    facebook_id?: string | null;
    tiktok_id?: string | null;
  };
}

const mapSocials = (ids?: PersonFullResponse['external_ids']): PersonSocialLinkProps[] => {
  if (!ids) return [];

  const links: (PersonSocialLinkProps | null)[] = [
    ids.instagram_id
      ? {
          key: 'instagram',
          icon: 'logo-instagram',
          label: 'Instagram',
          url: `https://www.instagram.com/${ids.instagram_id}`,
        }
      : null,
    ids.twitter_id
      ? { key: 'x', icon: 'logo-twitter', label: 'X', url: `https://x.com/${ids.twitter_id}` }
      : null,
    ids.facebook_id
      ? {
          key: 'facebook',
          icon: 'logo-facebook',
          label: 'Facebook',
          url: `https://www.facebook.com/${ids.facebook_id}`,
        }
      : null,
    ids.tiktok_id
      ? {
          key: 'tiktok',
          icon: 'logo-tiktok',
          label: 'TikTok',
          url: `https://www.tiktok.com/@${ids.tiktok_id}`,
        }
      : null,
  ];

  return links.filter((link): link is PersonSocialLinkProps => !!link);
};

// Merge acting + crew credits into a single filmography (one entry per movie)
const mapFilmography = (
  credits: PersonFullResponse['movie_credits'],
  castId: number
): CastCreditProps[] => {
  const seen = new Set<number>();

  return [...(credits?.cast ?? []), ...(credits?.crew ?? [])]
    .filter((item) => {
      if (!item.poster_path || seen.has(item.id)) return false;

      seen.add(item.id);
      return true;
    })
    .sort((a, b) => (b.release_date ?? '').localeCompare(a.release_date ?? ''))
    .map(
      (item) =>
        ({
          ...item,
          character: item.character ?? item.job ?? '',
          poster_path: tmdbImage(item.poster_path),
          backdrop_path: tmdbImage(item.backdrop_path),
          genre_ids: item.genre_ids ?? [],
          cast_id: castId,
        }) as unknown as CastCreditProps
    );
};

export const useCastDetails = (castId: number) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['castFull', castId],
    enabled: !!castId,
    queryFn: async () => {
      const { data } = await moviesApi.get<PersonFullResponse>(`/person/${castId}`, {
        params: { append_to_response: 'movie_credits,images,external_ids' },
      });

      return {
        details: {
          ...data,
          profile_path: tmdbImage(data.profile_path, 'w342'),
          cast_id: castId,
        } as unknown as CastDetailsProps,
        images: {
          cast_id: castId,
          profiles: (data.images?.profiles ?? []).map((image) => ({
            ...image,
            file_path: tmdbImage(image.file_path) as string,
          })),
        } as CastImagesResponse,
        credits: mapFilmography(data.movie_credits, castId),
        socials: mapSocials(data.external_ids),
      };
    },
  });

  return {
    castDetails: data?.details as CastDetailsProps,
    castImages: data?.images as CastImagesResponse,
    castCredits: data?.credits ?? [],
    socials: data?.socials ?? [],
    isLoading,
    isError,
    refetch,
  };
};
