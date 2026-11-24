import { CastImageProfileProps, MovieImagesProps } from '@/interfaces';
import { tmdbResize } from '@/utils';
import React from 'react';
import { PhotoPreviewModal } from './PhotoPreviewModal';

type PreviewImage = MovieImagesProps | CastImageProfileProps;

interface ImagePreviewModalProps {
  visible: boolean;
  onHide: () => void;
  image?: PreviewImage;
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

  return (
    <PhotoPreviewModal
      visible={visible}
      onHide={onHide}
      uri={imageUri(image)}
      aspectRatio={imageRatio(image)}
    />
  );
};
