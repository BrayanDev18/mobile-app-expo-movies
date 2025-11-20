import { MovieImagesProps } from '@/interfaces';
import { ImageZoom } from '@tudp/rn-image-zoom';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';

interface ImagePreviewModalProps {
  visible: boolean;
  onHide: () => void;
  image: MovieImagesProps;
}

export const ImagePreviewModal = (props: ImagePreviewModalProps) => {
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
      <View className="flex-1 items-center justify-center">
        <ImageZoom
          uri={image?.file_path as string}
          minScale={1}
          maxScale={5}
          loadingColor="#06b6d4"
          style={{ width: '100%', aspectRatio: image?.aspect_ratio as number }}
        />
      </View>
    </Modal>
  );
};
