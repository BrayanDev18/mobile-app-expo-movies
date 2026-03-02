import { ImagePreviewModal, Text } from '@/components';
import { MovieImages, MovieImagesResponse } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TouchableHighlight, View } from 'react-native';

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
              <Pressable onPress={() => handleOpenModal(item as any)}>
                <Image
                  source={{ uri: item.url as string }}
                  style={{
                    width: 280,
                    aspectRatio: 1.78,
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
        image={selectedImage as any}
        onHide={() => setOpenModalGallery(false)}
      />
    </>
  );
};
