import { Button, Icon, IconName, Tab, Text } from '@/components';
import { MediaType, MyListFlag, SavedMediaProps } from '@/interfaces';
import { useMyListStore } from '@/stores';
import { IMAGE_PLACEHOLDER, openMediaDetails, tmdbResize } from '@/utils';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ListFilter = 'all' | MediaType;

const FILTERS: { key: ListFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movie', label: 'Movies' },
  { key: 'tv', label: 'Series' },
];

const LISTS: {
  key: MyListFlag;
  label: string;
  removeIcon: IconName;
  emptyMessage: string;
}[] = [
  {
    key: 'watchlist',
    label: 'Watchlist',
    removeIcon: 'BookmarkMinus',
    emptyMessage: 'Titles you want to watch will show up here.',
  },
  {
    key: 'watched',
    label: 'Watched',
    removeIcon: 'EyeOff',
    emptyMessage: 'Mark titles as watched to keep track of them here.',
  },
  {
    key: 'favorite',
    label: 'Favorites',
    removeIcon: 'HeartOff',
    emptyMessage: 'Your favorite titles will live here.',
  },
];

const MyListRow = ({ movie, removeIcon, onRemove }: {
  movie: SavedMediaProps;
  removeIcon: IconName;
  onRemove: () => void;
}) => {
  const year = movie.releaseDate?.slice(0, 4);
  const mediaLabel = movie.mediaType === 'tv' ? 'Series' : 'Movie';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${movie.title}`}
      className="flex-row items-center py-3"
      onPress={() => openMediaDetails(movie)}>
      <Image
        source={{ uri: tmdbResize(movie.poster, 'w92') ?? undefined }}
        style={{ width: 52, height: 68, borderRadius: 12 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={IMAGE_PLACEHOLDER}
        accessibilityLabel={`${movie.title} poster`}
      />

      <View className="ml-4 flex-1">
        <Text numberOfLines={1} className="!text-md font-bold">
          {movie.title}
        </Text>

        <Text numberOfLines={1} className="mt-0.5 !text-[11px] !text-neutral-400">
          {[year, mediaLabel].filter(Boolean).join(' · ')}
        </Text>

        {movie.userRating ? (
          <View className="mt-1 flex-row items-center gap-1">
            <Star size={11} color="#FACC15" fill="#FACC15" />

            <Text className="!text-[11px] font-semibold !text-neutral-300">
              {movie.userRating}/10
            </Text>
          </View>
        ) : null}
      </View>

      <Icon
        name={removeIcon}
        size={20}
        color="rgba(255,255,255,0.55)"
        className="h-11 w-11 items-center justify-center"
        accessibilityLabel={`Remove ${movie.title} from this list`}
        onPress={onRemove}
      />
    </Pressable>
  );
};

const MyListScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { items, toggleFlag } = useMyListStore();
  const [activeList, setActiveList] = useState<MyListFlag>('watchlist');
  const [filter, setFilter] = useState<ListFilter>('all');

  const list = LISTS.find((item) => item.key === activeList) ?? LISTS[0];
  const listItems = items.filter((item) => item[activeList]);

  const hasMovies = listItems.some((item) => (item.mediaType ?? 'movie') === 'movie');
  const hasSeries = listItems.some((item) => item.mediaType === 'tv');
  const showFilters = hasMovies && hasSeries;

  const filtered =
    filter === 'all' || !showFilters
      ? listItems
      : listItems.filter((item) => (item.mediaType ?? 'movie') === filter);

  const backdrop = (listItems[0] ?? items[0])?.poster;

  const onRemove = (movie: SavedMediaProps) => {
    Haptics.selectionAsync();
    toggleFlag(movie, activeList);
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {backdrop && (
        <Image
          source={{ uri: tmdbResize(backdrop, 'w185') ?? undefined }}
          blurRadius={50}
          style={StyleSheet.absoluteFill}
        />
      )}

      {backdrop && (
        <LinearGradient
          colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)', 'rgba(6,6,6,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {items.length === 0 ? (
        <View
          style={{ paddingTop: top }}
          className="flex-1 items-center justify-center gap-3 px-10">
          <Icon name="Bookmark" size={48} color="rgba(255,255,255,0.3)" />

          <Text className="!text-lg font-bold">Nothing saved yet</Text>

          <Text className="text-center !text-neutral-400">
            Add titles to your watchlist, mark them watched, or favorite them from any detail
            screen.
          </Text>

          <View className="mt-3 w-full">
            <Button title="Explore titles" onPress={() => router.push('/(root)/(tabs)/explore')} />
          </View>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
          <Animated.View entering={FadeIn.duration(300)}>
            <View className="gap-1 px-4 pb-5">
              <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
                My List
              </Text>

              <Text className="!text-[13px] !text-neutral-400">
                {items.length} {items.length === 1 ? 'title' : 'titles'} saved
              </Text>
            </View>

            <View className="mb-4 flex-row gap-2 px-4">
              {LISTS.map((item) => {
                const count = items.filter((saved) => saved[item.key]).length;

                return (
                  <Tab
                    key={item.key}
                    title={count ? `${item.label} (${count})` : item.label}
                    isActive={activeList === item.key}
                    adaptableWidth
                    className="rounded-full border border-white/15"
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveList(item.key);
                      setFilter('all');
                    }}
                  />
                );
              })}
            </View>

            {showFilters && (
              <View className="mb-6 flex-row gap-2 px-4">
                {FILTERS.map((item) => (
                  <Tab
                    key={item.key}
                    title={item.label}
                    isActive={filter === item.key}
                    adaptableWidth
                    className="rounded-full border border-white/15"
                    onPress={() => {
                      Haptics.selectionAsync();
                      setFilter(item.key);
                    }}
                  />
                ))}
              </View>
            )}

            {listItems.length === 0 ? (
              <Animated.View
                key={activeList}
                entering={FadeIn.duration(250)}
                className="items-center gap-3 px-10 py-16">
                <Icon name="ListX" size={40} color="rgba(255,255,255,0.3)" />

                <Text className="text-center !text-neutral-400">{list.emptyMessage}</Text>
              </Animated.View>
            ) : (
              <View className="px-4">
                {filtered.map((movie, index) => (
                  <Animated.View
                    key={`${movie.mediaType ?? 'movie'}-${movie.id}`}
                    exiting={FadeOut.duration(200)}
                    layout={LinearTransition.springify().damping(30).stiffness(200)}
                    className={index < filtered.length - 1 ? 'border-b border-white/10' : ''}>
                    <MyListRow
                      movie={movie}
                      removeIcon={list.removeIcon}
                      onRemove={() => onRemove(movie)}
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyListScreen;
