import { Loader, Screen, Tab, Text } from '@/components';
import { useMovieCast } from '@/hooks';
import { MovieCastProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastList = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'actors' | 'producers' | 'directors'>('actors');

  const { movieCast, isMovieCastLoading } = useMovieCast(+id);

  const renderItem = useCallback(
    ({ item, index }: { item: MovieCastProps; index: number }) => (
      <CastItem cast={item} index={index} />
    ),
    []
  );

  if (isMovieCastLoading) return <Loader />;

  return (
    <Screen safeAreaEdges={['top', 'bottom']} canGoBack preset="fixed" className="gap-4 px-4">
      <View className="h-full gap-4 pt-14">
        <View className="w-full flex-row gap-2">
          <Tab
            title="Actors"
            isActive={activeTab === 'actors'}
            onPress={() => setActiveTab('actors')}
            adaptableWidth
          />

          <Tab
            title="Producers"
            isActive={activeTab === 'producers'}
            onPress={() => setActiveTab('producers')}
            adaptableWidth
          />

          <Tab
            title="directors"
            isActive={activeTab === 'directors'}
            onPress={() => setActiveTab('directors')}
            adaptableWidth
          />
        </View>

        <View className="flex-1">
          <FlashList
            data={movieCast}
            scrollEventThrottle={16}
            removeClippedSubviews
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => `${item.id}`}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>
      </View>
    </Screen>
  );
};

export default CastList;

const CastItem = ({ cast, index }: { cast: MovieCastProps; index: number }) => {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(50 * index).springify()}
      onPress={() => router.push(`/movie/cast/${cast.id}`)}
      className="flex-row items-center justify-between rounded-xl bg-neutral-800 p-2.5">
      <View className="flex-row items-center gap-x-3">
        <Image
          source={{ uri: cast.profile_path as string }}
          style={{ width: 62, height: 62, borderRadius: 8 }}
          cachePolicy="memory-disk"
        />

        <View className="gap-1.5">
          <Text className="!text-lg font-medium">{cast.name}</Text>

          <Text className="!text-[14.5px] font-normal !text-neutral-400">{cast.character}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" color="#757575" size={22} />
    </AnimatedPressable>
  );
};
