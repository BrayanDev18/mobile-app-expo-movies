import { MovieImagesProps } from '@/interfaces';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';

interface MovieGalleryModalProps {
  visible: boolean;
  onHide: () => void;
  image: MovieImagesProps;
}

export const MovieGalleryModal = (props: MovieGalleryModalProps) => {
  const { visible, onHide, image } = props;

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      onHide={onHide}
      backdrop={
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.9)' }]} />
      }
      animation={{ type: 'fade', duration: 380 }}
      onBackdropPress={onHide}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${image?.file_path}` }}
        style={{ width: '100%', aspectRatio: image?.aspect_ratio as number }}
        contentFit="fill"
      />
    </Modal>
  );
};
