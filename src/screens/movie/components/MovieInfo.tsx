import { ExpandableText, Text } from '@/components';
import { MovieDetailsProps } from '@/interfaces';
import { formatDuration } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';

export const MovieInfo = ({ movie }: { movie: MovieDetailsProps }) => {
  return (
    <View className="gap-8">
      <View className="gap-4">
        <Text numberOfLines={2} className="!text-2xl font-bold leading-tight">
          {movie?.title}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-2">
          {!movie?.adult && (
            <View className="rounded-full bg-red-500/60 px-2 py-1">
              <Text className="font-semibold">18+</Text>
            </View>
          )}

          <View className="flex-row items-center gap-2">
            {movie?.genres?.map((genre, index) => (
              <View key={index} className="rounded-full bg-white/10 px-3 py-1">
                <Text className="font-medium text-white/80">{genre.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />

          <Text className="text-sm font-medium text-white/60">
            {formatDuration(movie?.runtime as number)}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <Text className="!text-lg font-bold">Storyline</Text>

        <ExpandableText numberOfLines={4} textClassname="!text-md leading-6 !text-neutral-400">
          {movie?.overview}
        </ExpandableText>
      </View>

      {movie?.homepage ? (
        <View className="gap-2">
          <Text className="!text-lg font-bold">Homepage:</Text>

          <Link
            href={movie?.homepage as any}
            numberOfLines={1}
            className="!text-md text-blue-500 underline">
            {movie?.homepage}
          </Link>
        </View>
      ) : null}
    </View>
  );
};
