import { ExpandableText, FlashList, ImagePreviewModal, SectionTitle } from '@/components';
import { Text } from '@/components/Text';
import { CastDetailsProps, CastImageProfileProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CastBiographyProps {
  cast: CastDetailsProps;
  images: CastImageProfileProps[];
}

interface CastGalleryProps {
  images: CastImageProfileProps[];
  handleOpenModal: (image: CastImageProfileProps) => void;
  castId: number;
}

export const CastBiography = ({ cast, images }: CastBiographyProps) => {
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CastImageProfileProps>();

  let aliases = cast.also_known_as;

  if (typeof aliases === 'string') {
    aliases = JSON.parse(aliases);
  }

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
        entering={FadeInDown.springify()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}>
        {aliases?.length ? (
          <Text className="gap-2 !text-md">
            Also known as:{' '}
            {aliases.map((name, index) => (
              <Text key={index} className="!text-neutral-400">
                {name}

                {index === aliases.length - 1 ? '' : ', '}
              </Text>
            ))}
          </Text>
        ) : null}

        {cast?.birthday ? (
          <Text className="gap-2 !text-md">
            Birthday: <Text className="!text-neutral-400">{formatDate(cast.birthday)}</Text>
          </Text>
        ) : null}

        {cast?.deathday ? (
          <Text className="gap-2 !text-md">
            Died: <Text className="!text-neutral-400">{formatDate(cast.deathday)}</Text>
          </Text>
        ) : null}

        {cast?.place_of_birth ? (
          <Text className="gap-2 !text-md">
            Born in: <Text className="!text-neutral-400">{cast.place_of_birth}</Text>
          </Text>
        ) : null}

        {cast?.known_for_department ? (
          <Text className="gap-2 !text-md">
            Profession: <Text className="!text-neutral-400">{cast.known_for_department}</Text>
          </Text>
        ) : null}

        <View className="gap-2">
          <SectionTitle title="Biography" />

          <ExpandableText numberOfLines={8} textClassname="!text-md !text-neutral-400">
            {cast?.biography || 'No biography available.'}
          </ExpandableText>
        </View>

        {images?.length ? (
          <CastGallery images={images} castId={cast.id} handleOpenModal={handleOpenModal} />
        ) : null}
      </Animated.ScrollView>

      <ImagePreviewModal
        visible={openModalGallery}
        image={selectedImage}
        onHide={handleHideModal}
      />
    </>
  );
};

const CastGallery = (props: CastGalleryProps) => {
  const { images, handleOpenModal, castId } = props;

  const renderItem = useCallback(
    ({ item: image }: { item: CastImageProfileProps }) => {
      return (
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
      );
    },
    [handleOpenModal]
  );

  return (
    <View className="gap-3">
      <SectionTitle
        title="Gallery"
        onSeeAll={
          images?.length > 1
            ? () => router.push({ pathname: '/(root)/movie/cast/gallery', params: { id: castId } })
            : undefined
        }
      />

      <FlashList
        horizontal
        data={images.slice(0, 5)}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `cast-image-${item.file_path}-${index}`}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
