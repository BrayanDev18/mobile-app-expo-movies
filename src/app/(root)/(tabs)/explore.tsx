import { Input, Tab, Text } from '@/components';
import { useDebouncedValue, useSearchMulti, useTrending } from '@/hooks';
import {
  CollectionsRow,
  DecadeChips,
  GenreChips,
  MediaListRow,
  MovieHorizontalList,
  PeopleHorizontalList,
  ProviderGrid,
  RankedList,
} from '@/screens/movie/components';
import { useRecentSearchesStore } from '@/stores';
import { tmdbResize } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ExploreScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { control, setValue } = useForm({ defaultValues: { search: '' } });
  const search = useWatch({ control, name: 'search' });
  const query = useDebouncedValue(search);

  const { media, people, isSearching, hasQuery } = useSearchMulti(query);
  const { trending: topPicks } = useTrending('movie', 'day');
  const { trending: trendingAll } = useTrending('all', 'week');
  const { searches, addSearch, clearSearches } = useRecentSearchesStore();

  const rankedTrending = trendingAll.slice(0, 5);
  const showEmptyState = hasQuery && !isSearching && !media.length && !people.length;
  const backdrop = (rankedTrending[0] ?? topPicks[0])?.poster;

  return (
    <View className="flex-1 bg-neutral-900">
      {backdrop && (
        <Image
          source={{ uri: tmdbResize(backdrop, 'w185') ?? undefined }}
          blurRadius={50}
          style={StyleSheet.absoluteFill}
        />
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)', 'rgba(6,6,6,0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
        <View className="px-4 pb-5">
          <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
            Explore
          </Text>
        </View>

        <View className="mb-8 gap-3">
          <View className="px-4">
            <Input
              iconName="Search"
              name="search"
              control={control}
              placeholder="Search movies, series, people…"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => addSearch(search)}
            />
          </View>

          {!hasQuery && searches.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center gap-2 px-4">
                {searches.map((term) => (
                  <Tab
                    key={term}
                    title={term}
                    isActive={false}
                    adaptableWidth
                    className="rounded-full border border-white/15"
                    onPress={() => setValue('search', term)}
                  />
                ))}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear recent searches"
                  className="h-11 items-center justify-center px-3"
                  onPress={clearSearches}>
                  <Text className="!text-[13px] !text-neutral-400">Clear</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>

        {hasQuery ? (
          <View className="gap-8 px-4">
            {isSearching && <ActivityIndicator className="py-12" color="rgba(255,255,255,0.6)" />}

            {showEmptyState && (
              <View className="items-center justify-center gap-3 py-12">
                <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.3)" />

                <Text className="!text-neutral-400">No results for “{query.trim()}”</Text>
              </View>
            )}

            {people.length > 0 && <PeopleHorizontalList title="People" people={people} />}

            {media.length > 0 && (
              <View>
                <Text className="px-1 !text-[18px] font-semibold">Movies & Series</Text>

                <View className="mt-2">
                  {media.map((item) => (
                    <View key={`${item.mediaType}-${item.id}`} className="border-b border-white/10">
                      <MediaListRow movie={item} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={{ gap: 32 }}>
            <View className="gap-3">
              <GenreChips />

              <DecadeChips />
            </View>

            {topPicks.length > 0 && (
              <View className="px-4">
                <MovieHorizontalList
                  title="Trending today"
                  movies={topPicks}
                />
              </View>
            )}

            <ProviderGrid title="Browse by service" />

            {rankedTrending.length > 0 && (
              <View className="px-4">
                <RankedList title="Top 5 this week" movies={rankedTrending} />
              </View>
            )}

            <CollectionsRow title="Sagas & collections" />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;
