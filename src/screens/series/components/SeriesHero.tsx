import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SeriesHeroProps {
  series: MovieProps;
}

export const SeriesHero = ({ series }: SeriesHeroProps) => {
  const imageUri = series.backdrop ?? series.poster;

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/(root)/series/[id]',
            params: { id: series.id },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`View details for ${series.title}`}
        style={{ width: '100%', aspectRatio: 1.2 }}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          cachePolicy="memory-disk"
          accessibilityLabel={`${series.title} backdrop`}
        />

        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.6)', 'rgba(10,10,10,0.95)']}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' }}
        />

        <View style={{ position: 'absolute', top: 12, left: 16 }}>
          <BlurView intensity={70} tint="dark" className="overflow-hidden rounded-full">
            <View className="flex-row items-center gap-1.5 px-3 py-1.5">
              <Icon name="Crown" size={12} color="#FACC15" />
              <Text className="text-xs font-bold !text-yellow-400">TOP RATED</Text>
            </View>
          </BlurView>
        </View>

        <View style={{ position: 'absolute', top: 12, right: 16 }}>
          <BlurView intensity={70} tint="dark" className="overflow-hidden rounded-full">
            <View className="flex-row items-center gap-1 px-3 py-1.5">
              <Icon name="Star" size={12} color="#FACC15" />
              <Text className="text-xs font-semibold">{series.rating.toFixed(1)}</Text>
            </View>
          </BlurView>
        </View>

        <View
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          className="gap-2 px-4 pb-6">
          <Text className="!text-3xl font-bold leading-tight" numberOfLines={2}>
            {series.title}
          </Text>

          <Text className="!text-md leading-relaxed !text-neutral-300" numberOfLines={3}>
            {series.overview}
          </Text>

          {series.releaseDate && (
            <View className="flex-row items-center gap-2 pt-1">
              <Icon name="Calendar" size={13} color="rgba(255,255,255,0.5)" />
              <Text className="text-sm !text-neutral-400">{series.releaseDate}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};
