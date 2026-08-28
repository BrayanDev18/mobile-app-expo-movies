import { Text } from '@/components';
import { MovieCastProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, TouchableHighlight, View } from 'react-native';

interface MovieCastAndCrewProps {
  movieId: number;
  cast: MovieCastProps[];
  director?: MovieCastProps | null;
}

export const MovieCastAndCrew = (props: MovieCastAndCrewProps) => {
  const { movieId, cast, director } = props;

  const members = [...(cast?.slice(0, 5) ?? []), ...(director ? [director] : [])];

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Cast & Crew</Text>

        {cast?.length > 5 ? (
          <TouchableHighlight
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040"
            onPress={() =>
              router.push({
                pathname: '/(root)/movie/cast/castList',
                params: { id: movieId },
              })
            }>
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={members}
        scrollEventThrottle={16}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: cast }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${cast.name}`}
            className="w-[145px] items-center gap-1.5"
            onPress={() => router.push(`/movie/cast/${cast.id}`)}>
            <Image
              source={{ uri: cast.avatar || undefined }}
              style={{ width: '100%', height: 180, borderRadius: 12 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={IMAGE_PLACEHOLDER}
              accessibilityLabel={`${cast.name} portrait`}
            />

            <View className="w-full flex-1 items-center justify-center gap-1">
              <Text numberOfLines={2} className="!text-lg font-medium text-center">
                {cast.name}
              </Text>

              <Text numberOfLines={2} className="!text-neutral-400 text-center">
                {cast.character}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};
