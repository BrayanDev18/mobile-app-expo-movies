import { FlashList, ImagePreviewModal, SectionTitle } from '@/components';
import { MediaType, MovieImagesProps, MovieImagesResponse } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openGallery } from '@/utils';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export const MovieGallery = ({
  movieId,
  gallery,
  mediaType = 'movie',
}: {
  movieId: number;
  gallery: MovieImagesResponse;
  mediaType?: MediaType;
}) => {
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImagesProps>();

  const previewImages = [...(gallery.backdrops ?? []), ...(gallery.posters ?? [])].slice(0, 5);

  const totalImages = gallery.backdrops.length + gallery.logos.length + gallery.posters.length;

  const handleOpenModal = (image: MovieImagesProps) => {
    setSelectedImage(image);
    setOpenModalGallery(true);
  };

  return (
    <>
      <View className="gap-3">
        <SectionTitle
          title="Gallery"
          onSeeAll={totalImages > 1 ? () => openGallery(movieId, mediaType) : undefined}
        />

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
                    aspectRatio: 1.78,
                    borderRadius: 12,
                  }}
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  placeholder={IMAGE_PLACEHOLDER}
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
