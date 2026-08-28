import { CastImageProfileProps, MovieImagesProps } from '@/interfaces';
import { tmdbResize } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { ImageZoom } from '@tudp/rn-image-zoom';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PreviewImage = MovieImagesProps | CastImageProfileProps;

interface ImagePreviewModalProps {
  visible: boolean;
  onHide: () => void;
  image: PreviewImage;
}

const imageUri = (image?: PreviewImage): string | null => {
  if (!image) return null;

  const url = 'url' in image ? image.url : image.file_path;

  return tmdbResize(url, 'original');
};

const imageRatio = (image?: PreviewImage): number => {
  if (!image) return 1;

  const ratio = 'aspectRatio' in image ? image.aspectRatio : image.aspect_ratio;

  return ratio || 1;
};

export const ImagePreviewModal = (props: ImagePreviewModalProps) => {
  const { visible, onHide, image } = props;
  const { top } = useSafeAreaInsets();

  const uri = imageUri(image);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onHide}>
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.50)' }}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close image preview"
          onPress={onHide}
        />

        {uri ? (
          <ImageZoom
            uri={uri}
            minScale={1}
            maxScale={5}
            loadingColor="#3B82F6"
            style={{ width: '100%', aspectRatio: imageRatio(image) }}
          />
        ) : null}

        <View style={{ position: 'absolute', top: top + 8, right: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close image preview"
            onPress={onHide}>
            <BlurView
              tint="dark"
              intensity={40}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="close" size={22} color="white" />
            </BlurView>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
