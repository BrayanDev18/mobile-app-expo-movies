import { Text } from '@/components';
import { NextEpisodeProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export const NextEpisodeBanner = ({ nextEpisode }: { nextEpisode: NextEpisodeProps }) => {
  if (!nextEpisode.airDate) return null;

  return (
    <View
      style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
      className="flex-row items-center gap-3 rounded-2xl bg-white/10 p-4">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-500/15">
        <Ionicons name="calendar-outline" size={20} color="#60A5FA" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="!text-md font-semibold">
          New episode {formatDate(nextEpisode.airDate)}
        </Text>

        <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
          S{nextEpisode.seasonNumber} E{nextEpisode.episodeNumber}
          {nextEpisode.name ? ` · ${nextEpisode.name}` : ''}
        </Text>
      </View>
    </View>
  );
};
