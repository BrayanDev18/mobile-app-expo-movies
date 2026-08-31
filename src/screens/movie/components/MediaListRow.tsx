import { Text, TmdbImage } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { Pressable, View } from 'react-native';

interface MediaListRowProps {
  movie: MovieProps;
  rank?: number;
}

const RATING_DOTS = [1, 2, 3, 4, 5];

export const MediaListRow = ({ movie, rank }: MediaListRowProps) => {
  const year = movie.releaseDate?.slice(0, 4);
  const mediaLabel = movie.mediaType === 'tv' ? 'Series' : 'Movie';
  const activeDots = Math.round(movie.rating / 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${movie.title}`}
      className="flex-row items-center py-3"
      onPress={() => openMediaDetails(movie)}>
      {rank !== undefined && (
        <Text
          className="!text-[32px] font-black !text-white/25"
          style={{ width: rank >= 10 ? 58 : 42, lineHeight: 36 }}>
          {rank}
        </Text>
      )}

      <TmdbImage
        path={movie.poster}
        size="w92"
        style={{ width: 62, height: 72, borderRadius: 8 }}
        contentFit="cover"
        accessibilityLabel={`${movie.title} poster`}
      />

      <View className="ml-4 flex-1 gap-2">
        <Text numberOfLines={1} className="!text-md font-bold">
          {movie.title}
        </Text>

        <Text numberOfLines={1} className="mt-0.5 !text-sm !text-neutral-400">
          {[year, mediaLabel].filter(Boolean).join(' · ')}
        </Text>
      </View>

      <View className="items-end gap-1.5">
        <Text className="!text-[13px] font-black">{movie.rating.toFixed(1)}</Text>

        <View className="flex-row gap-1">
          {RATING_DOTS.map((dot) => (
            <View
              key={dot}
              className={dot <= activeDots ? 'bg-white' : 'bg-white/20'}
              style={{ width: 4, height: 4, borderRadius: 2 }}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
};
