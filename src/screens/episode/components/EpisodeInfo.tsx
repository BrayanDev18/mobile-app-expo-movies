import { ExpandableText, Icon, Text } from '@/components';
import { EpisodeDetailsProps } from '@/interfaces';
import { formatDate, formatDuration } from '@/utils';
import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EpisodeInfoProps {
  episode: EpisodeDetailsProps;
  seriesTitle?: string;
}

export const EpisodeInfo = ({ episode, seriesTitle }: EpisodeInfoProps) => (
  <Animated.View
    entering={FadeInDown.delay(100).springify().damping(30).stiffness(200)}
    className="gap-6">
    <View className="gap-3">
      <Text numberOfLines={2} className="!text-2xl font-bold leading-tight">
        {episode.name}
      </Text>

      <View className="flex-row flex-wrap items-center gap-2">
        <View
          className="rounded-full bg-blue-500/15 px-3 py-1"
          style={{ borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' }}>
          <Text className="text-xs font-bold !text-blue-400">
            S{String(episode.seasonNumber).padStart(2, '0')}E
            {String(episode.episodeNumber).padStart(2, '0')}
          </Text>
        </View>

        {seriesTitle ? (
          <Text className="text-sm !text-neutral-400" numberOfLines={1}>
            {seriesTitle}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-3">
        {episode.rating > 0 && (
          <View className="flex-row items-center gap-1">
            <Star color="yellow" fill="yellow" size={15} />
            <Text className="text-sm font-medium text-white/60">
              {episode.rating.toFixed(1)}
            </Text>
          </View>
        )}

        {episode.runtime ? (
          <View className="flex-row items-center gap-1">
            <Icon name="Clock" size={15} color="rgba(255,255,255,0.6)" />
            <Text className="text-sm font-medium text-white/60">
              {formatDuration(episode.runtime)}
            </Text>
          </View>
        ) : null}

        {episode.airDate ? (
          <View className="flex-row items-center gap-1">
            <Icon name="Calendar" size={15} color="rgba(255,255,255,0.6)" />
            <Text className="text-sm font-medium text-white/60">
              {formatDate(episode.airDate)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>

    {episode.overview ? (
      <View className="gap-2">
        <Text className="!text-lg font-bold" accessibilityRole="header">
          Synopsis
        </Text>
        <ExpandableText numberOfLines={4} textClassname="!text-md leading-6 !text-neutral-400">
          {episode.overview}
        </ExpandableText>
      </View>
    ) : null}

    {episode.crew?.length > 0 && (
      <View className="gap-2">
        {episode.crew
          .filter((c) => c.job === 'Director' || c.job === 'Writer')
          .slice(0, 4)
          .map((member) => (
            <View key={member.credit_id} className="flex-row items-center gap-1.5">
              <Text className="text-sm !text-neutral-400">{member.job}</Text>
              <Text className="text-sm font-medium">{member.name}</Text>
            </View>
          ))}
      </View>
    )}
  </Animated.View>
);
