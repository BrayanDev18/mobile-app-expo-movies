import { ExpandableText, Icon, Text } from '@/components';
import { IMAGE_BASE_URL } from '@/constants';
import { SeriesDetailsProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Star } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

export const SeriesInfo = ({ series }: { series: SeriesDetailsProps }) => (
  <View className="gap-8">
    <View className="gap-4">
      <View className="gap-1">
        <Text numberOfLines={2} className="!text-2xl font-bold leading-tight">
          {series?.title}
        </Text>

        {series?.tagline ? (
          <Text className="text-sm italic !text-neutral-400">{series.tagline}</Text>
        ) : null}

        {series?.homepage ? (
          <Link
            href={series?.homepage as any}
            numberOfLines={1}
            className="flex-1 !text-md text-blue-500 underline">
            {series?.homepage}
          </Link>
        ) : null}
      </View>

      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-1">
          <Star color="yellow" fill="yellow" size={15} />
          <Text className="text-sm font-medium text-white/60">{series.rating.toFixed(1)}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Icon name="Layers" size={15} color="rgba(255,255,255,0.6)" />
          <Text className="text-sm font-medium text-white/60">
            {series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Icon name="Film" size={15} color="rgba(255,255,255,0.6)" />
          <Text className="text-sm font-medium text-white/60">
            {series.numberOfEpisodes} Episodes
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.6)" />
        <Text className="text-sm text-white/60">
          {series.firstAirDate ? formatDate(series.firstAirDate) : 'TBA'}
          {series.lastAirDate ? ` — ${formatDate(series.lastAirDate)}` : ''}
        </Text>
        {series.inProduction && (
          <View className="rounded-full bg-green-500/20 px-2.5 py-0.5">
            <Text className="text-xs font-semibold !text-green-400">In Production</Text>
          </View>
        )}
      </View>

      {series.networks?.length > 0 && (
        <View className="flex-row items-center gap-3">
          {series.networks.map((network) => (
            <View
              key={network.id}
              className="flex-row items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              {network.logo_path && (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${network.logo_path}` }}
                  style={{ width: 20, height: 20, borderRadius: 4 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              )}
              <Text className="text-sm font-medium text-white/80">{network.name}</Text>
            </View>
          ))}
        </View>
      )}

      {series.createdBy?.length > 0 && (
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm !text-neutral-400">Created by</Text>
          <Text className="text-sm font-medium">
            {series.createdBy.map((c) => c.name).join(', ')}
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row items-center gap-2">
        {!series?.isAdult && (
          <View className="rounded-full bg-red-500/60 px-2 py-1">
            <Text className="font-semibold">18+</Text>
          </View>
        )}

        {series?.genres?.map((genre) => (
          <View key={genre.id} className="rounded-full bg-white/10 px-3 py-1">
            <Text className="font-medium text-white/80">{genre.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>

    <View className="gap-2">
      <Text className="!text-lg font-bold">Storyline</Text>

      <ExpandableText numberOfLines={4} textClassname="!text-md leading-6 !text-neutral-400">
        {series?.overview}
      </ExpandableText>
    </View>
  </View>
);
