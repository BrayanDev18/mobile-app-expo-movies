import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

interface SpotlightCardProps {
  movie: MovieProps;
  onPress?: () => void;
}

export const SpotlightCard = ({ movie, onPress }: SpotlightCardProps) => {
  const imageUri = movie.backdrop ?? movie.poster;

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify().damping(30).stiffness(200)}
      className="px-3">
      <Pressable
        onPress={() =>
          onPress
            ? onPress()
            : router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })
        }
        accessibilityRole="button"
        accessibilityLabel={`View details for ${movie.title}`}>
        <View className="overflow-hidden rounded-3xl">
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', aspectRatio: 1.78 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityLabel={`${movie.title} backdrop`}
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={[StyleSheet.absoluteFill, { top: '30%' }]}
          />

          <View style={{ position: 'absolute', top: 12, left: 12 }}>
            <BlurView intensity={70} tint="dark" className="overflow-hidden rounded-full">
              <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                <Icon name="Sparkles" size={12} color="#3B82F6" />
                <Text className="text-xs font-bold !text-blue-400">FEATURED</Text>
              </View>
            </BlurView>
          </View>

          <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <BlurView intensity={70} tint="dark" className="overflow-hidden rounded-full">
              <View className="flex-row items-center gap-1 px-3 py-1.5">
                <Icon name="Star" size={12} color="#FACC15" />
                <Text className="text-xs font-semibold">{movie.rating.toFixed(1)}</Text>
              </View>
            </BlurView>
          </View>

          <View
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
            className="gap-3 p-4">
            <Text className="!text-2xl font-bold leading-tight" numberOfLines={2}>
              {movie.title}
            </Text>

            <Text className="!text-md !text-neutral-300" numberOfLines={2}>
              {movie.overview}
            </Text>

            <View className="flex-row items-center gap-3 pt-1">
              <LinearGradient
                colors={['#68BEF1', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 50, overflow: 'hidden' }}>
                <View className="flex-row items-center gap-2 px-6 py-3">
                  <Icon name="Play" size={16} color="white" />
                  <Text className="!text-md font-semibold">Watch Now</Text>
                </View>
              </LinearGradient>

              <Pressable
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
                accessibilityRole="button"
                accessibilityLabel="Add to my list">
                <Icon name="Plus" size={18} color="rgba(255,255,255,0.8)" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};
