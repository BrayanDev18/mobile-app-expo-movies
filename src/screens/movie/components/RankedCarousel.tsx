import { FlashList, Text, TmdbImage } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';

const POSTER_WIDTH = 150;
const POSTER_HEIGHT = 220;

interface RankedCarouselProps {
  title: string;
  movies: MovieProps[];
}

export const RankedCarousel = ({ title, movies }: RankedCarouselProps) => {
  const renderItem = useCallback(
    ({ item, index }: { item: MovieProps; index: number }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.title}, ranked ${index + 1}`}
        className="flex-row items-end"
        onPress={() => openMediaDetails(item)}>
        <Text
          className="font-black !text-white/25"
          style={{ fontSize: 96, lineHeight: 96, letterSpacing: -6 }}>
          {index + 1}
        </Text>

        <TmdbImage
          path={item.poster}
          size="w342"
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            borderRadius: 12,
            marginLeft: -6,

          }}
          contentFit="cover"
          accessibilityLabel={`${item.title} poster`}
        />
      </Pressable>
    ),
    []
  );

  if (!movies.length) return null;

  return (
    <View className="gap-3">
      <Text className="px-1 !text-[18px] font-semibold">{title}</Text>

      <FlashList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
