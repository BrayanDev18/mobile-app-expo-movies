import { ExpandableText } from '@/components';
import { Text } from '@/components/Text';
import { CastDetailsProps, CastImageProfileProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, TouchableHighlight, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CastGalleryModal } from './CastGalleryModal';

interface CastBiographyProps {
  cast: CastDetailsProps;
  images: CastImageProfileProps[];
}

interface CastGalleryProps {
  images: CastImageProfileProps[];
  handleOpenModal: (image: CastImageProfileProps) => void;
  castId: number;
}

export const CastBiography = memo<CastBiographyProps>(({ cast, images }) => {
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CastImageProfileProps>();

  const handleOpenModal = (image: CastImageProfileProps) => {
    setSelectedImage(image);
    setOpenModalGallery(true);
  };

  const handleHideModal = () => {
    setOpenModalGallery(false);
  };

  return (
    <>
      <Animated.ScrollView
        entering={FadeInDown.delay(200).springify()}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5">
        <Text className="gap-2 !text-md">
          Nicknames:{' '}
          {cast?.also_known_as.map((name, index) => (
            <Text key={index} className="!text-neutral-400">
              {name}

              {index == cast.also_known_as.length - 1 ? '' : ', '}
            </Text>
          ))}
        </Text>

        <Text className="gap-2 !text-md">
          Birthday: <Text className="!text-neutral-400">{cast?.birthday}</Text>
        </Text>

        {cast?.deathday ? (
          <Text className="gap-2 !text-md">
            Deathday: <Text className="!text-neutral-400">{cast?.deathday}</Text>
          </Text>
        ) : null}

        <Text className="gap-2 !text-md">
          Prefession: <Text className="!text-neutral-400">{cast?.known_for_department}</Text>
        </Text>

        <View className="gap-2">
          <Text className="!text-lg font-bold">Biography</Text>

          <ExpandableText numberOfLines={8} textClassname="!text-md !text-neutral-400">
            {cast?.biography}
          </ExpandableText>
        </View>

        {images?.length ? (
          <CastGallery images={images} castId={cast.id} handleOpenModal={handleOpenModal} />
        ) : null}
      </Animated.ScrollView>

      <CastGalleryModal
        visible={openModalGallery}
        image={selectedImage as CastImageProfileProps}
        onHide={handleHideModal}
      />
    </>
  );
});

const CastGallery = (props: CastGalleryProps) => {
  const { images, handleOpenModal, castId } = props;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Gallery</Text>

        {images?.length > 1 ? (
          <TouchableHighlight
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040"
            onPress={() =>
              router.push({ pathname: '/(root)/movie/cast/gallery', params: { id: castId } })
            }>
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

      <FlashList
        horizontal
        data={images.slice(0, 5)}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `cast-image-${item.file_path}-${index}`}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: image }) => (
          <Pressable onPress={() => handleOpenModal(image)} className="flex-row items-center gap-3">
            <Image
              source={{ uri: image.file_path }}
              style={{
                width: 160,
                aspectRatio: image.aspect_ratio,
                borderRadius: 12,
              }}
              cachePolicy="memory-disk"
              contentFit="cover"
            />
          </Pressable>
        )}
      />
    </View>
  );
};
