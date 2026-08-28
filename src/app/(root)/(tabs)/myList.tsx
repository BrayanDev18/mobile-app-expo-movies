import { Button, Icon, Tab, Text } from '@/components';
import { MediaType, MovieProps } from '@/interfaces';
import { useMyListStore } from '@/stores';
import { IMAGE_PLACEHOLDER, tmdbResize } from '@/utils';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

const MyListRow = ({ movie, onRemove }: { movie: MovieProps; onRemove: () => void }) => {
  const year = movie.releaseDate?.slice(0, 4);
  const mediaLabel = movie.mediaType === 'tv' ? 'Series' : 'Movie';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${movie.title}`}
      className="flex-row items-center py-3"
      onPress={() => {
        if (movie.mediaType === 'tv') return;

        router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } });
      }}>
      <Image
        source={{ uri: tmdbResize(movie.poster, 'w92') ?? undefined }}
        style={{ width: 52, height: 68, borderRadius: 12 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={IMAGE_PLACEHOLDER}
        accessibilityLabel={`${movie.title} poster`}
      />

      <View className="ml-4 flex-1">
        <Text numberOfLines={1} className="!text-[15px] font-bold">
          {movie.title}
        </Text>

        <Text numberOfLines={1} className="mt-0.5 !text-[11px] !text-neutral-400">
          {[year, mediaLabel].filter(Boolean).join(' · ')}
        </Text>
      </View>

      <Icon
        name="BookmarkMinus"
        size={20}
        color="rgba(255,255,255,0.55)"
        className="h-11 w-11 items-center justify-center"
        onPress={onRemove}
      />
    </Pressable>
  );
};

const MyListScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { saved, removeSaved } = useMyListStore();
  const [filter, setFilter] = useState<ListFilter>('all');

  const hasMovies = saved.some((item) => (item.mediaType ?? 'movie') === 'movie');
  const hasSeries = saved.some((item) => item.mediaType === 'tv');
  const showFilters = hasMovies && hasSeries;

  const filtered =
    filter === 'all' || !showFilters
      ? saved
      : saved.filter((item) => (item.mediaType ?? 'movie') === filter);

  const backdrop = saved[0]?.poster;

  const onRemove = (movie: MovieProps) => {
    Haptics.selectionAsync();
    removeSaved(movie);
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

      {saved.length === 0 ? (
        <View
          style={{ paddingTop: top }}
          className="flex-1 items-center justify-center gap-3 px-10">
          <Icon name="Bookmark" size={48} color="rgba(255,255,255,0.3)" />

          <Text className="!text-lg font-bold">Nothing saved yet</Text>

          <Text className="text-center !text-neutral-400">
            Tap the bookmark on any movie to keep it here.
          </Text>

          <View className="mt-3 w-full">
            <Button title="Explore movies" onPress={() => router.push('/(root)/(tabs)/explore')} />
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
                {saved.length} {saved.length === 1 ? 'title' : 'titles'} saved
              </Text>
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

            <View className="px-4">
              {filtered.map((movie, index) => (
                <Animated.View
                  key={`${movie.mediaType ?? 'movie'}-${movie.id}`}
                  exiting={FadeOut.duration(200)}
                  layout={LinearTransition.springify().damping(30).stiffness(200)}
                  className={index < filtered.length - 1 ? 'border-b border-white/10' : ''}>
                  <MyListRow movie={movie} onRemove={() => onRemove(movie)} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyListScreen;
