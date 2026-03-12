import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MustWatchListProps {
  movies: MovieProps[];
  onItemPress?: (item: MovieProps) => void;
}

export const MustWatchList = ({ movies, onItemPress }: MustWatchListProps) => {
  if (!movies?.length) return null;

  const top5 = movies.slice(0, 5);

  return (
    <Animated.View
      entering={FadeInDown.delay(750).springify().damping(30).stiffness(200)}
      className="gap-4">
      <View className="flex-row items-center gap-2 px-1">
        <Icon name="Award" size={18} color="#FACC15" />
        <Text className="!text-[18px] font-semibold">Must Watch</Text>
      </View>

      <View className="gap-3">
        {top5.map((movie, index) => (
          <MustWatchItem key={movie.id} movie={movie} rank={index + 1} onItemPress={onItemPress} />
        ))}
      </View>
    </Animated.View>
  );
};

const MustWatchItem = ({
  movie,
  rank,
  onItemPress,
}: {
  movie: MovieProps;
  rank: number;
  onItemPress?: (item: MovieProps) => void;
}) => (
  <Pressable
    onPress={() =>
      onItemPress
        ? onItemPress(movie)
        : router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })
    }
    accessibilityRole="button"
    accessibilityLabel={`#${rank} must watch: ${movie.title}`}>
    <View
      className="flex-row overflow-hidden rounded-2xl"
      style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', height: 100 }}>
      <View style={{ width: 160, position: 'relative' }}>
        <Image
          source={{ uri: movie.backdrop ?? movie.poster }}
          style={{ flex: 1 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40 }}
        />
        <View style={{ position: 'absolute', top: 8, left: 8 }}>
          <BlurView intensity={60} tint="dark" style={{ borderRadius: 50, overflow: 'hidden' }}>
            <View className="items-center justify-center px-2.5 py-1">
              <Text className="text-xs font-bold !text-yellow-400">#{rank}</Text>
            </View>
          </BlurView>
        </View>
      </View>

      <View
        className="flex-1 justify-center gap-1.5 px-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Text className="!text-md font-semibold" numberOfLines={1}>
          {movie.title}
        </Text>
        <Text className="text-xs !text-neutral-400" numberOfLines={2}>
          {movie.overview}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Icon name="Star" size={11} color="#FACC15" />
          <Text className="text-xs font-semibold">{movie.rating.toFixed(1)}</Text>
          <Text className="text-xs !text-neutral-500">·</Text>
          <Text className="text-xs !text-neutral-400">{movie.releaseDate}</Text>
        </View>
      </View>
    </View>
  </Pressable>
);
