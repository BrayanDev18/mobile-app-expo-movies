import { ExpandableText } from '@/components';
import { Text } from '@/components/Text';
import { MovieImagesProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CastBiographyProps {
  cast: any;
  images: MovieImagesProps[];
}

export const CastBiography = memo<CastBiographyProps>(({ cast, images }) => {
  return (
    <Animated.ScrollView
      entering={FadeInDown.delay(200).springify()}
      contentContainerClassName="gap-5">
      <Text className="gap-2 !text-md !text-neutral-400">
        Nicknames:{' '}
        {cast?.nickname.map((name, index) => (
          <Text key={index}>
            {name}

            {index == cast.nickname.length - 1 ? '' : ', '}
          </Text>
        ))}
      </Text>

      <Text className="gap-2 !text-md !text-neutral-400">
        Birthday: <Text>{cast?.fullBirthday}</Text>
      </Text>

      {cast?.deathday ? (
        <Text className="gap-2 !text-md !text-neutral-400">
          Deathday: <Text>{cast?.deathday}</Text>
        </Text>
      ) : null}

      <Text className="gap-2 !text-md !text-neutral-400">
        Prefession: <Text>{cast?.departament}</Text>
      </Text>

      <View className="gap-2">
        <Text className="!text-lg font-bold">Biography</Text>

        <ExpandableText numberOfLines={8} textClassname="!text-md !text-neutral-400">
          {cast?.biography}
        </ExpandableText>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="!text-lg font-bold">Gallery</Text>

          <Pressable
            className="p-2"
            onPress={() => router.push({ pathname: '/(root)/movie/gallery' })}>
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3">
          {images?.map((image, index) => (
            <View key={index} className="flex-row items-center gap-3">
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${image?.file_path}` }}
                style={{
                  width: 160,
                  height: 220,
                  borderRadius: 12,
                }}
                cachePolicy="memory-disk"
                contentFit="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.ScrollView>
  );
});
