import { Icon, Text } from '@/components';
import { TvEpisodeProps, TvSeasonProps } from '@/interfaces';
import { useSeasonEpisodes } from '@/screens/series/hooks/useSeasonEpisodes';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SeriesEpisodesProps {
  seriesId: number;
  seasons: TvSeasonProps[];
  seriesTitle?: string;
}

export const SeriesEpisodes = ({ seriesId, seasons, seriesTitle }: SeriesEpisodesProps) => {
  const filteredSeasons = seasons.filter((s) => s.season_number > 0);

  const [selectedSeason, setSelectedSeason] = useState(
    filteredSeasons[0]?.season_number ?? 1
  );

  const { episodes, isLoading, isError, refetch } = useSeasonEpisodes(seriesId, selectedSeason);

  if (!filteredSeasons.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify().damping(30).stiffness(200)}
      className="gap-4">
      <View className="flex-row items-center gap-2">
        <Icon name="Clapperboard" size={18} color="#8B5CF6" />
        <Text className="!text-lg font-bold">Episodes</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {filteredSeasons.map((season) => {
          const isActive = season.season_number === selectedSeason;
          return (
            <Pressable
              key={season.id}
              onPress={() => setSelectedSeason(season.season_number)}
              accessibilityRole="button"
              accessibilityLabel={season.name}
              className={`rounded-full px-4 py-2 ${
                isActive ? 'bg-blue-500/15' : 'bg-white/5'
              }`}
              style={{ borderWidth: 1, borderColor: isActive ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)' }}>
              <Text
                className={`text-sm font-medium ${
                  isActive ? '!text-blue-400' : '!text-neutral-400'
                }`}>
                {season.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <EpisodeSkeletons />
      ) : isError ? (
        <View className="items-center justify-center gap-4 py-12">
          <Icon name="CloudOff" size={48} color="rgba(255,255,255,0.3)" />
          <Text className="!text-neutral-400">Something went wrong</Text>
          <Pressable
            onPress={() => refetch()}
            accessibilityRole="button"
            accessibilityLabel="Retry loading episodes"
            className="rounded-full bg-blue-500/15 px-6 py-2">
            <Text className="font-medium !text-blue-400">Retry</Text>
          </Pressable>
        </View>
      ) : episodes.length === 0 ? (
        <View className="items-center justify-center gap-3 py-12">
          <Icon name="Film" size={48} color="rgba(255,255,255,0.3)" />
          <Text className="!text-neutral-400">No episodes found</Text>
        </View>
      ) : (
        <View className="gap-3">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              seriesId={seriesId}
              seriesTitle={seriesTitle}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const EpisodeCard = ({
  episode,
  seriesId,
  seriesTitle,
}: {
  episode: TvEpisodeProps;
  seriesId: number;
  seriesTitle?: string;
}) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(root)/series/episode/[id]' as any,
          params: {
            id: episode.id,
            seriesId,
            seasonNumber: episode.season_number,
            episodeNumber: episode.episode_number,
            seriesTitle,
          },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`View details for ${episode.name}, Season ${episode.season_number} Episode ${episode.episode_number}`}
      className="flex-row overflow-hidden rounded-2xl"
      style={{
        height: 110,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}>
      <View style={{ width: 160, height: '100%' }}>
        {episode.still_path ? (
          <Image
            source={{ uri: episode.still_path }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityLabel={`${episode.name} still`}
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-neutral-800">
            <Icon name="Film" size={24} color="rgba(255,255,255,0.2)" />
          </View>
        )}

        <View
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}>
          <Text className="text-[10px] font-bold !text-white/80">
            EP {episode.episode_number}
          </Text>
        </View>
      </View>

      <View className="flex-1 justify-center gap-1 px-3 py-2">
        <Text className="!text-md font-semibold" numberOfLines={1}>
          {episode.name}
        </Text>

        <View className="flex-row items-center gap-2">
          {episode.air_date && (
            <View className="flex-row items-center gap-1">
              <Icon name="Calendar" size={10} color="rgba(255,255,255,0.4)" />
              <Text className="text-xs !text-neutral-400">{episode.air_date}</Text>
            </View>
          )}
          {episode.vote_average > 0 && (
            <View className="flex-row items-center gap-1">
              <Icon name="Star" size={10} color="#FACC15" />
              <Text className="text-xs font-semibold">{episode.vote_average.toFixed(1)}</Text>
            </View>
          )}
          {episode.runtime && (
            <View className="flex-row items-center gap-1">
              <Icon name="Clock" size={10} color="rgba(255,255,255,0.4)" />
              <Text className="text-xs !text-neutral-400">{episode.runtime}m</Text>
            </View>
          )}
        </View>

        {episode.overview ? (
          <Text className="text-xs leading-relaxed !text-neutral-500" numberOfLines={2}>
            {episode.overview}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

// --- Skeletons ---

const usePulse = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};

const EpisodeSkeletons = () => {
  const pulseStyle = usePulse();

  return (
    <View className="gap-3">
      {[1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={[pulseStyle, { height: 110 }]}
          className="rounded-2xl bg-neutral-800"
        />
      ))}
    </View>
  );
};
