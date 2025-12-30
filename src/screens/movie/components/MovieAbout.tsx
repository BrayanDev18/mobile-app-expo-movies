import { ImagePreviewModal, Text } from '@/components';
import {
  MovieCastProps,
  MovieDetailsProps,
  MovieImages,
  MovieImagesResponse,
  MovieProvidersProps,
} from '@/interfaces';
import { formatPrice } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, TouchableHighlight, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AboutSectionProps {
  movieDetails: MovieDetailsProps;
  movieCast: MovieCastProps[];
  gallery: MovieImagesResponse;
  providers: string;
}

export const MovieAbout = ({ movieDetails, movieCast, gallery, providers }: AboutSectionProps) => (
  <Animated.View entering={FadeInDown.delay(200).springify()} className="gap-6">
    <MovieDetails movie={movieDetails} />

    <MovieCastAndCrew movieId={movieDetails.id} cast={movieCast} />

    {gallery.backdrops.length || gallery.logos.length || gallery.posters.length ? (
      <MovieGallery movieId={movieDetails.id} gallery={gallery} />
    ) : null}

    <MovieWatchProviders providers={providers} />
  </Animated.View>
);

const MovieDetails = ({ movie }: { movie: MovieDetailsProps }) => {
  return (
    <View className="gap-3">
      <Text className="gap-2 !text-neutral-400">
        Languages:{' '}
        {movie?.spokenLanguages.map((language, index) => (
          <Text key={index}>
            {language.name}

            {index === movie.spokenLanguages.length - 1 ? '' : ', '}
          </Text>
        ))}
      </Text>

      <Text className="gap-2 !text-neutral-400">
        Production companies:{' '}
        {movie?.productionCompanies.map((company, index) => (
          <Text key={index}>
            {company.name}

            {index === movie.productionCompanies.length - 1 ? '' : ','}
          </Text>
        ))}
      </Text>

      <Text className="!text-neutral-400">
        Original title: <Text>{movie?.originalTitle}</Text>
      </Text>

      <Text className="!text-neutral-400">
        Budget: <Text>{formatPrice(movie?.budget as number)}</Text>
      </Text>

      <Text className="!text-neutral-400">
        Revenue: <Text>{formatPrice(movie?.revenue as number)}</Text>
      </Text>
    </View>
  );
};

const MovieCastAndCrew = ({ movieId, cast }: { movieId: number; cast: MovieCastProps[] }) => {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Cast & Crew</Text>

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
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={cast?.slice(0, 8)}
        scrollEventThrottle={16}
        keyExtractor={(item, i) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: cast }) => (
          <View className="w-[200px] flex-row items-center gap-3">
            <View className="relative">
              <Image
                source={{ uri: cast.avatar as string }}
                style={{ width: 65, height: 65, borderRadius: 12 }}
                contentFit="cover"
              />
            </View>

            <View className="flex-1 gap-1">
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
  );
};

export const MovieGallery = ({
  movieId,
  gallery,
}: {
  movieId: number;
  gallery: MovieImagesResponse;
}) => {
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImages | null>(null);

  const previewImages = [...(gallery.backdrops ?? []), ...(gallery.posters ?? [])].slice(0, 5);

  const totalImages = gallery.backdrops.length + gallery.logos.length + gallery.posters.length;

  const handleOpenModal = (image: MovieImages) => {
    setSelectedImage(image);
    setOpenModalGallery(true);
  };

  return (
    <>
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="!text-lg font-bold">Gallery</Text>

          {totalImages > 1 && (
            <TouchableHighlight
              className="h-12 w-12 items-center justify-center rounded-full"
              underlayColor="#404040"
              onPress={() =>
                router.push({
                  pathname: '/(root)/movie/gallery',
                  params: { id: movieId },
                })
              }>
              <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
            </TouchableHighlight>
          )}
        </View>

        {previewImages.length > 0 && (
          <FlashList
            horizontal
            data={previewImages}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${movieId}-${index}`}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleOpenModal(item)}>
                <Image
                  source={{ uri: item.url as string }}
                  style={{
                    width: 280,
                    aspectRatio: item.aspectRatio || 1.78,
                    borderRadius: 12,
                  }}
                  cachePolicy="memory-disk"
                  contentFit="cover"
                />
              </Pressable>
            )}
          />
        )}
      </View>

      <ImagePreviewModal
        visible={openModalGallery}
        image={selectedImage}
        onHide={() => setOpenModalGallery(false)}
      />
    </>
  );
};

const MovieWatchProviders = ({ providers }: { providers: any }) => {
  if (!providers) return null;

  const { flatrate, rent, buy, link } = providers;

  const groups = [
    { title: 'Streaming', data: flatrate },
    { title: 'Alquiler', data: rent },
    { title: 'Compra', data: buy },
  ];

  return (
    <View className="gap-3">
      <Text className="!text-lg font-bold">Watch providers:</Text>

      <View className="w-full gap-4">
        {groups.map((group, index) => {
          if (!group.data) return null;

          return (
            <View key={index} className="gap-3">
              <Text className="text-sm font-medium !text-neutral-400">{group.title}</Text>

              <View className="flex-row flex-wrap gap-2 px-2">
                {group.data.slice(0, 3).map((provider: MovieProvidersProps, index: number) => (
                  <View
                    key={index}
                    className="w-[32%] overflow-hidden rounded-2xl border border-white/10">
                    <BlurView intensity={50} tint="dark">
                      <View className="flex-row items-center justify-between gap-2 p-1.5">
                        <View className="rounded-xl bg-white/10 p-1">
                          <Image
                            source={{
                              uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                            }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 6,
                            }}
                            contentFit="fill"
                            cachePolicy="memory-disk"
                          />
                        </View>

                        <Text className="flex-1 text-[12px] font-medium" numberOfLines={2}>
                          {provider.provider_name}
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {link ? (
          <Pressable onPress={() => Linking.openURL(link)} className="w-40">
            <Text className="text-sm !text-blue-400 underline">Ver más detalles</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
