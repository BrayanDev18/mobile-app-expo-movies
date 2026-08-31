import { ExpandableText, Text } from '@/components';
import { TvDetailsProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { Star } from 'lucide-react-native';
import { Linking, Pressable, ScrollView, View } from 'react-native';

interface SeriesInfoProps {
  series: TvDetailsProps;
  certification?: string | null;
}

const yearRange = (series: TvDetailsProps) => {
  const firstYear = series.firstAirDate?.slice(0, 4);

  if (!firstYear) return null;

  if (series.inProduction) return `${firstYear}–`;

  const lastYear = series.lastAirDate?.slice(0, 4);

  return lastYear && lastYear !== firstYear ? `${firstYear}–${lastYear}` : firstYear;
};

export const SeriesInfo = ({ series, certification }: SeriesInfoProps) => {
  const years = yearRange(series);
  const creators = series.createdBy.map((creator) => creator.name).join(', ');

  return (
    <View className="gap-8">
      <View className="gap-4">
        <View className="gap-1">
          <Text numberOfLines={2} className="!text-2xl font-bold leading-tight">
            {series.title}
          </Text>

          {series.homepage ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Open official website"
              hitSlop={8}
              className="flex-row items-center gap-1 self-start py-1"
              onPress={() => Linking.openURL(series.homepage as string)}>
              <Ionicons name="globe-outline" size={14} color="#60A5FA" />

              <Text className="!text-[13px] font-medium !text-blue-400">Official website</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Star color="yellow" fill="yellow" size={15} />

            <Text className="text-sm font-medium text-white/60">{series.rating.toFixed(1)}</Text>
          </View>

          {years ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.6)" />

              <Text className="text-sm font-medium text-white/60">{years}</Text>
            </View>
          ) : null}

          <View className="flex-row items-center gap-1">
            <Ionicons name="albums-outline" size={15} color="rgba(255,255,255,0.6)" />

            <Text className="text-sm font-medium text-white/60">
              {series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'season' : 'seasons'}
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-2">
          {certification && (
            <View className="rounded-full bg-red-500/60 px-2 py-1">
              <Text className="text-xs font-semibold">{certification}</Text>
            </View>
          )}

          <View className="flex-row items-center gap-2">
            {series.genres?.map((genre, index) => (
              <View key={index} className="rounded-full bg-white/10 px-3 py-1">
                <Text className="font-medium text-white/80">{genre.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {creators ? (
          <Text className="!text-[13px] !text-neutral-400">
            Created by{' '}
            <Text className="!text-[13px] font-semibold !text-neutral-200">{creators}</Text>
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <Text className="!text-lg font-bold">Storyline</Text>

        <ExpandableText numberOfLines={4} textClassname="!text-md leading-6 !text-neutral-400">
          {series.overview}
        </ExpandableText>
      </View>
    </View>
  );
};
