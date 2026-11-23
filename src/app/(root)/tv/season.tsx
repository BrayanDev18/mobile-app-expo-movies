import { EmptyState, ErrorState, FlashList, Loader, RatingBadge, Screen, Text } from '@/components';
import { useTvSeason } from '@/hooks';
import { TvEpisodeProps } from '@/interfaces';
import { formatDate, formatDuration, formatMinutes, IMAGE_PLACEHOLDER, tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslate } from '@/translate';

const episodeDuration = (runtime: number | null) => {
  if (!runtime) return null;

  return runtime < 60 ? formatMinutes(runtime) : formatDuration(runtime);
};

const EpisodeRow = ({ episode, index }: { episode: TvEpisodeProps; index: number }) => {
  const { t } = useTranslate();

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
            accessibilityLabel={t('common.still', { name: episode.name })}
          />

          <View className="flex-1 gap-1">
            <Text numberOfLines={2} className="!text-md font-semibold">
              {episode.episodeNumber}. {episode.name}
            </Text>

            {meta ? <Text className="!text-[13px] !text-neutral-400">{meta}</Text> : null}

            {episode.rating > 0 && <RatingBadge value={episode.rating} size="sm" />}
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
  const { t } = useTranslate();

  const { season: seasonDetails, isLoading, isError, refetch } = useTvSeason(+id, +season);

  const renderItem = useCallback(
    ({ item, index }: { item: TvEpisodeProps; index: number }) => (
      <EpisodeRow episode={item} index={index} />
    ),
    []
  );

  if (isLoading) return <Loader />;

  if (isError || !seasonDetails) {
    return <ErrorState retryLabel={t('errors.retrySeason')} onRetry={() => refetch()} />;
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
                  accessibilityLabel={t('common.poster', { title: seasonDetails.name })}
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
                    {[year, t('common.episodeCount', { count: seasonDetails.episodes.length })]
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
          ListEmptyComponent={<EmptyState icon="Film" message={t('detail.noEpisodes')} />}
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default SeasonScreen;
