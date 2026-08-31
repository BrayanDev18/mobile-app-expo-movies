import { IMAGE_PLACEHOLDER, tmdbImage, TmdbImageSize } from '@/utils';
import { Image, ImageProps } from 'expo-image';

interface TmdbImageProps extends Omit<ImageProps, 'source' | 'placeholder'> {
  path?: string | null;
  size?: TmdbImageSize;
}

export const TmdbImage = ({ path, size = 'w342', ...rest }: TmdbImageProps) => (
  <Image
    source={{ uri: tmdbImage(path, size) ?? undefined }}
    placeholder={IMAGE_PLACEHOLDER}
    cachePolicy="memory-disk"
    {...rest}
  />
);
