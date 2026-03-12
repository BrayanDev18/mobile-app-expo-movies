import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface TopSeriesRankedProps {
  series: MovieProps[];
}

export const TopSeriesRanked = ({ series }: TopSeriesRankedProps) => {
  if (!series?.length) return null;

  const top5 = series.slice(0, 5);

  return (
    <Animated.View
      entering={FadeInDown.delay(600).springify().damping(30).stiffness(200)}
      className="gap-4">
      <View className="flex-row items-center gap-2 px-1">
        <Icon name="Trophy" size={18} color="#F59E0B" />
        <Text className="!text-[18px] font-semibold">Top 5 Series</Text>
      </View>

      <View className="gap-3">
        {top5.map((item, index) => (
          <RankedCard key={item.id} series={item} rank={index + 1} />
        ))}
      </View>
    </Animated.View>
  );
};

const RankedCard = ({ series, rank }: { series: MovieProps; rank: number }) => {
  const imageUri = series.backdrop ?? series.poster;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(root)/series/[id]',
          params: { id: series.id },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`#${rank}: ${series.title}`}
      className="overflow-hidden rounded-2xl"
      style={{
        height: 130,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
      }}>
      <Image
        source={{ uri: imageUri }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      <View className="flex-1 flex-row items-center">
        <View className="w-16 items-center justify-center">
          <Text
            style={{ fontSize: 48, color: 'rgba(255,255,255,0.08)', fontWeight: '900' }}>
            {rank}
          </Text>
        </View>

        <View className="flex-1 gap-1.5 pr-4">
          <Text className="!text-md font-bold" numberOfLines={1}>
            {series.title}
          </Text>
          <Text className="text-xs leading-relaxed !text-neutral-400" numberOfLines={2}>
            {series.overview}
          </Text>
          <View className="flex-row items-center gap-1.5 pt-0.5">
            <Icon name="Star" size={11} color="#FACC15" />
            <Text className="text-xs font-semibold">{series.rating.toFixed(1)}</Text>
            {series.releaseDate && (
              <>
                <Text className="text-xs !text-neutral-500">·</Text>
                <Text className="text-xs !text-neutral-400">{series.releaseDate}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
