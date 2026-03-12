import { Icon, Text } from '@/components';
import { GenreProps, MovieProps } from '@/interfaces';
import { MovieCard } from '@/screens/movie/components';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SORT_OPTIONS = [
  { key: 'popularity.desc', label: 'Popular' },
  { key: 'vote_average.desc', label: 'Top Rated' },
  { key: 'primary_release_date.desc', label: 'Newest' },
  { key: 'original_title.asc', label: 'A-Z' },
];

interface DiscoverSectionProps {
  genres: GenreProps[];
  activeGenre: number | null;
  sortBy: string;
  onGenreChange: (genreId: number | null) => void;
  onSortChange: (sort: string) => void;
  movies: MovieProps[];
  isLoading: boolean;
  mediaType: 'movie' | 'tv';
}

export const DiscoverSection = ({
  genres,
  activeGenre,
  sortBy,
  onGenreChange,
  onSortChange,
  movies,
  isLoading,
  mediaType,
}: DiscoverSectionProps) => {
  const handlePress = useCallback(
    (item: MovieProps) => {
      if (mediaType === 'tv') {
        router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
      } else {
        router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } });
      }
    },
    [mediaType]
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify().damping(30).stiffness(200)}
      className="gap-4">
      <View className="gap-3">
        <View className="flex-row items-center gap-2 px-4">
          <Icon name="Compass" size={18} color="#3B82F6" />
          <Text className="!text-lg font-bold">Discover</Text>
          {activeGenre && (
            <Pressable
              onPress={() => onGenreChange(null)}
              accessibilityRole="button"
              accessibilityLabel="Clear genre filter"
              className="ml-auto rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <Text className="text-xs !text-neutral-400">Clear</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {genres.map((genre) => {
            const isActive = genre.id === activeGenre;
            return (
              <Pressable
                key={genre.id}
                onPress={() => onGenreChange(isActive ? null : genre.id)}
                accessibilityRole="button"
                accessibilityLabel={genre.name}
                style={{
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: isActive ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                }}>
                <Text
                  className="text-sm font-medium"
                  style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.6)' }}>
                  {genre.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {activeGenre && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {SORT_OPTIONS.map((option) => {
            const isActive = option.key === sortBy;
            return (
              <Pressable
                key={option.key}
                onPress={() => onSortChange(option.key)}
                accessibilityRole="button"
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 50,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                }}>
                <Text
                  className="text-xs font-medium"
                  style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {activeGenre && (
        <View style={{ minHeight: 300 }}>
          {isLoading ? (
            <DiscoverSkeleton />
          ) : !movies?.length ? (
            <View className="items-center gap-3 py-12">
              <Icon name="Film" size={48} color="rgba(255,255,255,0.15)" />
              <Text className="!text-neutral-400">No results for this genre</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2 px-4">
              {movies.map((movie) => (
                <View key={movie.id} style={{ width: '48%' }}>
                  <MovieCard movie={movie} rating={movie.rating} onPress={() => handlePress(movie)} />
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const DiscoverSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="flex-row flex-wrap gap-3 px-4">
      {[0, 1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={[pulseStyle, { width: '47%', height: 260 }]}
          className="rounded-2xl bg-neutral-800"
        />
      ))}
    </View>
  );
};
