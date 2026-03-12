import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { formatSpecialDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, TouchableHighlight, View } from 'react-native';

export const SeriesSimilar = ({
  seriesId,
  similarSeries,
}: {
  seriesId: number;
  similarSeries: MovieProps[];
}) => {
  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => <SimilarSeriesItem series={item} />,
    []
  );

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Similar Series</Text>

        {similarSeries.length > 5 ? (
          <TouchableHighlight
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040">
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

      <FlashList
        horizontal
        data={similarSeries.slice(0, 5)}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};

const SimilarSeriesItem = ({ series }: { series: MovieProps }) => (
  <Pressable
    onPress={() =>
      router.push({
        pathname: '/(root)/series/[id]',
        params: { id: series.id },
      })
    }
    accessibilityRole="button"
    accessibilityLabel={`View details for ${series.title}`}
    className="w-[168px] gap-2 rounded-bl-2xl rounded-br-2xl bg-neutral-950/30">
    <Image
      source={{ uri: series.poster as string }}
      style={{
        width: '100%',
        height: 205,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      }}
      contentFit="cover"
      cachePolicy="memory-disk"
    />

    <View className="gap-1 p-2">
      <Text numberOfLines={1} className="!text-md font-semibold">
        {series.title}
      </Text>

      {series.releaseDate && (
        <Text className="!text-neutral-400">{formatSpecialDate(series.releaseDate)}</Text>
      )}
    </View>
  </Pressable>
);
