import { Loader, Screen } from '@/components';
import { useMovieImages } from '@/hooks';
import { MovieImagesProps } from '@/interfaces';
import { MovieGalleryModal } from '@/screens/movie/components';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GalleryItemProps {
  image: MovieImagesProps;
  index: number;
  handleOpenModal: (image: MovieImagesProps) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MovieGallery = () => {
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImagesProps>();

  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);

  const handleOpenModal = (image: MovieImagesProps) => {
    setSelectedImage(image);
    setVisible(true);
  };

  if (isMovieImagesLoading && movieImages.length) {
    return <Loader />;
  }

  return (
    <Screen preset="auto" safeAreaEdges={['top']} canGoBack>
      <FlashList
        showsHorizontalScrollIndicator={false}
        data={movieImages}
        numColumns={2}
        scrollEventThrottle={16}
        keyExtractor={(item, i) => `${item.movie_id}-${i}`}
        contentContainerClassName="p-2 pt-14"
        renderItem={({ item: image, index }) => (
          <GalleryItem key={index} image={image} index={index} handleOpenModal={handleOpenModal} />
        )}
      />

      <MovieGalleryModal
        image={selectedImage as MovieImagesProps}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </Screen>
  );
};

export default MovieGallery;

const GalleryItem = (props: GalleryItemProps) => {
  const { image, handleOpenModal, index } = props;

  return (
    <AnimatedPressable
      onPress={() => handleOpenModal(image)}
      entering={FadeInDown.delay(100 * index).springify()}
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
    </AnimatedPressable>
  );
};
