import { Loader, Screen } from '@/components';
import { useCastDetails } from '@/hooks';
import { CastImageProfileProps } from '@/interfaces';
import { CastGalleryModal } from '@/screens/movie/components';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastGallery = () => {
  const { id } = useLocalSearchParams();
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CastImageProfileProps | null>();

  const { castImages, isCastImagesLoading } = useCastDetails(+id);

  const handleOpenModal = (image: any) => {
    setSelectedImage(image);
    setOpenModalGallery(true);
  };

  const handleHideModal = () => {
    setSelectedImage(null);
    setOpenModalGallery(false);
  };

  if (castImages?.profiles.length && isCastImagesLoading) return <Loader />;

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="h-full">
        <FlashList
          data={castImages?.profiles}
          numColumns={2}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `cast-image-${item.file_path}-${index}`}
          contentContainerClassName="p-3"
          renderItem={({ item: image, index }) => (
            <AnimatedPressable
              onPress={() => handleOpenModal(image)}
              entering={FadeInDown.delay(100 * index).springify()}
              className="flex-1 items-center justify-center p-1">
              <Image
                source={{ uri: image.file_path as string }}
                style={{
                  width: '100%',
                  borderRadius: 12,
                  aspectRatio: image.aspect_ratio as number,
                }}
                contentFit="fill"
                cachePolicy="memory-disk"
              />
            </AnimatedPressable>
          )}
        />
      </View>

      <CastGalleryModal
        visible={openModalGallery}
        image={selectedImage as CastImageProfileProps}
        onHide={handleHideModal}
      />
    </Screen>
  );
};

export default CastGallery;
