import { Text } from '@/components';
import { IMAGE_PLACEHOLDER, openCollection, tmdbImage } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

interface MovieCollectionBannerProps {
  collection: { id: number; name: string; backdrop: string | null };
}

export const MovieCollectionBanner = ({ collection }: MovieCollectionBannerProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`View ${collection.name}`}
    onPress={() => openCollection(collection.id)}>
    <View className="overflow-hidden rounded-2xl border border-white/10">
      <Image
        source={{ uri: tmdbImage(collection.backdrop, 'w780') ?? undefined }}
        style={{ width: '100%', height: 110 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        contentPosition="top center"
        placeholder={IMAGE_PLACEHOLDER}
        accessibilityLabel={`${collection.name} backdrop`}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} className="flex-row items-center justify-between px-4">
        <View className="flex-1 gap-2 pr-3">
          <Text className="text-md! !text-neutral-300">Part of</Text>

          <Text numberOfLines={1} className="!text-lg font-bold">
            {collection.name}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  </Pressable>
);
