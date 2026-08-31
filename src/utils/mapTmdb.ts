import {
  MovieCast,
  MovieCastProps,
  MovieImages,
  MovieImagesProps,
  MovieReviewProps,
  MovieVideosProps,
  TmdbVideo,
} from '@/interfaces';
import { tmdbImage } from './tmdbImage';

export const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: tmdbImage(image.file_path),
    aspectRatio: image.aspect_ratio,
  }));

export const mapVideos = (results: TmdbVideo[] = []): MovieVideosProps[] =>
  results.map((video) => ({
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    size: video.size ?? 0,
    official: video.official ?? false,
    published_at: video.published_at ?? null,
  }));

export const mapCastMembers = (cast: MovieCast[] = []): MovieCastProps[] =>
  cast.map((member) => ({
    id: member.id,
    name: member.name ?? '',
    character: member.character ?? '',
    avatar: tmdbImage(member.profile_path, 'w342') ?? '',
  }));

export const mapReviews = (results: MovieReviewProps[] = []): MovieReviewProps[] =>
  results.map((review) => ({
    id: review.id,
    author: review.author,
    author_details: review.author_details,
    content: review.content,
    created_at: review.created_at,
    url: review.url,
  }));

export const pickRegion = <T>(
  results: Record<string, T> | undefined,
  region: string
): T | null => results?.[region] ?? results?.US ?? null;

export const pickCertification = <T extends { iso_3166_1: string }>(
  entries: T[] | undefined,
  region: string,
  read: (entry: T) => string | null | undefined
): string | null => {
  const results = entries ?? [];
  const entry =
    results.find((item) => item.iso_3166_1 === region) ??
    results.find((item) => item.iso_3166_1 === 'US');

  return (entry && read(entry)) || null;
};
