import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface UpcomingCountdownProps {
  movies: MovieProps[];
  onItemPress?: (item: MovieProps) => void;
}

const getDaysUntil = (dateStr: string) => {
  const release = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((release.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

export const UpcomingCountdown = ({ movies, onItemPress }: UpcomingCountdownProps) => {
  const futureMovies = useMemo(
    () =>
      movies
        .filter((m) => getDaysUntil(m.releaseDate) > 0 && m.poster)
        .sort((a, b) => getDaysUntil(a.releaseDate) - getDaysUntil(b.releaseDate))
        .slice(0, 8),
    [movies]
  );

  if (!futureMovies.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(800).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2 px-1">
        <Icon name="Clock" size={18} color="#F97316" />
        <Text className="!text-[18px] font-semibold">Release Countdown</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}>
        {futureMovies.map((movie) => (
          <CountdownCard key={movie.id} movie={movie} onItemPress={onItemPress} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const CountdownCard = ({
  movie,
  onItemPress,
}: {
  movie: MovieProps;
  onItemPress?: (item: MovieProps) => void;
}) => {
  const days = getDaysUntil(movie.releaseDate);

  return (
    <Pressable
      onPress={() =>
        onItemPress
          ? onItemPress(movie)
          : router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}, releasing in ${days} days`}>
      <View
        style={{
          width: 130,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
        }}
        className="bg-neutral-950/30">
        <View style={{ width: 130, height: 190, position: 'relative' }}>
          <Image
            source={{ uri: movie.poster }}
            style={{ flex: 1 }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />

          <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' }}>
            <BlurView intensity={70} tint="dark" style={{ borderRadius: 50, overflow: 'hidden' }}>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                <Icon name="Clock" size={11} color="#F97316" />
                <Text className="text-xs font-bold !text-orange-400">
                  {days === 1 ? 'Tomorrow' : `${days} days`}
                </Text>
              </View>
            </BlurView>
          </View>
        </View>

        <View className="gap-0.5 p-2.5">
          <Text className="!text-sm font-medium" numberOfLines={1}>
            {movie.title}
          </Text>
          <Text className="text-xs !text-neutral-400">{movie.releaseDate}</Text>
        </View>
      </View>
    </Pressable>
  );
};
