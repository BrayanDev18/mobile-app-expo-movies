import { FlashList, ImagePreviewModal, Loader, Screen } from '@/components';
import { useMovieImages } from '@/hooks';
import { MovieImagesProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER } from '@/utils';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

const shuffleArray = <T,>(array: T[]) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const MovieGallery = () => {
  const { id, type } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImagesProps>();

  const { movieImages, isLoading } = useMovieImages(
    +id,
    type === 'tv' ? 'tv' : 'movie'
  );

  const previewImages = useMemo(() => {
    const images = [...(movieImages?.backdrops ?? []), ...(movieImages?.posters ?? [])];

    return shuffleArray(images);
  }, [movieImages]);

  const handleOpenModal = (image: MovieImagesProps) => {
    setSelectedImage(image);
    setVisible(true);
  };

  const renderItem = useCallback(
    ({ item }: { item: MovieImagesProps }) => (
      <Pressable onPress={() => handleOpenModal(item)} className="m-1.5">
        <Image
          source={{ uri: item.url as string }}
          style={{
            width: '100%',
            aspectRatio: item.aspectRatio ?? 1,
            borderRadius: 10,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
        />
      </Pressable>
    ),
    []
  );

  if (isLoading) return <Loader />;

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="h-full">
        <FlashList
          data={previewImages}
          masonry
          numColumns={2}
          optimizeItemArrangement
          keyExtractor={(item, index) => `${item.url}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-2 pt-12"
          renderItem={renderItem}
        />
      </View>

      <ImagePreviewModal
        image={selectedImage}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </Screen>
  );
};

export default MovieGallery;
