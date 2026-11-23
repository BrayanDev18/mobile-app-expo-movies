import { FlashList, SectionTitle, Text, TmdbImage } from '@/components';
import { TvSeasonProps } from '@/interfaces';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useTranslate } from '@/translate';

interface SeasonsListProps {
  seriesId: number;
  seriesTitle: string;
  seasons: TvSeasonProps[];
}

export const SeasonsList = ({ seriesId, seriesTitle, seasons }: SeasonsListProps) => {
  const { t } = useTranslate();

  const visibleSeasons = seasons.filter(
    (season) => season.seasonNumber > 0 && season.episodeCount > 0
  );

  if (!visibleSeasons.length) return null;

  return (
    <View className="gap-3">
      <SectionTitle title={t('detail.seasons')} />

      <FlashList
        horizontal
        data={visibleSeasons}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => {
          const year = item.airDate?.slice(0, 4);

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('detail.viewEpisodes', { name: item.name })}
              className="w-[120px] gap-1.5"
              onPress={() =>
                router.push({
                  pathname: '/(root)/tv/season',
                  params: { id: seriesId, season: item.seasonNumber, seriesTitle },
                })
              }>
              <TmdbImage
                path={item.poster}
                size="w185"
                style={{ width: 120, height: 180, borderRadius: 12 }}
                contentFit="cover"
                accessibilityLabel={t('common.poster', { title: item.name })}
              />

              <View className="gap-0.5 px-0.5">
                <Text numberOfLines={1} className="!text-md font-semibold">
                  {item.name}
                </Text>

                <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
                  {[year, t('common.episodeCount', { count: item.episodeCount })]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
