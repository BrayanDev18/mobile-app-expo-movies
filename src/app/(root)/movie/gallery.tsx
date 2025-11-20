import { ImagePreviewModal, Loader, Screen } from '@/components';
import { useMovieImages } from '@/hooks';
import { MovieImagesProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable } from 'react-native';

const MovieGallery = () => {
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImagesProps>();

  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);

  const handleOpenModal = (image: MovieImagesProps) => {
    setSelectedImage(image);
    setVisible(true);
  };

  const renderItem = useCallback(
    ({ item: image }: { item: MovieImagesProps }) => (
      <Pressable
        onPress={() => handleOpenModal(image)}
        className="flex-1 items-center justify-center p-1">
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${image.file_path}` }}
          style={{
            width: '100%',
            borderRadius: 12,
            aspectRatio: image.aspect_ratio as number,
          }}
          contentFit="fill"
        />
      </Pressable>
    ),
    []
  );

  if (isMovieImagesLoading) return <Loader />;

  return (
    <Screen preset="auto" safeAreaEdges={['top', 'bottom']} canGoBack>
      <FlashList
        showsHorizontalScrollIndicator={false}
        data={movieImages}
        numColumns={2}
        scrollEventThrottle={16}
        removeClippedSubviews
        keyExtractor={(item, i) => `${item.movie_id}-${i}`}
        contentContainerClassName="px-4 pt-14"
        renderItem={renderItem}
      />

      <ImagePreviewModal
        image={selectedImage as MovieImagesProps}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </Screen>
  );
};

export default MovieGallery;
