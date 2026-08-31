import { FlashList, SectionTitle, Text } from '@/components';
import { MediaType, MovieCastProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openCastList, openPersonDetails } from '@/utils';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

interface MovieCastAndCrewProps {
  movieId: number;
  cast: MovieCastProps[];
  director?: MovieCastProps | null;
  mediaType?: MediaType;
}

export const MovieCastAndCrew = (props: MovieCastAndCrewProps) => {
  const { movieId, cast, director, mediaType = 'movie' } = props;

  const members = [...(cast?.slice(0, 5) ?? []), ...(director ? [director] : [])];

  return (
    <View className="gap-1">
      <SectionTitle
        title="Cast & Crew"
        onSeeAll={cast?.length > 5 ? () => openCastList(movieId, mediaType) : undefined}
      />

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
            onPress={() => openPersonDetails(cast.id)}>
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
