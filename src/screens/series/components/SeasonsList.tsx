import { Text } from '@/components';
import { TvSeasonProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

interface SeasonsListProps {
  seriesId: number;
  seriesTitle: string;
  seasons: TvSeasonProps[];
}

export const SeasonsList = ({ seriesId, seriesTitle, seasons }: SeasonsListProps) => {
  const visibleSeasons = seasons.filter(
    (season) => season.seasonNumber > 0 && season.episodeCount > 0
  );

  if (!visibleSeasons.length) return null;

  return (
    <View className="gap-3">
      <Text accessibilityRole="header" className="!text-lg font-bold">
        Seasons
      </Text>

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
              accessibilityLabel={`View episodes of ${item.name}`}
              className="w-[120px] gap-1.5"
              onPress={() =>
                router.push({
                  pathname: '/(root)/tv/season',
                  params: { id: seriesId, season: item.seasonNumber, seriesTitle },
                })
              }>
              <Image
                source={{ uri: item.poster ?? undefined }}
                style={{ width: 120, height: 180, borderRadius: 12 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                placeholder={IMAGE_PLACEHOLDER}
                accessibilityLabel={`${item.name} poster`}
              />

              <View className="gap-0.5 px-0.5">
                <Text numberOfLines={1} className="!text-md font-semibold">
                  {item.name}
                </Text>

                <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
                  {[year, `${item.episodeCount} episodes`].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
