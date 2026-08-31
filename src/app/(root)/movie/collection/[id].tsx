import { Loader, Screen, Text } from '@/components';
import { useCollection } from '@/hooks';
import { MediaListRow } from '@/screens/movie/components';
import { IMAGE_PLACEHOLDER, tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const CollectionScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { collection, isLoading } = useCollection(id ? +id : undefined);

  if (isLoading) return <Loader />;
  if (!collection) return null;

  const years = collection.parts
    .map((part) => part.releaseDate?.slice(0, 4))
    .filter(Boolean) as string[];
  const yearRange = years.length ? `${years[0]}–${years[years.length - 1]}` : '';

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 56, paddingBottom: 40, paddingHorizontal: 16 }}>
        <Animated.View entering={FadeIn.duration(300)}>
          <View>
            <Image
              source={{ uri: tmdbImage(collection.backdrop, 'w780') ?? undefined }}
              style={{ width: '100%', aspectRatio: 1.78, borderRadius: 24 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={IMAGE_PLACEHOLDER}
              accessibilityLabel={`${collection.name} backdrop`}
            />

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              start={{ x: 0, y: 0.3 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />

            <View className="absolute bottom-0 w-full gap-0.5 p-4">
              <Text
                accessibilityRole="header"
                numberOfLines={2}
                className="!text-2xl font-bold leading-tight">
                {collection.name}
              </Text>

              <Text className="!text-[13px] !text-neutral-400">
                {[`${collection.parts.length} movies`, yearRange].filter(Boolean).join(' · ')}
              </Text>
            </View>
          </View>

          {collection.overview ? (
            <Text numberOfLines={4} className="mt-4 !text-md !text-neutral-400">
              {collection.overview}
            </Text>
          ) : null}

          <View className="mt-6">
            {collection.parts.map((part, index) => (
              <View
                key={part.id}
                className={index < collection.parts.length - 1 ? 'border-b border-white/10' : ''}>
                <MediaListRow movie={part} />
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
};

export default CollectionScreen;
