import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openMediaDetails, tmdbResize } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
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

        <Image
          source={{ uri: tmdbResize(item.poster, 'w342') ?? undefined }}
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            borderRadius: 12,
            marginLeft: -6,

          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
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
