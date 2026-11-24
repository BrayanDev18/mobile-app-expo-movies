import { Ionicons } from '@expo/vector-icons';
import { ImageZoom } from '@tudp/rn-image-zoom';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@/translate';

interface PhotoPreviewModalProps {
  visible: boolean;
  onHide: () => void;
  uri?: string | null;
  aspectRatio?: number;
}

export const PhotoPreviewModal = (props: PhotoPreviewModalProps) => {
  const { visible, onHide, uri, aspectRatio = 1 } = props;
  const { top } = useSafeAreaInsets();
  const { t } = useTranslate();

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
          accessibilityElementsHidden
          importantForAccessibility="no"
          onPress={onHide}
        />

        {uri ? (
          <ImageZoom
            uri={uri}
            minScale={1}
            maxScale={5}
            loadingColor="#3B82F6"
            style={{ width: '100%', aspectRatio }}
          />
        ) : null}

        <View style={{ position: 'absolute', top: top + 8, right: 16 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.closeImagePreview')}
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
