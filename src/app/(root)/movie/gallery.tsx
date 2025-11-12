import { Loader, Screen } from '@/components';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MovieGallery = () => {
  const { id } = useLocalSearchParams();

  return null;

  const {
    movieImagesQuery: { data: movieImages, isLoading: insLoadingImages },
  } = useGetMovie(+id);

  if (insLoadingImages || !movieImages?.length) {
    return <Loader />;
  }

  return (
    <Screen canGoBack safeAreaEdges={['top', 'bottom']} className="px-4">
      <Animated.ScrollView
        entering={FadeInDown.delay(600).springify()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4">
        {movieImages?.map((image, index) => (
          <ImageCard key={index} image={image} index={index} />
        ))}
      </Animated.ScrollView>
    </Screen>
  );
};

export default MovieGallery;

const ImageCard = ({ image, index }: { image: any; index: number }) => {
  return (
    <Pressable className="flex-row items-center gap-3">
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${image.file_path}` }}
        style={{
          width: 280,
          borderRadius: 12,
          aspectRatio: image.aspect_ratio,
        }}
        contentFit="cover"
      />
    </Pressable>
  );
};
