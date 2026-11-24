import { Text } from '@/components';
import { NextEpisodeProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTranslate } from '@/translate';

export const NextEpisodeBanner = ({ nextEpisode }: { nextEpisode: NextEpisodeProps }) => {
  const { t } = useTranslate();

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
          {t('detail.newEpisode', { date: formatDate(nextEpisode.airDate) })}
        </Text>

        <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
          {t('detail.episodeCode', {
            season: nextEpisode.seasonNumber,
            episode: nextEpisode.episodeNumber,
          })}
          {nextEpisode.name ? ` · ${nextEpisode.name}` : ''}
        </Text>
      </View>
    </View>
  );
};
