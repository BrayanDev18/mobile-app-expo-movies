import {
  EmptyState,
  ErrorState,
  ExpandableText,
  RatingBadge,
  Screen,
  SectionTitle,
  Text,
} from '@/components';
import { EASE_OUT } from '@/constants';
import { useTvEpisode } from '@/hooks';
import { MovieCastProps, PersonProps } from '@/interfaces';
import { InfoMetaItem, MovieTrailers, PeopleHorizontalList } from '@/screens/movie/components';
import { EpisodeHero, EpisodeSkeleton, EpisodeStills } from '@/screens/series/components';
import { useTranslate } from '@/translate';
import { formatDate, formatDuration, formatMinutes } from '@/utils';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const toPeople = <T extends MovieCastProps>(members: T[], subtitle: (member: T) => string) =>
  members.map<PersonProps>((member) => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar || null,
    knownFor: subtitle(member) || undefined,
  }));

const episodeRuntime = (runtime: number | null) => {
  if (!runtime) return null;

  return runtime < 60 ? formatMinutes(runtime) : formatDuration(runtime);
};

const EpisodeScreen = () => {
  const {
    id,
    season,
    episode: episodeParam,
    seriesTitle,
  } = useLocalSearchParams<{
    id: string;
    season: string;
    episode: string;
    seriesTitle?: string;
  }>();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslate();

  const seasonNumber = Number(season);
  const episodeNumber = Number(episodeParam);

  const { episode, isLoading, isError, isNotFound, refetch } = useTvEpisode(
    Number(id),
    seasonNumber,
    episodeNumber
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return (
      <Screen canGoBack preset="fixed" safeAreaEdges={['bottom']}>
        <EpisodeSkeleton />
      </Screen>
    );
  }

  if (isNotFound) {
    return (
      <Screen canGoBack preset="fixed" safeAreaEdges={['top', 'bottom']}>
        <View className="flex-1 justify-center">
          <EmptyState
            icon="Clapperboard"
            title={t('detail.episodeNotFound')}
            message={t('detail.episodeGone')}
            action={{ title: t('common.goBack'), onPress: () => router.back() }}
          />
        </View>
      </Screen>
    );
  }

  if (isError || !episode) {
    return <ErrorState retryLabel={t('detail.retryEpisode')} onRetry={() => refetch()} />;
  }

  const { guestStars, crew, stills, videos } = episode;
  const runtime = episodeRuntime(episode.runtime);
  const hasDetails = Boolean(episode.overview || guestStars.length || crew.length);

  return (
    <Screen canGoBack preset="fixed" safeAreaEdges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }>
        <EpisodeHero still={episode.still} name={episode.name} />

        <Animated.View
          entering={FadeIn.duration(300).easing(EASE_OUT)}
          className="-mt-6 gap-8 rounded-t-3xl bg-neutral-900 px-4 pt-6">
          <View className="gap-4">
            <View className="gap-1.5">
              <View className="flex-row items-center gap-2">
                <View
                  accessible
                  accessibilityLabel={t('detail.seasonEpisode', {
                    season: seasonNumber,
                    episode: episodeNumber,
                  })}
                  className="rounded-full bg-white/10 px-2.5 py-1">
                  <Text className="text-xs font-semibold">
                    {t('detail.episodeCode', { season: seasonNumber, episode: episodeNumber })}
                  </Text>
                </View>

                {seriesTitle ? (
                  <Text numberOfLines={1} className="flex-1 !text-[13px] !text-neutral-400">
                    {seriesTitle}
                  </Text>
                ) : null}
              </View>

              <Text
                accessibilityRole="header"
                numberOfLines={2}
                className="!text-2xl font-bold leading-tight">
                {episode.name}
              </Text>
            </View>

            {episode.rating > 0 || episode.airDate || runtime ? (
              <View className="flex-row flex-wrap items-center gap-x-3 gap-y-2">
                {episode.rating > 0 && <RatingBadge value={episode.rating} size="md" />}

                {episode.airDate ? (
                  <InfoMetaItem icon="calendar-outline">{formatDate(episode.airDate)}</InfoMetaItem>
                ) : null}

                {runtime ? <InfoMetaItem icon="time-outline">{runtime}</InfoMetaItem> : null}
              </View>
            ) : null}
          </View>

          {hasDetails ? (
            <>
              {episode.overview ? (
                <View className="gap-2">
                  <SectionTitle title={t('detail.overview')} />

                  <ExpandableText
                    numberOfLines={4}
                    textClassname="!text-md leading-6 !text-neutral-400">
                    {episode.overview}
                  </ExpandableText>
                </View>
              ) : null}

              {crew.length > 0 && (
                <PeopleHorizontalList
                  title={t('detail.directedWrittenBy')}
                  people={toPeople(crew, (member) => member.job)}
                />
              )}

              {guestStars.length > 0 && (
                <PeopleHorizontalList
                  title={t('detail.guestStars')}
                  people={toPeople(guestStars, (member) => member.character)}
                />
              )}
            </>
          ) : (
            <EmptyState icon="Clapperboard" message={t('detail.episodeUnavailable')} />
          )}

          {videos.length > 0 && <MovieTrailers videos={videos.slice(0, 3)} mediaType="tv" />}

          {stills.length > 1 && <EpisodeStills stills={stills} />}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
};

export default EpisodeScreen;
