import { FlashList, SectionTitle, Text } from '@/components';
import { EXPLORE_COLLECTIONS } from '@/constants';
import { useCollections } from '@/hooks';
import { CollectionProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openCollection, tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const CARD_WIDTH = 280;

interface CollectionsRowProps {
  title?: string;
}

export const CollectionsRow = ({ title }: CollectionsRowProps) => {
  const { collections } = useCollections(EXPLORE_COLLECTIONS);

  const renderItem = useCallback(
    ({ item }: { item: CollectionProps }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View the ${item.name} saga`}
        onPress={() => openCollection(item.id)}>
        <View style={{ width: CARD_WIDTH }}>
          <Image
            source={{ uri: tmdbImage(item.backdrop, 'w780') ?? undefined }}
            style={{ width: CARD_WIDTH, aspectRatio: 1.78, borderRadius: 12 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={IMAGE_PLACEHOLDER}
            accessibilityLabel={`${item.name} backdrop`}
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
          />

          <View className="absolute bottom-0 w-full gap-0.5 p-3">
            <Text numberOfLines={1} className="!text-md font-bold">
              {item.name}
            </Text>

            <Text className="!text-[11px] !text-neutral-400">{item.parts.length} movies</Text>
          </View>
        </View>
      </Pressable>
    ),
    []
  );

  if (!collections.length) return null;

  return (
    <View className="gap-3 px-4">
      {title && <SectionTitle title={title} className="px-1" />}

      <FlashList
        horizontal
        data={collections}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
