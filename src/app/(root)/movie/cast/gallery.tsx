import { FlashList, ImagePreviewModal, Loader, Screen } from '@/components';
import { useCastDetails } from '@/hooks';
import { CastImageProfileProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER } from '@/utils';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

const CastGallery = () => {
  const { id } = useLocalSearchParams();

  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CastImageProfileProps>();

  const { castImages, isLoading } = useCastDetails(+id);

  const handleOpenModal = (image: CastImageProfileProps) => {
    setSelectedImage(image);
    setOpenModalGallery(true);
  };

  const handleHideModal = () => {
    setSelectedImage(undefined);
    setOpenModalGallery(false);
  };

  const renderItem = useCallback(({ item }: { item: CastImageProfileProps }) => {
    return (
      <Pressable onPress={() => handleOpenModal(item)} className="p-1">
        <Image
          source={{ uri: item.file_path }}
          style={{
            width: '100%',
            borderRadius: 12,
            aspectRatio: item.aspect_ratio,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
        />
      </Pressable>
    );
  }, []);

  if (isLoading && !castImages?.profiles.length) return <Loader />;

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="h-full">
        <FlashList
          data={castImages?.profiles}
          masonry
          numColumns={2}
          optimizeItemArrangement
          removeClippedSubviews={true}
          keyExtractor={(item) => `cast-${item.file_path}`}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pt-14"
          renderItem={renderItem}
        />
      </View>

      <ImagePreviewModal
        visible={openModalGallery}
        image={selectedImage}
        onHide={handleHideModal}
      />
    </Screen>
  );
};

export default CastGallery;
