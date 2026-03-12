import { Icon, Text } from '@/components';
import { MovieProps, PersonProps } from '@/interfaces';
import { MovieCard } from '@/screens/movie/components';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PersonCard } from './PersonCard';

interface SearchResultsGridProps {
  movies: MovieProps[];
  people: PersonProps[];
  isPeople: boolean;
  isLoading: boolean;
  query: string;
}

export const SearchResultsGrid = ({
  movies,
  people,
  isPeople,
  isLoading,
  query,
}: SearchResultsGridProps) => {
  const handlePress = useCallback((item: MovieProps) => {
    if (item.media_type === 'tv') {
      router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
    } else {
      router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } });
    }
  }, []);

  if (isLoading) return <SearchSkeleton isPeople={isPeople} />;

  if (isPeople) {
    if (!people.length) return <EmptyResults query={query} />;

    return (
      <Animated.View entering={FadeIn.duration(200)} className="flex-1">
        <FlashList
          data={people}
          numColumns={3}
          estimatedItemSize={140}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View className="flex-1 items-center py-2">
              <PersonCard person={item} />
            </View>
          )}
        />
      </Animated.View>
    );
  }

  if (!movies.length) return <EmptyResults query={query} />;

  return (
    <Animated.View entering={FadeIn.duration(200)} className="flex-1">
      <FlashList
        data={movies}
        numColumns={2}
        estimatedItemSize={280}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item.id}-${item.media_type}`}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <View className="flex-1 p-1">
            <MovieCard movie={item} rating={item.rating} onPress={() => handlePress(item)} />
          </View>
        )}
      />
    </Animated.View>
  );
};

const EmptyResults = ({ query }: { query: string }) => (
  <View className="flex-1 items-center justify-center gap-3 pt-20">
    <Icon name="SearchX" size={48} color="rgba(255,255,255,0.15)" />
    <Text className="!text-neutral-400">No results for &ldquo;{query}&rdquo;</Text>
  </View>
);

const SearchSkeleton = ({ isPeople }: { isPeople: boolean }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (isPeople) {
    return (
      <View className="flex-row flex-wrap justify-center gap-4 px-4 pt-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Animated.View key={i} style={pulseStyle} className="items-center gap-2">
            <View className="rounded-full bg-neutral-800" style={{ width: 90, height: 90 }} />
            <View className="h-3 w-16 rounded bg-neutral-800" />
          </Animated.View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3 px-4 pt-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Animated.View
          key={i}
          style={[pulseStyle, { width: '47%', height: 260 }]}
          className="rounded-2xl bg-neutral-800"
        />
      ))}
    </View>
  );
};
