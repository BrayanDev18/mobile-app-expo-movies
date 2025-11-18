import { Text } from '@/components';
import { MovieCastProps, MovieDetailsProps, MovieImagesProps } from '@/interfaces';
import { formatPrice } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { TouchableHighlight, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AboutSectionProps {
  movieDetails: MovieDetailsProps;
  movieCast: MovieCastProps[];
  gallery: MovieImagesProps[];
}

export const MovieAbout = ({ movieDetails, movieCast, gallery }: AboutSectionProps) => (
  <Animated.View entering={FadeInDown.delay(200).springify()} className="gap-6">
    <View className="gap-3">
      <Text className="gap-2 !text-neutral-400">
        Languages:{' '}
        {movieDetails?.spoken_languages.map((language, index) => (
          <Text key={index}>
            {language.name}

            {index === movieDetails.spoken_languages.length - 1 ? '' : ', '}
          </Text>
        ))}
      </Text>

      <Text className="gap-2 !text-neutral-400">
        Production companies:{' '}
        {movieDetails?.production_companies.map((company, index) => (
          <Text key={index}>
            {company.name}

            {index === movieDetails.production_companies.length - 1 ? '' : ','}
          </Text>
        ))}
      </Text>

      <Text className="!text-neutral-400">
        Original title: <Text>{movieDetails?.original_title}</Text>
      </Text>

      <Text className="!text-neutral-400">
        Budget: <Text>{formatPrice(movieDetails?.budget)}</Text>
      </Text>

      <Text className="!text-neutral-400">
        Revenue: <Text>{formatPrice(movieDetails?.revenue)}</Text>
      </Text>
    </View>

    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Cast & Crew</Text>

        <TouchableHighlight
          className="h-12 w-12 items-center justify-center rounded-full"
          underlayColor="#404040"
          onPress={() =>
            router.push({
              pathname: '/(root)/movie/cast/castList',
              params: { id: movieDetails.id },
            })
          }>
          <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
        </TouchableHighlight>
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movieCast?.slice(0, 8)}
        scrollEventThrottle={16}
        keyExtractor={(item, i) => `${item.movie_id}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: cast }) => (
          <View className="w-34 flex-row items-center gap-3">
            <View className="relative">
              <Image
                source={{ uri: cast.profile_path as string }}
                style={{ width: 65, height: 65, borderRadius: 12 }}
                contentFit="cover"
              />
            </View>

            <View className="gap-1">
              <Text numberOfLines={2} className="!text-md font-medium">
                {cast.name}
              </Text>

              <Text numberOfLines={2} className="!text-neutral-400">
                {cast.character}
              </Text>
            </View>
          </View>
        )}
      />
    </View>

    {gallery?.length ? (
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="!text-lg font-bold">Gallery</Text>

          <TouchableHighlight
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040"
            onPress={() =>
              router.push({ pathname: '/(root)/movie/gallery', params: { id: movieDetails.id } })
            }>
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        </View>

        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={gallery.slice(0, 5)}
          scrollEventThrottle={16}
          keyExtractor={(item, i) => `${item.movie_id}-${i}`}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item: image }) => (
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: image.file_path as string }}
                style={{
                  width: 280,
                  borderRadius: 12,
                  aspectRatio: image.aspect_ratio || 0,
                }}
                cachePolicy="memory-disk"
                contentFit="cover"
              />
            </View>
          )}
        />
      </View>
    ) : null}
  </Animated.View>
);
