import { Icon, Text } from '@/components';
import { MovieCastProps, MovieCrewProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, TouchableHighlight, View } from 'react-native';

interface MovieCastAndCrewProps {
  movieId: number;
  cast: MovieCastProps[];
  movieCrew?: MovieCrewProps[];
  mediaType?: 'movie' | 'series';
}

export const MovieCastAndCrew = ({
  movieId,
  cast,
  movieCrew = [],
  mediaType = 'movie',
}: MovieCastAndCrewProps) => {
  const keyCrew = useMemo(() => {
    const directors = movieCrew.filter((c) => c.job === 'Director');
    const writers = movieCrew.filter((c) => c.department === 'Writing').slice(0, 2);
    const producer = movieCrew.find((c) => c.job === 'Producer');
    return [...directors, ...writers, ...(producer ? [producer] : [])];
  }, [movieCrew]);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold" accessibilityRole="header">
          Cast & Crew
        </Text>

        {(cast?.length > 5 || movieCrew?.length > 0) && (
          <TouchableHighlight
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040"
            onPress={() =>
              router.push({
                pathname: '/(root)/movie/cast/castList',
                params: { id: movieId, type: mediaType },
              })
            }>
            <Icon name="ChevronRight" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableHighlight>
        )}
      </View>

      {keyCrew.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}>
          {keyCrew.map((crew, index) => (
            <KeyCrewPill key={`${crew.id}-${crew.job}-${index}`} crew={crew} />
          ))}
        </ScrollView>
      )}

      {cast?.length > 0 && (
        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={cast.slice(0, 10)}
          estimatedItemSize={155}
          scrollEventThrottle={16}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => <CastCard cast={item} />}
        />
      )}
    </View>
  );
};

const KeyCrewPill = ({ crew }: { crew: MovieCrewProps }) => (
  <Pressable
    onPress={() => router.push({ pathname: '/(root)/movie/cast/[id]', params: { id: crew.id } })}
    accessibilityRole="button"
    accessibilityLabel={`${crew.name}, ${crew.job}`}>
    <View
      style={{
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
      }}>
      <BlurView intensity={40} tint="dark">
        <View className="flex-row items-center gap-2.5 px-3 py-2">
          {crew.avatar ? (
            <Image
              source={{ uri: crew.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              className="items-center justify-center bg-neutral-700"
              style={{ width: 32, height: 32, borderRadius: 16 }}>
              <Icon name="User" size={16} color="rgba(255,255,255,0.5)" />
            </View>
          )}
          <View className="gap-0.5">
            <Text className="text-sm font-semibold" numberOfLines={1}>
              {crew.name}
            </Text>
            <Text className="text-xs !text-neutral-400" numberOfLines={1}>
              {crew.job}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  </Pressable>
);

const CastCard = ({ cast }: { cast: MovieCastProps }) => (
  <Pressable
    onPress={() => router.push({ pathname: '/(root)/movie/cast/[id]', params: { id: cast.id } })}
    accessibilityRole="button"
    accessibilityLabel={`${cast.name} as ${cast.character}`}>
    <View className="w-[145px] items-center gap-1.5">
      {cast.avatar ? (
        <Image
          source={{ uri: cast.avatar }}
          style={{ width: '100%', height: 180, borderRadius: 12 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View
          className="w-full items-center justify-center bg-neutral-800"
          style={{ height: 180, borderRadius: 12 }}>
          <Icon name="User" size={48} color="rgba(255,255,255,0.2)" />
        </View>
      )}

      <View className="w-full flex-1 items-center justify-center gap-1">
        <Text numberOfLines={1} className="!text-md font-medium">
          {cast.name}
        </Text>
        <Text numberOfLines={1} className="!text-neutral-400">
          {cast.character}
        </Text>
      </View>
    </View>
  </Pressable>
);
