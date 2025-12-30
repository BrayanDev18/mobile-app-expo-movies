import { ImagePreviewModal, Loader, Screen } from '@/components';
import { useMovieImages } from '@/hooks';
import { MovieImagesProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

const splitIntoColumns = (data: MovieImagesProps[], columns = 2) => {
  const cols = Array.from({ length: columns }, () => ({
    items: [] as MovieImagesProps[],
    height: 0,
  }));

  data.forEach((item) => {
    const aspectRatio = item.aspectRatio ?? 1;

    const estimatedHeight = 1 / aspectRatio;

    const shortestColumn = cols.reduce((prev, curr) => (curr.height < prev.height ? curr : prev));

    shortestColumn.items.push(item);
    shortestColumn.height += estimatedHeight;
  });

  return cols.map((col) => col.items);
};

const shuffleArray = <T,>(array: T[]) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const MovieGallery = () => {
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MovieImagesProps>();

  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);

  const previewImages = useMemo(() => {
    const images = [...(movieImages?.backdrops ?? []), ...(movieImages?.posters ?? [])];

    return shuffleArray(images);
  }, [movieImages]);

  const columns = splitIntoColumns(previewImages, 2);

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
        />
      </Pressable>
    ),
    []
  );

  if (isMovieImagesLoading) return <Loader />;

  return (
    <Screen preset="auto" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="flex-row px-2 pt-12">
        {columns.map((column, columnIndex) => (
          <FlashList
            key={columnIndex}
            data={column}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, paddingTop: columnIndex === 1 ? 15 : 0 }}
          />
        ))}
      </View>

      <ImagePreviewModal
        image={selectedImage as MovieImagesProps}
        visible={visible}
        onHide={() => setVisible(false)}
      />
    </Screen>
  );
};

export default MovieGallery;
