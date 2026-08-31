import { Loader, Screen, Text } from '@/components';
import { useTvSeason } from '@/hooks';
import { TvEpisodeProps } from '@/interfaces';
import { formatDate, formatDuration, IMAGE_PLACEHOLDER, tmdbImage } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const episodeDuration = (runtime: number | null) => {
  if (!runtime) return null;

  return runtime < 60 ? `${runtime}m` : formatDuration(runtime);
};

const EpisodeRow = ({ episode, index }: { episode: TvEpisodeProps; index: number }) => {
  const meta = [
    episode.airDate ? formatDate(episode.airDate) : null,
    episodeDuration(episode.runtime),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 60).springify()}>
      <View className="gap-2.5 py-4">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: tmdbImage(episode.still, 'w342') ?? undefined }}
            style={{ width: 140, height: 79, borderRadius: 12 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={IMAGE_PLACEHOLDER}
            accessibilityLabel={`${episode.name} still`}
          />

          <View className="flex-1 gap-1">
            <Text numberOfLines={2} className="!text-md font-semibold">
              {episode.episodeNumber}. {episode.name}
            </Text>

            {meta ? <Text className="!text-[13px] !text-neutral-400">{meta}</Text> : null}

            {episode.rating > 0 && (
              <View className="flex-row items-center gap-1">
                <Star color="yellow" fill="yellow" size={12} />

                <Text className="!text-[13px] font-medium text-white/60">
                  {episode.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {episode.overview ? (
          <Text numberOfLines={2} className="!text-[13px] leading-5 !text-neutral-400">
            {episode.overview}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
};

const SeasonScreen = () => {
  const { id, season, seriesTitle } = useLocalSearchParams<{
    id: string;
    season: string;
    seriesTitle?: string;
  }>();

  const { season: seasonDetails, isLoading, isError, refetch } = useTvSeason(+id, +season);

  const renderItem = useCallback(
    ({ item, index }: { item: TvEpisodeProps; index: number }) => (
      <EpisodeRow episode={item} index={index} />
    ),
    []
  );

  if (isLoading) return <Loader />;

  if (isError || !seasonDetails) {
    return (
      <Screen canGoBack preset="fixed" safeAreaEdges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-4 px-10">
          <Ionicons name="cloud-offline-outline" size={48} color="rgba(255,255,255,0.3)" />

          <Text className="!text-neutral-400">Something went wrong</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading season details"
            onPress={() => refetch()}
            className="rounded-full bg-blue-500/15 px-6 py-2">
            <Text className="font-medium !text-blue-400">Retry</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const year = seasonDetails.airDate?.slice(0, 4);

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="h-full">
        <FlashList
          data={seasonDetails.episodes}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pt-14"
          ItemSeparatorComponent={() => <View className="border-b border-white/10" />}
          ListHeaderComponent={
            <View className="gap-4 pb-2">
              <View className="flex-row items-center gap-4">
                <Image
                  source={{ uri: tmdbImage(seasonDetails.poster, 'w185') ?? undefined }}
                  style={{ width: 84, height: 126, borderRadius: 12 }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  placeholder={IMAGE_PLACEHOLDER}
                  accessibilityLabel={`${seasonDetails.name} poster`}
                />

                <View className="flex-1 gap-1">
                  {seriesTitle ? (
                    <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
                      {seriesTitle}
                    </Text>
                  ) : null}

                  <Text accessibilityRole="header" className="!text-2xl font-bold leading-tight">
                    {seasonDetails.name}
                  </Text>

                  <Text className="!text-[13px] !text-neutral-400">
                    {[year, `${seasonDetails.episodes.length} episodes`]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </View>
              </View>

              {seasonDetails.overview ? (
                <Text className="!text-md leading-6 !text-neutral-400">
                  {seasonDetails.overview}
                </Text>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View className="items-center gap-3 py-12">
              <Ionicons name="film-outline" size={48} color="rgba(255,255,255,0.3)" />

              <Text className="!text-neutral-400">No episodes yet</Text>
            </View>
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default SeasonScreen;
